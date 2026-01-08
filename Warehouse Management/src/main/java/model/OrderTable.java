package model;

/**
 * OrderTable este o clasa care reprezinta o comanda.
 */
public class OrderTable {
    private int id;
    private int client_id;
    private int product_id;
    private String client_name;
    private String product_name;
    private int quantity;
    private int price;

    /**
     * Constructor care initializeaza o comanda cu toate atributele.
     * @param id ID-ul comenzii.
     * @param clientId ID-ul clientului.
     * @param productId ID-ul produsului.
     * @param clientName Numele clientului.
     * @param productName Numele produsului.
     * @param quantity Cantitatea produsului.
     * @param price Pretul comenzii.
     */
    public OrderTable(int id, int clientId, int productId, String clientName, String productName, int quantity, int price) {
        this.id = id;
        this.client_id = clientId;
        this.product_id = productId;
        this.client_name = clientName;
        this.product_name = productName;
        this.quantity = quantity;
        this.price = price;
    }

    /**
     * Constructor care initializeaza o comanda fara ID.
     * @param clientId ID-ul clientului.
     * @param productId ID-ul produsului.
     * @param clientName Numele clientului.
     * @param productName Numele produsului.
     * @param quantity Cantitatea produsului.
     * @param price Pretul comenzii.
     */
    public OrderTable(int clientId, int productId, String clientName, String productName, int quantity, int price) {
        this.client_id = clientId;
        this.product_id = productId;
        this.client_name = clientName;
        this.product_name = productName;
        this.quantity = quantity;
        this.price = price;
    }

    /**
     * Constructor implicit.
     */
    public OrderTable() {

    }

    /**
     * Constructor care initializeaza o comanda cu ID-ul clientului, ID-ul produsului si cantitatea comenzii.
     * @param id_client ID-ul clientului.
     * @param id_product ID-ul produsului.
     * @param orderQuantity Cantitatea produsului comandata.
     */
    public OrderTable(int id_client, int id_product, int orderQuantity) {
        this.client_id = id_client;
        this.product_id = id_product;
        this.quantity = orderQuantity;
    }

    /**
     * Returneaza ID-ul comenzii.
     * @return ID-ul comenzii.
     */
    public int getId() {
        return id;
    }

    /**
     * Seteaza ID-ul comenzii.
     * @param id ID-ul de setat.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Returneaza ID-ul clientului.
     * @return ID-ul clientului.
     */
    public int getClient_id() {
        return client_id;
    }

    /**
     * Seteaza ID-ul clientului.
     * @param client_id ID-ul de setat.
     */
    public void setClient_id(int client_id) {
        this.client_id = client_id;
    }

    /**
     * Returneaza ID-ul produsului.
     * @return ID-ul produsului.
     */
    public int getProduct_id() {
        return product_id;
    }

    /**
     * Seteaza ID-ul produsului.
     * @param product_id ID-ul de setat.
     */
    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }

    /**
     * Returneaza numele clientului.
     * @return Numele clientului.
     */
    public String getClient_name() {
        return client_name;
    }

    /**
     * Seteaza numele clientului.
     * @param client_name Numele de setat.
     */
    public void setClient_name(String client_name) {
        this.client_name = client_name;
    }

    /**
     * Returneaza numele produsului.
     * @return Numele produsului.
     */
    public String getProduct_name() {
        return product_name;
    }

    /**
     * Seteaza numele produsului.
     * @param product_name Numele de setat.
     */
    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    /**
     * Returneaza cantitatea produsului.
     * @return Cantitatea produsului.
     */
    public int getQuantity() {
        return quantity;
    }

    /**
     * Seteaza cantitatea produsului.
     * @param quantity Cantitatea de setat.
     */
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    /**
     * Returneaza pretul comenzii.
     * @return Pretul comenzii.
     */
    public int getPrice() {
        return price;
    }

    /**
     * Seteaza pretul comenzii.
     * @param price Pretul de setat.
     */
    public void setPrice(int price) {
        this.price = price;
    }
}
