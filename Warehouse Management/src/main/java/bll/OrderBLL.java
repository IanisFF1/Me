package bll;

import dao.OrderDAO;
import model.OrderTable;
import model.Product;

import javax.swing.*;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * OrderBLL este clasa responsabila pentru logica de afaceri legata de entitatea OrderTable.
 * Aceasta ofera metode pentru gasirea, inserarea, actualizarea, stergerea si listarea comenzilor.
 */
public class OrderBLL {

    private static OrderDAO orderDAO = new OrderDAO();

    /**
     * Gaseste o comanda după ID.
     * @param id ID-ul comenzii de gasit.
     * @return Obiectul OrderTable gasit.
     * @throws NoSuchElementException Daca comanda cu ID-ul specificat nu este gasita.
     */
    public static OrderTable findOrderById(int id) {
        OrderTable order = orderDAO.findById(id);
        if (order == null) {
            throw new NoSuchElementException("The order with id = " + id + " was not found");
        }
        return order;
    }

    /**
     * aterge o comanda după ID.
     * @param id ID-ul comenzii de sters.
     * @return Numarul de randuri afectate de operatiunea de stergere.
     */
    public static int deleteOrder(int id) {
        return orderDAO.delete(id);
    }

    /**
     * Insereaza o noua comanda.
     * @param order Obiectul OrderTable de inserat.
     * @param textField JTextField pentru afisarea mesajelor catre utilizator.
     * @return -1 daca nu exista suficienta cantitate in stoc, altfel numarul de randuri afectate de operatiunea de inserare.
     */
    public static int insertOrder(OrderTable order, JTextField textField) {
        order.setClient_name(ClientBLL.findClientById(order.getClient_id()).getName());
        order.setProduct_name(ProductBLL.findProductById(order.getProduct_id()).getName());

        if (ProductBLL.findProductById(order.getProduct_id()).getQuantity() < order.getQuantity()) {
            textField.setText("Not enough quantity in stock");
            return -1;
        }

        order.setPrice(ProductBLL.findProductById(order.getProduct_id()).getPrice() * order.getQuantity());

        Product product = ProductBLL.findProductById(order.getProduct_id());
        product.setQuantity(product.getQuantity() - order.getQuantity());
        ProductBLL.updateProduct(product);
        textField.setText("Order successful");
        return orderDAO.insert(order);
    }

    /**
     * Actualizeaza o comanda existenta.
     * @param order Obiectul OrderTable de actualizat.
     * @return Numarul de randuri afectate de operatiunea de actualizare.
     */
    public static int updateOrder(OrderTable order) {
        return orderDAO.update(order);
    }

    /**
     * Returneaza o lista cu toate comenzile.
     * @return Lista cu toate obiectele OrderTable.
     */
    public static List<OrderTable> listAll() {
        return orderDAO.findAll();
    }
}
