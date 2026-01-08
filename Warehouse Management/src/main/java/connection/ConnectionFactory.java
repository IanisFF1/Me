package connection;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * ConnectionFactory este clasa responsabila pentru gestionarea conexiunilor cu baza de date.
 * Aceasta ofera metode pentru obtinerea si inchiderea conexiunilor, statement-urilor si result set-urilor.
 */
public class ConnectionFactory {

	private static final Logger LOGGER = Logger.getLogger(ConnectionFactory.class.getName());
	private static final String DRIVER = "com.mysql.cj.jdbc.Driver";
	private static final String DBURL = "jdbc:mysql://localhost:3306/tpProject";
	private static final String USER = "root";
	private static final String PASS = "andreapirlo321";

	private static ConnectionFactory singleInstance = new ConnectionFactory();

	private ConnectionFactory() {
		try {
			Class.forName(DRIVER);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}

	/**
	 * Creeaza o noua conexiune la baza de date.
	 * @return O conexiune la baza de date.
	 */
	private Connection createConnection() {
		Connection connection = null;
		try {
			connection = DriverManager.getConnection(DBURL, USER, PASS);
		} catch (SQLException e) {
			LOGGER.log(Level.WARNING, "An error occurred while trying to connect to the database");
			e.printStackTrace();
		}
		return connection;
	}

	/**
	 * Ofera o conexiune la baza de date folosind metoda createConnection().
	 * @return O conexiune la baza de date.
	 */
	public static Connection getConnection() {
		return singleInstance.createConnection();
	}

	/**
	 * Inchide conexiunea specificata.
	 * @param connection Conexiunea de inchis.
	 */
	public static void close(Connection connection) {
		if (connection != null) {
			try {
				connection.close();
			} catch (SQLException e) {
				LOGGER.log(Level.WARNING, "An error occurred while trying to close the connection");
			}
		}
	}

	/**
	 * Inchide statement-ul specificat.
	 * @param statement Statement-ul de inchis.
	 */
	public static void close(Statement statement) {
		if (statement != null) {
			try {
				statement.close();
			} catch (SQLException e) {
				LOGGER.log(Level.WARNING, "An error occurred while trying to close the statement");
			}
		}
	}

	/**
	 * Inchide ResultSet-ul specificat.
	 * @param resultSet ResultSet-ul de inchis.
	 */
	public static void close(ResultSet resultSet) {
		if (resultSet != null) {
			try {
				resultSet.close();
			} catch (SQLException e) {
				LOGGER.log(Level.WARNING, "An error occurred while trying to close the ResultSet");
			}
		}
	}
}
