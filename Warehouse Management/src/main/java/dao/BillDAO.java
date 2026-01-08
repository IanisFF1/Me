package dao;

import connection.ConnectionFactory;
import model.Bill;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import connection.ConnectionFactory;
import model.Bill;

/**
 * BillDAO este clasa responsabila pentru operatiunile de acces la date specifice entitatii Bill.
 * Aceasta include metode pentru obtinerea tuturor facturilor si inserarea unei noi facturi în baza de date.
 */
public class BillDAO {
    protected static final Logger LOGGER = Logger.getLogger(BillDAO.class.getName());

    /**
     * Obtine o lista cu toate obiectele Bill din baza de date.
     * @return O lista cu toate obiectele Bill.
     * @throws SQLException Daca apare o eroare la accesarea bazei de date.
     */
    public List<Bill> getAllBills() throws SQLException {
        String query = "SELECT id, client_name, quantity FROM Log";
        List<Bill> bills = new ArrayList<>();

        try (Connection connection = ConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(query);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String client_name = resultSet.getString("client_name");
                int quantity = resultSet.getInt("quantity");

                Bill bill = new Bill(id, client_name, quantity);
                bills.add(bill);
            }
        }

        return bills;
    }

    /**
     * Insereaza un nou obiect Bill in baza de date.
     * @param bill Obiectul Bill de inserat.
     * @return 0 dacă inserarea a avut succes.
     * @throws SQLException Daca apare o eroare la accesarea bazei de date.
     */
    public static int insertBill(Bill bill) throws SQLException {
        String query = "INSERT INTO Log (client_name, quantity) VALUES (?, ?)";
        try (Connection connection = ConnectionFactory.getConnection();
             PreparedStatement statement = connection.prepareStatement(query)) {

            statement.setString(1, bill.client_name());
            statement.setDouble(2, bill.quantity());
            statement.executeUpdate();
        }
        return 0;
    }
}

