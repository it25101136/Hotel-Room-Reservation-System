package models;

/**
 * Component 05 — Admin Management.
 * Inherits from User. Demonstrates Abstraction (admin-only ops).
 * Author: Member 5
 */
public class AdminUser extends User {
    private String permissions; // FULL / MODERATOR / VIEWER

    public AdminUser(int id, String username, String password, String name,
                     String email, String phone, String permissions) {
        super(id, username, password, name, email, phone, "ADMIN");
        this.permissions = permissions;
    }

    public String getPermissions() { return permissions; }
    public void setPermissions(String permissions) { this.permissions = permissions; }

    /** Abstraction — admin-only operations gated by permissions */
    public boolean canManageRooms()     { return permissions.equals("FULL"); }
    public boolean canManageBookings()  { return !permissions.equals("VIEWER"); }
    public boolean canModerateReviews() { return !permissions.equals("VIEWER"); }
    public boolean canManageAdmins()    { return permissions.equals("FULL"); }

    public String toFileString() {
        return getId() + "|" + getUsername() + "|" + getPassword() + "|" + getName()
                + "|" + getEmail() + "|" + getPhone() + "|" + permissions;
    }

    @Override
    public String toString() {
        return String.format("Admin #%d | %s | %s | %s | %s",
                getId(), getName(), getUsername(), getEmail(), permissions);
    }
}
