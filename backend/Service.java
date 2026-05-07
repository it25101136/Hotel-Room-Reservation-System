package models;

/**
 * Component 07 — Service & Facility Management.
 * Abstract Service class — Encapsulation + Inheritance.
 * Author: Member 6
 */
public abstract class Service {
    private int serviceId;
    private String name;
    private double price;       // LKR
    private boolean available;
    private String description;
    private String category;    // SPA / DINING / TRANSPORT / ROOM / OTHER

    public Service(int serviceId, String name, double price, boolean available,
                   String description, String category) {
        this.serviceId = serviceId;
        this.name = name;
        this.price = price;
        this.available = available;
        this.description = description;
        this.category = category;
    }

    public int getServiceId() { return serviceId; }
    public void setServiceId(int serviceId) { this.serviceId = serviceId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    /** Polymorphism — different pricing rules per tier */
    public abstract double calculatePrice(int quantity);
    public abstract String getTier();

    public String toFileString() {
        return serviceId + "|" + name + "|" + price + "|" + available + "|"
                + description.replace("|", "/") + "|" + category + "|" + getTier();
    }

    @Override
    public String toString() {
        return String.format("Svc #%d | %-20s | LKR %,.2f | %s | %s | %s",
                serviceId, name, price, category, available ? "Available" : "Unavailable", getTier());
    }
}
