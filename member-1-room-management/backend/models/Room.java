package models;

/**
 * Component 01 — Room Management
 * Abstract Room class — Encapsulation
 * Parent for StandardRoom, DeluxeRoom, SuiteRoom
 *
 * Author: Member 1
 */
/**    - Used as a blueprint for subclasses (DeluxeRoom, SuiteRoom, etc.)*/

public abstract class Room {
    private int roomNumber; /**  identifies the room*/
    private String type; /**  defines whether it is Standard, Deluxe, or Suite*/
    private double price;    /** cost per night */   // LKR
    private boolean available;  /** shows if the room is free or occupied */
    private String description; /** gives additional details about the room*/

    public Room(int roomNumber, String type, double price, boolean available, String description) {
        this.roomNumber = roomNumber;
        this.type = type;
        this.price = price;
        this.available = available;
        this.description = description;
    }

    public int getRoomNumber() { return roomNumber; }
    public void setRoomNumber(int roomNumber) { this.roomNumber = roomNumber; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    /** Polymorphism — each room type has different pricing rules */
    public abstract double calculateFinalPrice(int nights);

    public String toFileString() {
        return roomNumber + "|" + type + "|" + price + "|" + available + "|" + description;
    }

    @Override
    public String toString() {
        return String.format("Room #%d | Type: %-10s | LKR %,.2f | %s",
                roomNumber, type, price, available ? "Available" : "Occupied");
    }
}
