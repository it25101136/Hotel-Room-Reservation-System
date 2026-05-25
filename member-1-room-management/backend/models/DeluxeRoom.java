package models;

/**
 * Deluxe Room — 10 % service charge.
 * Matches frontend "Deluxe Room" at LKR 150,000/night.
 * Author: Member 1
 */


/** INHERITANCE: DeluxeRoom extends Room
 *    - DeluxeRoom IS-A Room
 *    - It inherits properties like roomNumber, price, etc.*/

public class DeluxeRoom extends Room {
    private static final double SERVICE_CHARGE = 0.10;

    public DeluxeRoom(int roomNumber, double price, boolean available, String description) {
        // Calls constructor of Room class (Parent)
        super(roomNumber, "Deluxe", price, available, description);
    }


    /**  POLYMORPHISM (OVERRIDING):
            - This method overrides the parent class method
     *    - Same method name, different implementation
     *
             *  BUSINESS LOGIC:
            *    - Calculates total cost + 10% service charge
     */

    @Override
    public double calculateFinalPrice(int nights) {
        double base = getPrice() * nights;
        return base + (base * SERVICE_CHARGE);
    }
}
