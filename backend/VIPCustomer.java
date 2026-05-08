package models;

/**
 * VIP customer — 15 % discount on bookings.
 * Author: Member 3
 */
public class VIPCustomer extends Customer {
    public VIPCustomer(int id, String username, String password, String name,
                       String email, String phone, String address) {
        super(id, username, password, name, email, phone, address, "VIP");
    }

    @Override
    public double calculateDiscount(double amount) { return amount * 0.15; }
}
