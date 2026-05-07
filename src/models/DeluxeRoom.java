package models;

/**
 * Component 01: Inheritance from Room
 * Deluxe Room - matches frontend "Deluxe Room" at LKR 150,000/night
 */
public class DeluxeRoom extends Room {
    private static final double SERVICE_CHARGE_RATE = 0.10; // 10% service charge

    public DeluxeRoom(int roomNumber, double price, boolean available, String description) {
        super(roomNumber, "Deluxe", price, available, description);
    }

    @Override
    public double calculateFinalPrice(int nights) {
        // Deluxe: base price * nights + 10% service charge
        double base = getPrice() * nights;
        return base + (base * SERVICE_CHARGE_RATE);
    }
}
