package presentation;

import bll.ProductBLL;
import bll.TablesBLL;
import model.Product;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.SQLException;
import java.util.List;

/**
 * ProductPresentation este clasa responsabila pentru interfata grafica de prezentare a produselor.
 * Aceasta ofera functionalitati pentru listarea, inserarea, actualizarea si stergerea produselor.
 */
public class ProductPresentation extends JFrame {
    private JButton listProductsButton;
    private JTable productsTable;
    private JComboBox<Product> productComboBox;
    private JButton deleteProductButton;
    private JTextField nameField;
    private JTextField quantityField;
    private JTextField priceField;
    private JButton insertProductButton;
    private JButton updateProductButton;
    private JButton backButton;

    /**
     * Constructorul implicit care initializeaza interfata grafica.
     */
    public ProductPresentation() {
        setTitle("Products Presentation");
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setMinimumSize(new Dimension(640, 480));
        setLocationRelativeTo(null);

        // Creare componente
        listProductsButton = new JButton("List Products");
        productsTable = new JTable(new DefaultTableModel(new Object[]{"id", "name", "price", "quantity"}, 0));
        productComboBox = new JComboBox<>();
        deleteProductButton = new JButton("Delete Product");
        nameField = new JTextField(15);
        quantityField = new JTextField(15);
        priceField = new JTextField(15);
        insertProductButton = new JButton("Insert Product");
        updateProductButton = new JButton("Update Product");
        backButton = new JButton("Back");

        // Setare layout și adăugare componente
        JPanel panel1 = new JPanel();
        panel1.setLayout(new BorderLayout());

        JPanel topPanel = new JPanel(new FlowLayout());
        topPanel.add(new JLabel("Name:"));
        topPanel.add(nameField);
        topPanel.add(new JLabel("Quantity:"));
        topPanel.add(quantityField);
        topPanel.add(new JLabel("Price:"));
        topPanel.add(priceField);
        topPanel.add(insertProductButton);
        topPanel.add(updateProductButton);

        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.add(new JScrollPane(productsTable), BorderLayout.CENTER);
        centerPanel.add(deleteProductButton, BorderLayout.SOUTH);

        JPanel bottomPanel = new JPanel(new FlowLayout());
        bottomPanel.add(new JLabel("Select Product:"));
        bottomPanel.add(productComboBox);
        bottomPanel.add(backButton);
        bottomPanel.add(listProductsButton);

        panel1.add(topPanel, BorderLayout.NORTH);
        panel1.add(centerPanel, BorderLayout.CENTER);
        panel1.add(bottomPanel, BorderLayout.SOUTH);

        setContentPane(panel1);
        pack();

        // Populare listă produse
        List<Product> products = ProductBLL.listAll();
        populateComboBox(products);

        // Adăugare action listeners
        insertProductButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String name = nameField.getText();
                String quantity = quantityField.getText();
                String price = priceField.getText();
                Product product = new Product(name, Integer.parseInt(quantity), Integer.parseInt(price));
                ProductBLL.insertProduct(product);

                products.add(product);
                populateComboBox(products);
            }
        });

        updateProductButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Product product = (Product) productComboBox.getSelectedItem();
                if (product != null) {
                    if (!nameField.getText().isEmpty()) {
                        product.setName(nameField.getText());
                    }
                    if (!quantityField.getText().isEmpty()) {
                        product.setQuantity(Integer.parseInt(quantityField.getText()));
                    }
                    if (!priceField.getText().isEmpty()) {
                        product.setPrice(Integer.parseInt(priceField.getText()));
                    }
                    ProductBLL.updateProduct(product);
                }
            }
        });

        deleteProductButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Product product = (Product) productComboBox.getSelectedItem();
                if (product != null) {
                    ProductBLL.deleteProduct(product.getId());
                    productComboBox.removeItem(product);
                    products.remove(product);
                }
            }
        });

        backButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                new DatabaseManagement();
                dispose();
            }
        });

        listProductsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                List<Product> productList = ProductBLL.listAll();
                try {
                    TablesBLL.generateTableHeader(productsTable, productList);
                    TablesBLL.populateTable(productsTable, productList);
                } catch (SQLException ex) {
                    throw new RuntimeException(ex);
                }
            }
        });

        productComboBox.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Product selectedProduct = (Product) productComboBox.getSelectedItem();
                if (selectedProduct != null) {
                    nameField.setText(selectedProduct.getName());
                    quantityField.setText(String.valueOf(selectedProduct.getQuantity()));
                    priceField.setText(String.valueOf(selectedProduct.getPrice()));
                }
            }
        });

        setVisible(true);
    }

    void populateComboBox(List<Product> products) {
        productComboBox.removeAllItems();
        products = ProductBLL.listAll();
        for(Product product: products) {
            productComboBox.addItem(product);
        }
    }
}
