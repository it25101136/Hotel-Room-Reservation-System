package models;

/**
 * Component 03: Customer Management
 * Inherits from User. Parent for RegularCustomer and VIPCustomer.
 */
public abstract class Customer extends User {
    private String address;     // Sri Lankan address
    private String customerType; // REGULAR or VIP

    public Customer(int id, String username, String password, String name,
                    String email, String phone, String address, String customerType) {
        super(id, username, password, name, email, phone, "CUSTOMER");
        this.address = address;
        this.customerType = customerType;
    }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCustomerType() { return customerType; }
    public void setCustomerType(String customerType) { this.customerType = customerType; }

    /** Polymorphism: Different discount calculations for different customer types */
    public abstract double calculateDiscount(double amount);

    public String toFileString() {
        return getId() + "|" + getUsername() + "|" + getPassword() + "|" + getName() + "|"
                + getEmail() + "|" + getPhone() + "|" + address + "|" + customerType;
    }

    @Override
    public String toString() {
        return String.format("Cust #%d | %s | %s | %s | %s | Type: %s",
                getId(), getName(), getUsername(), getEmail(), getPhone(), customerType);
    }
}
