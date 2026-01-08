package dao;


import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import connection.ConnectionFactory;

/**
 * AbstractDAO este o clasa generica care defineste operatiunile de baza pentru accesul la date
 * pentru orice tip de obiect T.
 * @param <T> Tipul de obiect pe care aceasta clasa il gestioneaza.
 */
public class AbstractDAO<T> {
	protected static final Logger LOGGER = Logger.getLogger(AbstractDAO.class.getName());

	private final Class<T> type;

	@SuppressWarnings("unchecked")
	public AbstractDAO() {
		this.type = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
	}

	/**
	 * Creeaza o interogare SQL pentru selectarea unei inregistrari pe baza unui camp specific.
	 * @param field Numele campului dupa care se face selectia.
	 * @return Interogarea SQL sub forma de sir de caractere.
	 */
	private String createSelectQuery(String field) {
		StringBuilder sb = new StringBuilder();
		sb.append("SELECT ");
		sb.append(" * ");
		sb.append(" FROM ");
		sb.append(type.getSimpleName());
		sb.append(" WHERE " + field + " =?");
		return sb.toString();
	}

	/**
	 * Creeaza o interogare SQL pentru inserarea unei noi inregistrari.
	 * @return Interogarea SQL sub forma de sir de caractere.
	 */
	private String createInsertQuery() {
		StringBuilder sb = new StringBuilder();
		sb.append("INSERT INTO ");
		sb.append(type.getSimpleName());
		sb.append(" (");

		boolean first = true;
		for (Field field : type.getDeclaredFields()) {
			if (!first) {
				sb.append(", ");
			}
			sb.append(field.getName());
			first = false;
		}

		sb.append(") VALUES (");

		first = true;
		for (Field field : type.getDeclaredFields()) {
			if (!first) {
				sb.append(", ");
			}
			sb.append("?");
			first = false;
		}

		sb.append(")");
		return sb.toString();
	}

	/**
	 * Creeaza o interogare SQL pentru actualizarea unei inregistrari existente.
	 * @return Interogarea SQL sub forma de sir de caractere.
	 */
	private String createUpdateQuery() {
		StringBuilder sb = new StringBuilder();
		sb.append("UPDATE ");
		sb.append(type.getSimpleName());
		sb.append(" SET ");

		boolean first = true;
		for (Field field : type.getDeclaredFields()) {
			if (!field.getName().equalsIgnoreCase("id")) {
				if (!first) {
					sb.append(", ");
				}
				sb.append(field.getName());
				sb.append(" = ?");
				first = false;
			}
		}

		sb.append(" WHERE id = ?");
		return sb.toString();
	}

	/**
	 * Creeaza o interogare SQL pentru stergerea unei inregistrari pe baza unui camp specific.
	 * @param field Numele campului dupa care se face stergerea.
	 * @return Interogarea SQL sub forma de sir de caractere.
	 */
	private String createDeleteQuery(String field) {
		return "DELETE FROM " + type.getSimpleName() + " WHERE " + field + " = ?";
	}

	/**
	 * Returneaza o lista cu toate obiectele de tip T din baza de date.
	 * @return Lista cu toate obiectele de tip T.
	 */
	public List<T> findAll() {
		Connection connection = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		String query = "SELECT * FROM " + type.getSimpleName();
		List<T> list = new ArrayList<>();
		try {
			connection = ConnectionFactory.getConnection();
			statement = connection.prepareStatement(query);
			resultSet = statement.executeQuery();
			list = createObjects(resultSet);
		} catch (SQLException e) {
			LOGGER.log(Level.WARNING, type.getName() + "DAO:findAll " + e.getMessage());
		} finally {
			ConnectionFactory.close(resultSet);
			ConnectionFactory.close(statement);
			ConnectionFactory.close(connection);
		}
		return list;
	}

	/**
	 * Gaseste o inregistrare in baza de date dupa ID-ul specificat.
	 * @param id ID-ul inregistrarii de gasit.
	 * @return Obiectul de tip T gasit, sau null dacă nu a fost gasit.
	 */
	public T findById(int id) {
		Connection connection = null;
		PreparedStatement statement = null;
		ResultSet resultSet = null;
		String query = createSelectQuery("id");
		try {
			connection = ConnectionFactory.getConnection();
			statement = connection.prepareStatement(query);
			statement.setInt(1, id);
			resultSet = statement.executeQuery();

			List<T> items = createObjects(resultSet);
			if (items.isEmpty()) {
				return null;
			}
			return items.get(0);

		} catch (SQLException e) {
			LOGGER.log(Level.WARNING, type.getName() + "DAO:findById " + e.getMessage());
		} finally {
			ConnectionFactory.close(resultSet);
			ConnectionFactory.close(statement);
			ConnectionFactory.close(connection);
		}
		return null;
	}

	/**
	 * Creeaza o lista de obiecte de tip T pe baza rezultatului unui set de rezultate.
	 * @param resultSet Setul de rezultate obtinut dintr-o interogare SQL.
	 * @return Lista de obiecte de tip T.
	 */
	private List<T> createObjects(ResultSet resultSet) {
		List<T> list = new ArrayList<T>();
		Constructor[] ctors = type.getDeclaredConstructors();
		Constructor ctor = null;
		for (int i = 0; i < ctors.length; i++) {
			ctor = ctors[i];
			if (ctor.getGenericParameterTypes().length == 0)
				break;
		}
		try {
			while (resultSet.next()) {
				ctor.setAccessible(true);
				T instance = (T) ctor.newInstance();
				for (Field field : type.getDeclaredFields()) {
					String fieldName = field.getName();
					Object value = resultSet.getObject(fieldName);
					PropertyDescriptor propertyDescriptor = new PropertyDescriptor(fieldName, type);
					Method method = propertyDescriptor.getWriteMethod();
					method.invoke(instance, value);
				}
				list.add(instance);
			}
		} catch (InstantiationException | IllegalAccessException | SecurityException | IllegalArgumentException
				 | InvocationTargetException | SQLException | IntrospectionException e) {
			e.printStackTrace();
		}
		return list;
	}

	/**
	 * Insereaza un nou obiect de tip T in baza de date.
	 * @param t Obiectul de tip T de inserat.
	 * @return Numarul de randuri afectate de operatiunea de inserare.
	 */
	public int insert(T t) {
		Connection connection = null;
		PreparedStatement statement = null;
		String query = createInsertQuery();
		int rowsAffected = 0;
		try {
			connection = ConnectionFactory.getConnection();
			statement = connection.prepareStatement(query);

			int i = 1;
			for (Field field : type.getDeclaredFields()) {
				field.setAccessible(true);
				statement.setObject(i, field.get(t));
				i++;
			}

			rowsAffected = statement.executeUpdate();
		} catch (SQLException | IllegalAccessException e) {
			LOGGER.log(Level.WARNING, type.getName() + "DAO:insert " + e.getMessage());
			e.printStackTrace();
		} finally {
			ConnectionFactory.close(statement);
			ConnectionFactory.close(connection);
		}
		return rowsAffected;
	}
	/**
	 * Actualizeaza un obiect de tip T existent in baza de date.
	 * @param t Obiectul de tip T de actualizat.
	 * @return 0 dacă actualizarea a avut succes, -1 în caz de esec.
	 */
	public int update(T t) {
		Connection connection = null;
		PreparedStatement statement = null;
		String query = createUpdateQuery();
		try {
			connection = ConnectionFactory.getConnection();
			statement = connection.prepareStatement(query);
			int index = 1;
			Field idField = null;
			for (Field field : type.getDeclaredFields()) {
				field.setAccessible(true);
				if (field.getName().equalsIgnoreCase("id")) {
					idField = field;
				} else {
					statement.setObject(index++, field.get(t));
				}
			}
			if (idField != null) {
				idField.setAccessible(true);
				statement.setObject(index, idField.get(t));
			}
			statement.executeUpdate();
			return 0;
		} catch (SQLException | IllegalAccessException e) {
			LOGGER.log(Level.INFO, "Failed to update the object: " + e.getMessage());
			return -1;
		} finally {
			ConnectionFactory.close(statement);
			ConnectionFactory.close(connection);
		}
	}
	/**
	 * Sterge o inregistrare din baza de date pe baza ID-ului specificat.
	 * @param id ID-ul inregistrarii de sters.
	 * @return Numarul de randuri afectate de operatiunea de stergere.
	 */
	public int delete(int id) {
		Connection connection = null;
		PreparedStatement statement = null;
		String query = createDeleteQuery("id");
		try {
			connection = ConnectionFactory.getConnection();
			statement = connection.prepareStatement(query);
			statement.setInt(1, id);
			return statement.executeUpdate();
		} catch (SQLException e) {
			LOGGER.log(Level.WARNING, type.getName() + "DAO:delete " + e.getMessage());
			e.printStackTrace();
			return 0;
		} finally {
			ConnectionFactory.close(statement);
			ConnectionFactory.close(connection);
		}
	}
}
