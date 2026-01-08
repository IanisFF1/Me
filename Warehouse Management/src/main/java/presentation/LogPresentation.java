package presentation;

import bll.BillBLL;
import bll.TablesBLL;
import model.Bill;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.SQLException;
import java.util.List;

/**
 * LogPresentation este clasa responsabila pentru interfata grafica de prezentare a jurnalelor.
 * Aceasta ofera functionalitati pentru listarea jurnalelor si revenirea la meniul principal.
 */
public class LogPresentation extends JFrame {
    private JPanel panel1;
    private JTable logTable;
    private JButton listLogsButton;
    private JButton backButton;

    /**
     * Constructorul implicit care initializeaza interfata grafica.
     */
    public LogPresentation() {
        setTitle("Log Presentation");
        setSize(1500, 480);
        setDefaultCloseOperation(DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);

        // Creare componente
        logTable = new JTable(new DefaultTableModel(new Object[]{"id", "client_name", "quantity"}, 0));
        listLogsButton = new JButton("List Logs");
        backButton = new JButton("Back");

        // Setare layout și adăugare componente
        panel1 = new JPanel();
        panel1.setLayout(new BorderLayout());

        JPanel topPanel = new JPanel(new FlowLayout());
        topPanel.add(listLogsButton);

        JPanel centerPanel = new JPanel(new BorderLayout());
        centerPanel.add(new JScrollPane(logTable), BorderLayout.CENTER);

        JPanel bottomPanel = new JPanel(new FlowLayout());
        bottomPanel.add(backButton);

        panel1.add(topPanel, BorderLayout.NORTH);
        panel1.add(centerPanel, BorderLayout.CENTER);
        panel1.add(bottomPanel, BorderLayout.SOUTH);

        setContentPane(panel1);
        pack();

        // Adăugare action listeners
        listLogsButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    List<Bill> billList = BillBLL.listAll();
                    TablesBLL.generateTableHeader(logTable, billList);
                    TablesBLL.populateTable(logTable, billList);
                } catch (SQLException ex) {
                    throw new RuntimeException(ex);
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

        setVisible(true);
    }
}
