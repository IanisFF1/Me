package bll;

import dao.BillDAO;
import model.Bill;

import java.sql.SQLException;
import java.util.List;

/**
 * BillBLL este clasa responsabila pentru logica de afaceri legata de entitatea Bill.
 * Aceasta ofera metode pentru listarea si inserarea facturilor.
 */
public class BillBLL {
    private static BillDAO billDAO = new BillDAO();

    /**
     * Returneaza o lista cu toate facturile.
     * @return Lista cu toate obiectele Bill.
     * @throws SQLException Daca apare o eroare la accesarea bazei de date.
     */
    public static List<Bill> listAll() throws SQLException {
        return billDAO.getAllBills();
    }

    /**
     * Insereaza o noua factura.
     * @param bill Obiectul Bill de inserat.
     * @return Numarul de randuri afectate de operatiunea de inserare.
     * @throws SQLException Daca apare o eroare la accesarea bazei de date.
     */
    public static int insertBill(Bill bill) throws SQLException {
        return billDAO.insertBill(bill);
    }
}
