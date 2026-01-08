package dao;

import model.Product;

/**
 * ProductDAO este clasa responsabila pentru operatiunile de acces la date specifice entitatii Product.
 * Aceasta extinde clasa abstracta AbstractDAO<Product> si mosteneste toate metodele CRUD de baza.
 * @see Product
 */
public class ProductDAO extends AbstractDAO<Product> {
    // Toate metodele CRUD (Create, Read, Update, Delete) sunt moștenite din clasa AbstractDAO
}
