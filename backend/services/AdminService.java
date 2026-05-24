package services;

import models.AdminUser;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/**
 * Component 05 — Admin Management Service.
 * Features:
 * - Load admins from file
 * - Add new admin
 * - Admin login authentication
 * - Update permissions
 * - Delete admin
 *
 * Author: Member 5
 */
public class AdminService {

    // File where admin data is stored
    private static final String FILE_NAME = "admins.txt";

    // In-memory list of admins
    private final List<AdminUser> admins = new ArrayList<>();

    // Used to generate unique admin IDs
    private int nextId = 1;

    /**
     * Constructor — loads existing admins from file.
     * If no admin exists, creates a default admin account.
     */
    public AdminService() {
        loadFromFile();

        // If no admins exist, create default system admin
        if (admins.isEmpty()) {
            addAdmin("admin", "admin123", "System Administrator",
                    "admin@aurumhotel.lk", "+94 11 244 5555", "FULL");
        }
    }

    /**
     * Loads admin data from file into memory.
     */
    private void loadFromFile() {
        for (String line : FileHandler.readAllLines(FILE_NAME)) {
            AdminUser a = parse(line);
            if (a != null) {
                admins.add(a);

                // Update nextId to avoid duplicate IDs
                if (a.getId() >= nextId) nextId = a.getId() + 1;
            }
        }
    }

    /**
     * Converts a file line into an AdminUser object.
     */
    private AdminUser parse(String line) {
        String[] p = line.split("\\|");
        if (p.length < 7) return null;

        try {
            return new AdminUser(
                    Integer.parseInt(p[0]),
                    p[1], p[2], p[3], p[4], p[5], p[6]
            );
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Saves all admin data back to file.
     */
    private void persist() {
        List<String> lines = new ArrayList<>();
        for (AdminUser a : admins)
            lines.add(a.toFileString());

        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD OPERATIONS ============

    /**
     * Adds a new admin to the system.
     * Returns null if username already exists.
     */
    public AdminUser addAdmin(String username, String password, String name,
                              String email, String phone, String permissions) {

        // Prevent duplicate usernames
        for (AdminUser a : admins)
            if (a.getUsername().equalsIgnoreCase(username))
                return null;

        AdminUser a = new AdminUser(nextId++, username, password, name, email, phone, permissions);
        admins.add(a);
        persist();
        return a;
    }

    /**
     * Authenticates admin login.
     */
    public AdminUser login(String username, String password) {
        for (AdminUser a : admins)
            if (a.authenticate(username, password))
                return a;

        return null;
    }

    /**
     * Returns all admins (safe copy of list).
     */
    public List<AdminUser> getAll() {
        return new ArrayList<>(admins);
    }

    /**
     * Retrieves admin by ID.
     */
    public AdminUser getById(int id) {
        for (AdminUser a : admins)
            if (a.getId() == id)
                return a;

        return null;
    }

    /**
     * Updates admin permissions.
     */
    public boolean updatePermissions(int id, String newPermissions) {
        AdminUser a = getById(id);
        if (a == null) return false;

        a.setPermissions(newPermissions);
        persist();
        return true;
    }

    /**
     * Deletes admin by ID.
     */
    public boolean deleteAdmin(int id) {
        boolean removed = admins.removeIf(a -> a.getId() == id);

        if (removed)
            persist();

        return removed;
    }
}