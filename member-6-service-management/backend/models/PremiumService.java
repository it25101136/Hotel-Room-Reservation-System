package models;

/** Premium service — +10% luxury tax. Author: Member 6 */
public class PremiumService extends Service {
    private static final double LUXURY_TAX = 0.10;

    public PremiumService(int serviceId, String name, double price, boolean available,
                          String description, String category) {
        super(serviceId, name, price, available, description, category);
    }

    @Override
    public double calculatePrice(int quantity) {
        double base = getPrice() * quantity;
        return base + (base * LUXURY_TAX);
    }

    @Override public String getTier() { return "PREMIUM"; }
}
