package models;

/**
 * Component 03: Inheritance + Polymorphism
 * Regular customer: 5% discount on all bookings
 */
public class RegularCustomer extends Customer {

    public RegularCustomer(int id, String username, String password, String name,
                           String email, String phone, String address) {
        super(id, username, password, name, email, phone, address, "REGULAR");
    }

    @Override
    public double calculateDiscount(double amount) {
        // Regular customers: 5% discount
        return amount * 0.05;
    }
}
