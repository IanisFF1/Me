package bll;

import java.lang.reflect.Field;
import java.sql.SQLException;
import java.util.List;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;

/**
 * TablesBLL este clasa responsabila pentru generarea si popularea tabelelor JTable.
 * Aceasta ofera metode pentru generarea antetelor tabelelor si popularea acestora cu date.
 */
public class TablesBLL {

    /**
     * Genereaza antetul tabelului JTable pe baza campurilor primului obiect din lista de obiecte.
     * @param table JTable-ul care va fi populat cu antetul.
     * @param objects Lista de obiecte care contine datele.
     * @throws SQLException Daca apare o eroare la accesarea bazei de date.
     */
    public static void generateTableHeader(JTable table, List<?> objects) throws SQLException {
        if (objects.isEmpty()) {
            return;
        }

        DefaultTableModel model = (DefaultTableModel) table.getModel();
        model.setColumnCount(0);
        model.setRowCount(0);

        // Presupunând că primul obiect conține câmpurile necesare pentru generarea antetului
        Object firstObject = objects.get(0);
        Field[] fields = firstObject.getClass().getDeclaredFields();
        String[] headers = new String[fields.length];

        for (int i = 0; i < fields.length; i++) {
            headers[i] = fields[i].getName();
        }

        model.setColumnIdentifiers(headers);
    }

    /**
     * Populeaza tabelul JTable cu datele din lista de obiecte.
     * @param table JTable-ul care va fi populat cu date.
     * @param objects Lista de obiecte care contine datele.
     * @throws SQLException Daca apare o eroare la accesarea bazei de date.
     */
    public static void populateTable(JTable table, List<?> objects) throws SQLException {
        if (objects.isEmpty()) {
            return;
        }

        DefaultTableModel model = (DefaultTableModel) table.getModel();
        model.setRowCount(0);

        for (Object obj : objects) {
            Field[] fields = obj.getClass().getDeclaredFields();
            Object[] rowData = new Object[fields.length];

            for (int i = 0; i < fields.length; i++) {
                fields[i].setAccessible(true);
                try {
                    rowData[i] = fields[i].get(obj);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }

            model.addRow(rowData);
        }
    }
}
