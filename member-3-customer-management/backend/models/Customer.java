package models;

/** Customer abstract class — Encapsulation + Inheritance. Author: Member 3 */
public abstract class Customer extends User {
    private String address;
    private String customerType;

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
    public abstract double calculateDiscount(double amount);

    public String toFileString() {
        return getId() + "|" + getUsername() + "|" + getPassword() + "|" + getName() + "|"
                + getEmail() + "|" + getPhone() + "|" + address + "|" + customerType;
    }

    @Override
    public String toString() {
        return String.format("Cust #%d | %s | %s | %s | %s",
                getId(), getName(), getUsername(), getEmail(), customerType);
    }
}
