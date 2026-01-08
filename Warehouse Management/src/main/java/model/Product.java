package model;

/**
 * Product este o clasa care reprezinta un produs.
 */
public class Product {

    private int id;
    private String name;
    private int price;
    private int quantity;

    /**
     * Constructor care initializeaza un produs cu toate atributele.
     * @param product_id ID-ul produsului.
     * @param name Numele produsului.
     * @param price Pretul produsului.
     * @param quantity Cantitatea produsului.
     */
    public Product(int product_id, String name, int price, int quantity) {
        this.id = product_id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    /**
     * Constructor care initializeaza un produs fara ID.
     * @param name Numele produsului.
     * @param quantity Cantitatea produsului.
     * @param price Pretul produsului.
     */
    public Product(String name, int quantity, int price) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    /**
     * Constructor implicit.
     */
    public Product() {

    }

    /**
     * Returneaza ID-ul produsului.
     * @return ID-ul produsului.
     */
    public int getId() {
        return id;
    }

    /**
     * Seteaza ID-ul produsului.
     * @param id ID-ul de setat.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * Returneaza numele produsului.
     * @return Numele produsului.
     */
    public String getName() {
        return name;
    }

    /**
     * Seteaza numele produsului.
     * @param name Numele de setat.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Returneaza pretul produsului.
     * @return Pretul produsului.
     */
    public int getPrice() {
        return price;
    }

    /**
     * Seteaza pretul produsului.
     * @param price Pretul de setat.
     */
    public void setPrice(int price) {
        this.price = price;
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
     * Returneaza o reprezentare sub forma de sir de caractere a obiectului Product.
     * @return Reprezentarea sub forma de sir de caractere a obiectului Product.
     */
    @Override
    public String toString() {
        return "Product [id=" + id + ", name=" + name + ", quantity=" + quantity + ", price=" + price + "]";
    }
}
