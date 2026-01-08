package model;

/**
 * Bill este o inregistrare care reprezinta o factura.
 * @param id ID-ul facturii.
 * @param client_name Numele clientului.
 * @param quantity Cantitatea facturata.
 */
public record Bill(int id, String client_name, int quantity) {

}
