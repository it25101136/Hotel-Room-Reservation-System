package models;

/**
 * Component 01: Inheritance from Room
 * Suite Room - matches frontend "Executive Suite" / "Presidential Suite"
 */
public class SuiteRoom extends Room {
    private static final double SERVICE_CHARGE_RATE = 0.15; // 15% service charge
    private static final double BUTLER_CHARGE = 25000;       // LKR 25,000/night butler service

    public SuiteRoom(int roomNumber, double price, boolean available, String description) {
        super(roomNumber, "Suite", price, available, description);
    }

    @Override
    public double calculateFinalPrice(int nights) {
        // Suite: base price * nights + 15% service charge + butler service
        double base = getPrice() * nights;
        double serviceCharge = base * SERVICE_CHARGE_RATE;
        double butler = BUTLER_CHARGE * nights;
        return base + serviceCharge + butler;
    }
}
