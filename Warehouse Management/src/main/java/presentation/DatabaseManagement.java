package presentation;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * DatabaseManagement este clasa responsabila pentru interfata grafica de gestionare a bazei de date.
 * Aceasta ofera butoane pentru accesarea diferitelor functionalitati legate de clienti, produse, jurnale si comenzi.
 */
public class DatabaseManagement extends JFrame {

    /**
     * Constructorul implicit care initializeaza interfata grafica.
     */
    public DatabaseManagement() {
        setTitle("Database Management");
        setSize(640, 480);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        // Creare etichetă cu același titlu ca și fereastra
        JLabel titleLabel = new JLabel(getTitle(), JLabel.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));

        // Creare panou pentru a conține butoanele
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new FlowLayout(FlowLayout.CENTER, 20, 20));

        // Creare butoane
        JButton clientsButton = new JButton("Clients");
        JButton productsButton = new JButton("Products");
        JButton logsButton = new JButton("Logs");
        JButton ordersButton = new JButton("Orders");

        clientsButton.setFocusable(false);
        productsButton.setFocusable(false);
        logsButton.setFocusable(false);
        ordersButton.setFocusable(false);

        // Adăugare action listeners pentru butoane
        clientsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                new ClientPresentation();
                dispose();
            }
        });

        productsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                new ProductPresentation();
                dispose();
            }
        });

        logsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                new LogPresentation();
                dispose();
            }
        });

        ordersButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                new OrderPresentation();
                dispose();
            }
        });

        // Adăugare butoane la panou
        buttonPanel.add(clientsButton);
        buttonPanel.add(productsButton);
        buttonPanel.add(logsButton);
        buttonPanel.add(ordersButton);

        // Adăugare componente la fereastră
        setLayout(new BorderLayout());
        add(titleLabel, BorderLayout.NORTH);
        add(buttonPanel, BorderLayout.CENTER);

        setVisible(true);
    }

    /**
     * Metoda main care lanseaza aplicatia.
     * @param args Argumente de linie de comanda.
     */
    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new DatabaseManagement();
            }
        });
    }
}
