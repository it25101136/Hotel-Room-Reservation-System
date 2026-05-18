package models;

/**
 * Component 03: Inheritance + Polymorphism
 * VIP customer: 15% discount on all bookings + free upgrades
 */
public class VIPCustomer extends Customer {

    public VIPCustomer(int id, String username, String password, String name,
                       String email, String phone, String address) {
        super(id, username, password, name, email, phone, address, "VIP");
    }

    @Override
    public double calculateDiscount(double amount) {
        // VIP customers: 15% discount
        return amount * 0.15;
    }
}
