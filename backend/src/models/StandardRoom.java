package models;

/**
 * Component 01: Inheritance from Room
 * Polymorphism: Custom pricing logic
 */
public class StandardRoom extends Room {
    public StandardRoom(int roomNumber, double price, boolean available, String description) {
        super(roomNumber, "Standard", price, available, description);
    }

    @Override
    public double calculateFinalPrice(int nights) {
        // Standard: base price * nights, no extra charges
        return getPrice() * nights;
    }
}
