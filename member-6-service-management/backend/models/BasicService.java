package models;

/** Basic service — flat price × quantity. Author: Member 6 */
public class BasicService extends Service {
    public BasicService(int serviceId, String name, double price, boolean available,
                        String description, String category) {
        super(serviceId, name, price, available, description, category);
    }

    @Override public double calculatePrice(int quantity) { return getPrice() * quantity; }
    @Override public String getTier() { return "BASIC"; }
}
