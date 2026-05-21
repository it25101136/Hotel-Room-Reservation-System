package models;

/**
 * Component 07: Polymorphism - Basic service tier
 * (Wi-Fi, breakfast, parking etc.)
 */
public class BasicService extends Service {

    public BasicService(int serviceId, String name, double price, boolean available,
                        String description, String category) {
        super(serviceId, name, price, available, description, category);
    }

    @Override
    public double calculatePrice(int quantity) {
        // Basic: simple base * qty (no extra tax)
        return getPrice() * quantity;
    }

    @Override
    public String getTier() {
        return "BASIC";
    }
}
