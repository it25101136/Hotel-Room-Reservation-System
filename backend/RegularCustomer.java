package models;

/**
 * Regular customer — 5 % discount on bookings.
 * Author: Member 3
 */
public class RegularCustomer extends Customer {
    public RegularCustomer(int id, String username, String password, String name,
                           String email, String phone, String address) {
        super(id, username, password, name, email, phone, address, "REGULAR");
    }

    @Override
    public double calculateDiscount(double amount) { return amount * 0.05; }
}
