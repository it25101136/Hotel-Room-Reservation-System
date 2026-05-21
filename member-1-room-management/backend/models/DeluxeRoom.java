package models;

/**
 * Deluxe Room — 10 % service charge.
 * Matches frontend "Deluxe Room" at LKR 150,000/night.
 * Author: Member 1
 */
public class DeluxeRoom extends Room {
    private static final double SERVICE_CHARGE = 0.10;

    public DeluxeRoom(int roomNumber, double price, boolean available, String description) {
        super(roomNumber, "Deluxe", price, available, description);
    }

    @Override
    public double calculateFinalPrice(int nights) {
        double base = getPrice() * nights;
        return base + (base * SERVICE_CHARGE);
    }
}
