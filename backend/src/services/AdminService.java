package services;

import models.AdminUser;
import utils.FileHandler;

import java.util.ArrayList;
import java.util.List;

/**
 * Component 05: Admin Management Service
 * Persists to admins.txt
 */
public class AdminService {
    private static final String FILE_NAME = "admins.txt";
    private final List<AdminUser> admins = new ArrayList<>();
    private int nextId = 1;

    public AdminService() {
        loadFromFile();
        // Seed default admin if none exist
        if (admins.isEmpty()) {
            addAdmin("admin", "admin123", "System Administrator",
                    "admin@aurumhotel.lk", "+94 11 244 5555", "FULL");
        }
    }

    private void loadFromFile() {
        List<String> lines = FileHandler.readAllLines(FILE_NAME);
        for (String line : lines) {
            AdminUser a = parseAdmin(line);
            if (a != null) {
                admins.add(a);
                if (a.getId() >= nextId) nextId = a.getId() + 1;
            }
        }
    }

    private AdminUser parseAdmin(String line) {
        String[] p = line.split("\\|");
        if (p.length < 7) return null;
        try {
            return new AdminUser(Integer.parseInt(p[0]), p[1], p[2], p[3], p[4], p[5], p[6]);
        } catch (Exception e) { return null; }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (AdminUser a : admins) lines.add(a.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD ============

    /** CREATE: Add new admin */
    public AdminUser addAdmin(String username, String password, String name,
                              String email, String phone, String permissions) {
        for (AdminUser a : admins)
            if (a.getUsername().equalsIgnoreCase(username)) return null;
        AdminUser a = new AdminUser(nextId++, username, password, name, email, phone, permissions);
        admins.add(a);
        persist();
        return a;
    }

    /** Login admin */
    public AdminUser login(String username, String password) {
        for (AdminUser a : admins)
            if (a.authenticate(username, password)) return a;
        return null;
    }

    /** READ: All admins */
    public List<AdminUser> getAll() {
        return new ArrayList<>(admins);
    }

    public AdminUser getById(int id) {
        for (AdminUser a : admins) if (a.getId() == id) return a;
        return null;
    }

    /** UPDATE: Modify permissions */
    public boolean updatePermissions(int id, String newPermissions) {
        AdminUser a = getById(id);
        if (a == null) return false;
        a.setPermissions(newPermissions);
        persist();
        return true;
    }

    /** DELETE: Remove admin account */
    public boolean deleteAdmin(int id) {
        boolean removed = admins.removeIf(a -> a.getId() == id);
        if (removed) persist();
        return removed;
    }
}
