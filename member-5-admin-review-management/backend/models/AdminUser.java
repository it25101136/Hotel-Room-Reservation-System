package models;

/**
 * Component 05 — Admin Management.
 *
 * This class represents an Admin user in the system.
 * It extends the User class (inheritance) and adds admin-specific permissions.
 *
 * Demonstrates OOP concepts:
 * - Inheritance (AdminUser extends User)
 * - Encapsulation (private fields with getters/setters)
 * - Abstraction (permission-based access control methods)
 *
 * Author: Member 5
 */
public class AdminUser extends User {

    // Stores admin permission level (FULL / MODERATOR / VIEWER)
    private String permissions;

    /**
     * Constructor to initialize AdminUser object.
     * Calls parent constructor using super() to set common user fields.
     */
    public AdminUser(int id, String username, String password, String name,
                     String email, String phone, String permissions) {

        super(id, username, password, name, email, phone, "ADMIN");
        this.permissions = permissions;
    }

    // Getter for permissions
    public String getPermissions() { return permissions; }

    // Setter for permissions
    public void setPermissions(String permissions) { this.permissions = permissions; }

    /**
     * Abstraction — Admin-only access control methods
     * These methods decide what actions an admin is allowed to perform
     * based on their permission level.
     */

    // Only FULL admins can manage rooms
    public boolean canManageRooms() { return permissions.equals("FULL"); }

    // VIEWER cannot manage bookings, others can
    public boolean canManageBookings() { return !permissions.equals("VIEWER"); }

    // VIEWER cannot moderate reviews, others can
    public boolean canModerateReviews() { return !permissions.equals("VIEWER"); }

    // Only FULL admins can manage other admins
    public boolean canManageAdmins() { return permissions.equals("FULL"); }

    /**
     * Converts AdminUser object into a string format for file storage.
     * Used when saving admin data into text files or databases.
     */
    public String toFileString() {
        return getId() + "|" + getUsername() + "|" + getPassword() + "|" + getName()
                + "|" + getEmail() + "|" + getPhone() + "|" + permissions;
    }

    /**
     * Returns a readable string representation of AdminUser.
     * Useful for debugging and displaying admin info in logs/UI.
     */
    @Override
    public String toString() {
        return String.format("Admin #%d | %s | %s | %s | %s",
                getId(), getName(), getUsername(), getEmail(), permissions);
    }
}