package bll;

import dao.ProductDAO;
import model.Product;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * ProductBLL este clasa responsabila pentru logica de afaceri legata de entitatea Product.
 * Aceasta ofera metode pentru gasirea, inserarea, actualizarea, stergerea si listarea produselor.
 */
public class ProductBLL {

    private static ProductDAO productDAO = new ProductDAO();

    /**
     * Gaseste un produs dupa ID.
     * @param id ID-ul produsului de gasit.
     * @return Obiectul Product gasit.
     * @throws NoSuchElementException Daca produsul cu ID-ul specificat nu este gasit.
     */
    public static Product findProductById(int id) {
        Product product = productDAO.findById(id);
        if (product == null) {
            throw new NoSuchElementException("The product with id = " + id + " was not found");
        }
        return product;
    }

    /**
     * Sterge un produs dupa ID.
     * @param id ID-ul produsului de sters.
     * @return Numarul de randuri afectate de operatiunea de stergere.
     */
    public static int deleteProduct(int id) {
        return productDAO.delete(id);
    }

    /**
     * Insereaza un nou produs.
     * @param product Obiectul Product de inserat.
     * @return Numarul de randuri afectate de operatiunea de inserare.
     */
    public static int insertProduct(Product product) {
        return productDAO.insert(product);
    }

    /**
     * Actualizeaza un produs existent.
     * @param product Obiectul Product de actualizat.
     * @return Numarul de randuri afectate de operatiunea de actualizare.
     */
    public static int updateProduct(Product product) {
        return productDAO.update(product);
    }

    /**
     * Returneaza o lista cu toate produsele.
     * @return Lista cu toate obiectele Product.
     */
    public static List<Product> listAll() {
        return productDAO.findAll();
    }
}
