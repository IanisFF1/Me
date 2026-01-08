package presentation;

import bll.TablesBLL;
import model.Client;
import bll.ClientBLL;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.SQLException;
import java.util.List;

/**
 * ClientPresentation este clasa responsabila pentru interfata grafica de prezentare a clientilor.
 * Aceasta ofera functionalitati pentru listarea, inserarea, actualizarea si stergerea clientilor.
 */
public class ClientPresentation extends JFrame {
    private JButton listClientsButton;
    private JTable clientsTable;
    private JComboBox<Client> clientComboBox;
    private JButton deleteClientButton;
    private JTextField nameField;
    private JTextField emailField;
    private JTextField addressField;
    private JButton insertClientButton;
    private JButton updateClientButton;
    private JButton backButton;

    /**
     * Constructorul implicit care initializeaza interfata grafica.
     */
    public ClientPresentation() {
        setTitle("Clients Presentation");
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setMinimumSize(new Dimension(640, 480));
        setLocationRelativeTo(null);

        // Crearea componentelor
        listClientsButton = new JButton("List Clients");
        clientsTable = new JTable(new DefaultTableModel(new Object[]{"id", "name", "email", "address"}, 0));
        clientComboBox = new JComboBox<>();
        deleteClientButton = new JButton("Delete Client");
        nameField = new JTextField(15);
        emailField = new JTextField(15);
        addressField = new JTextField(15);
        insertClientButton = new JButton("Insert Client");
        updateClientButton = new JButton("Update Client");
        backButton = new JButton("Back");

        // Setarea layout-ului și adăugarea componentelor
        JPanel panel1 = new JPanel();
        panel1.setLayout(new BorderLayout());

        JPanel topPanel = new JPanel(new FlowLayout());
        topPanel.add(new JLabel("Name:"));
        topPanel.add(nameField);
        topPanel.add(new JLabel("Email:"));
        topPanel.add(emailField);
        topPanel.add(new JLabel("Address:"));
        topPanel.add(addressField);
        topPanel.add(insertClientButton);
        topPanel.add(updateClientButton);

        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.add(new JScrollPane(clientsTable), BorderLayout.CENTER);
        centerPanel.add(deleteClientButton, BorderLayout.SOUTH);

        JPanel bottomPanel = new JPanel(new FlowLayout());
        bottomPanel.add(new JLabel("Select Client:"));
        bottomPanel.add(clientComboBox);
        bottomPanel.add(backButton);
        bottomPanel.add(listClientsButton);

        panel1.add(topPanel, BorderLayout.NORTH);
        panel1.add(centerPanel, BorderLayout.CENTER);
        panel1.add(bottomPanel, BorderLayout.SOUTH);

        setContentPane(panel1);
        pack();
        List<Client> clients = ClientBLL.listAll();
        populateComboBox(clients);

        // Adăugarea listener-elor pentru acțiuni
        insertClientButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String name = nameField.getText();
                String email = emailField.getText();
                String address = addressField.getText();
                Client client = new Client(name, email, address);
                ClientBLL.insertClient(client);

                clients.add(client);
                populateComboBox(clients);


            }
        });

        updateClientButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Client client = (Client) clientComboBox.getSelectedItem();
                if (client != null) {
                    if (!nameField.getText().isEmpty()) {
                        client.setName(nameField.getText());
                    }
                    if (!emailField.getText().isEmpty()) {
                        client.setEmail(emailField.getText());
                    }
                    if (!addressField.getText().isEmpty()) {
                        client.setAddress(addressField.getText());
                    }
                    ClientBLL.updateClient(client);
                }
            }
        });

        deleteClientButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Client client = (Client) clientComboBox.getSelectedItem();
                if (client != null) {
                    ClientBLL.deleteClient(client.getId());
                    clients.remove(client);
                    clientComboBox.removeItem(client);
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

        listClientsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                List<Client> clients = ClientBLL.listAll();
                try {
                    TablesBLL.generateTableHeader(clientsTable, clients);
                    TablesBLL.populateTable(clientsTable, clients);
                } catch (SQLException ex) {
                    throw new RuntimeException(ex);
                }
            }
        });

        clientComboBox.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Client selectedClient = (Client) clientComboBox.getSelectedItem();
                if (selectedClient != null) {
                    nameField.setText(selectedClient.getName());
                    emailField.setText(selectedClient.getEmail());
                    addressField.setText(selectedClient.getAddress());
                }
            }
        });



        setVisible(true);
    }

    void populateComboBox(List<Client> clients) {
        clientComboBox.removeAllItems();
        clients = ClientBLL.listAll();
        for(Client client: clients) {
            clientComboBox.addItem(client);
        }
    }
}
