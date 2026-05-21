package models;

/**
 * Standard Room — base price, no surcharges.
 * Author: Member 1
 */
public class StandardRoom extends Room {
    public StandardRoom(int roomNumber, double price, boolean available, String description) {
        super(roomNumber, "Standard", price, available, description);
    }

    @Override
    public double calculateFinalPrice(int nights) {
        return getPrice() * nights;
    }
}
