package bll;

import java.util.List;
import java.util.NoSuchElementException;

import dao.ClientDAO;
import model.Client;

/**
 * ClientBLL este clasa responsabila pentru logica de afaceri legata de entitatea Client.
 * Aceasta interactioneaza cu ClientDAO pentru a executa operatiunile CRUD (Create, Read, Update, Delete).
 */
public class ClientBLL {

    private static ClientDAO clientDAO = new ClientDAO();

    /**
     * Gaseste un client după ID.
     * @param id ID-ul clientului de gasit.
     * @return Clientul gasit.
     * @throws NoSuchElementException Daca clientul nu este gasit.
     */
    public static Client findClientById(int id) {
        Client client = clientDAO.findById(id);
        if (client == null) {
            throw new NoSuchElementException("The client with id = " + id + " was not found!");
        }
        return client;
    }

    /**
     * Sterge un client dupa ID.
     * @param id ID-ul clientului de sters.
     * @return Numarul de randuri afectate de operatiunea de stergere.
     */
    public static int deleteClient(int id) {
        return clientDAO.delete(id);
    }

    /**
     * Insereaza un nou client in baza de date.
     * @param client Clientul de inserat.
     * @return Numarul de randuri afectate de operatiunea de inserare.
     */
    public static int insertClient(Client client) {

        return clientDAO.insert(client);

    }

    /**
     * Actualizeaza un client existent in baza de date.
     * @param client Clientul de actualizat.
     * @return Numarul de randuri afectate de operatiunea de actualizare.
     */
    public static int updateClient(Client client) {
        return clientDAO.update(client);
    }

    /**
     * Returneaza o lista cu toti clientii din baza de date.
     * @return Lista cu toti clientii.
     */
    public static List<Client> listAll() {
        return clientDAO.findAll();
    }

}
