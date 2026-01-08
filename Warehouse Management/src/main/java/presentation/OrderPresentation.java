package presentation;

import bll.ClientBLL;
import bll.OrderBLL;
import bll.ProductBLL;
import bll.TablesBLL;
import dao.BillDAO;
import model.Bill;
import model.Client;
import model.OrderTable;
import model.Product;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.SQLException;
import java.util.List;

/**
 * OrderPresentation este clasa responsabila pentru interfata grafica de prezentare a comenzilor.
 * Aceasta ofera functionalitati pentru listarea, crearea si anularea comenzilor, precum si revenirea la meniul principal.
 */
public class OrderPresentation extends JFrame {
    private JPanel panel1;
    private JButton listOrdersButton;
    private JTable ordersTable;
    private JButton backButton;
    private JComboBox<Client> orderClientComboBox;
    private JComboBox<Product> orderProductComboBox;
    private JTextField orderQuantityField;
    private JButton createOrderButton;
    private JTextField statusField;
    private JTextField cancelIdField;
    private JButton cancelOrderButton;

    /**
     * Constructorul implicit care initializeaza interfata grafica.
     */
    public OrderPresentation() {
        setTitle("Order Presentation");
        setMinimumSize(new Dimension(1500, 480));
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        // Creare componente
        listOrdersButton = new JButton("List Orders");
        ordersTable = new JTable(new DefaultTableModel(new Object[]{"id", "client_id", "product_id", "client_name", "product_name", "quantity", "price"}, 0));
        orderClientComboBox = new JComboBox<>();
        orderProductComboBox = new JComboBox<>();
        orderQuantityField = new JTextField(15);
        createOrderButton = new JButton("Create Order");
        statusField = new JTextField(15);
        cancelIdField = new JTextField(15);
        cancelOrderButton = new JButton("Cancel Order");
        backButton = new JButton("Back");

        // Setare layout și adăugare componente
        panel1 = new JPanel();
        panel1.setLayout(new BorderLayout());

        JPanel topPanel = new JPanel(new FlowLayout());
        topPanel.add(new JLabel("Client:"));
        topPanel.add(orderClientComboBox);
        topPanel.add(new JLabel("Product:"));
        topPanel.add(orderProductComboBox);
        topPanel.add(new JLabel("Quantity:"));
        topPanel.add(orderQuantityField);
        topPanel.add(createOrderButton);

        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.add(new JScrollPane(ordersTable), BorderLayout.CENTER);

        JPanel bottomPanel = new JPanel(new FlowLayout());
        bottomPanel.add(new JLabel("Cancel Order ID:"));
        bottomPanel.add(cancelIdField);
        bottomPanel.add(cancelOrderButton);
        bottomPanel.add(backButton);
        bottomPanel.add(listOrdersButton);

        panel1.add(topPanel, BorderLayout.NORTH);
        panel1.add(centerPanel, BorderLayout.CENTER);
        panel1.add(bottomPanel, BorderLayout.SOUTH);

        setContentPane(panel1);
        pack();

        // Populare combo boxes cu clienți și produse
        List<Client> clientList = ClientBLL.listAll();
        List<Product> productList = ProductBLL.listAll();
        for (Client client : clientList) {
            orderClientComboBox.addItem(client);
        }
        for (Product product : productList) {
            orderProductComboBox.addItem(product);
        }

        // Adăugare action listeners
        createOrderButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Client client = (Client) orderClientComboBox.getSelectedItem();
                Product product = (Product) orderProductComboBox.getSelectedItem();
                int orderQuantity = Integer.parseInt(orderQuantityField.getText());

                OrderTable order = new OrderTable(client.getId(), product.getId(), orderQuantity);
                int isValid = OrderBLL.insertOrder(order, statusField);
                if (isValid != -1) {
                    product.setQuantity(product.getQuantity() - order.getQuantity());
                }
                Bill bill = new Bill(order.getId(), client.getName(), orderQuantity);
                try {
                    BillDAO.insertBill(bill);
                } catch (SQLException ex) {
                    throw new RuntimeException(ex);
                }
            }
        });

        cancelOrderButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                OrderBLL.deleteOrder(Integer.parseInt(cancelIdField.getText()));
            }
        });

        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                new DatabaseManagement();
                dispose();
            }
        });

        listOrdersButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                List<OrderTable> orderTableList = OrderBLL.listAll();
                try {
                    TablesBLL.generateTableHeader(ordersTable, orderTableList);
                    TablesBLL.populateTable(ordersTable, orderTableList);
                } catch (SQLException ex) {
                    throw new RuntimeException(ex);
                }
            }
        });

        setVisible(true);
    }
}
