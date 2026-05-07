package models;

/**
 * Suite Room — 15 % service charge + LKR 25,000/night butler.
 * Matches frontend "Executive Suite" / "Presidential Suite".
 * Author: Member 1
 */
public class SuiteRoom extends Room {
    private static final double SERVICE_CHARGE = 0.15;
    private static final double BUTLER_PER_NIGHT = 25_000;

    public SuiteRoom(int roomNumber, double price, boolean available, String description) {
        super(roomNumber, "Suite", price, available, description);
    }

    @Override
    public double calculateFinalPrice(int nights) {
        double base = getPrice() * nights;
        return base + (base * SERVICE_CHARGE) + (BUTLER_PER_NIGHT * nights);
    }
}
