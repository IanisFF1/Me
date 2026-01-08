package model;

/**
 * Client este o clasa care reprezinta un client.
 */
public class Client {
    private int id;
    private String name;
    private String email;
    private String address;

    /**
     * Constructor implicit.
     */
    public Client() {

    }

    /**
     * Constructor care initializeaza un client cu toate atributele.
     * @param client_id ID-ul clientului.
     * @param name Numele clientului.
     * @param email Email-ul clientului.
     * @param address Adresa clientului.
     */
    public Client(int client_id, String name, String email, String address) {
        this.id = client_id;
        this.name = name;
        this.email = email;
        this.address = address;
    }

    /**
     * Constructor care initializeaza un client fara ID.
     * @param name Numele clientului.
     * @param email Email-ul clientului.
     * @param address Adresa clientului.
     */
    public Client(String name, String email, String address) {
        this.name = name;
        this.email = email;
        this.address = address;
    }

    /**
     * Returneaza ID-ul clientului.
     * @return ID-ul clientului.
     */
    public int getId() {
        return id;
    }

    /**
     * Seteaza ID-ul clientului.
     * @param id ID-ul de setat.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Returneaza numele clientului.
     * @return Numele clientului.
     */
    public String getName() {
        return name;
    }

    /**
     * Seteaza numele clientului.
     * @param name Numele de setat.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returneaza email-ul clientului.
     * @return Email-ul clientului.
     */
    public String getEmail() {
        return email;
    }

    /**
     * Seteaza email-ul clientului.
     * @param email Email-ul de setat.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Returneaza adresa clientului.
     * @return Adresa clientului.
     */
    public String getAddress() {
        return address;
    }

    /**
     * Seteaza adresa clientului.
     * @param address Adresa de setat.
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * Returneaza o reprezentare sub forma de sir de caractere a obiectului Client.
     * @return Reprezentarea sub forma de sir de caractere a obiectului Client.
     */
    @Override
    public String toString() {
        return "Client [id=" + id + ", name=" + name + ", address=" + address + ", email=" + email + "]";
    }
}
