package models;

/**
 * Component 07: Polymorphism - Premium service tier
 * (Spa, Personal Butler, Limousine etc.)
 */
public class PremiumService extends Service {
    private static final double LUXURY_TAX = 0.10; // 10% luxury tax

    public PremiumService(int serviceId, String name, double price, boolean available,
                          String description, String category) {
        super(serviceId, name, price, available, description, category);
    }

    @Override
    public double calculatePrice(int quantity) {
        // Premium: base * qty + 10% luxury tax
        double base = getPrice() * quantity;
        return base + (base * LUXURY_TAX);
    }

    @Override
    public String getTier() {
        return "PREMIUM";
    }
}
