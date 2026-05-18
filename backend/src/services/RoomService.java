package services;

import datastructures.BinarySearchTree;
import models.*;
import utils.FileHandler;

import java.util.List;

/**
 * Component 01: Room Management Service
 * Uses Binary Search Tree internally, persists to rooms.txt
 */
public class RoomService {
    private static final String FILE_NAME = "rooms.txt";
    private final BinarySearchTree bst = new BinarySearchTree();

    public RoomService() {
        loadFromFile();
    }

    /** Load rooms from rooms.txt into the BST */
    private void loadFromFile() {
        List<String> lines = FileHandler.readAllLines(FILE_NAME);
        for (String line : lines) {
            Room r = parseRoom(line);
            if (r != null) bst.insert(r);
        }

        // Seed default rooms if file is empty (matches frontend offerings)
        if (bst.size() == 0) {
            seedDefaults();
        }
    }

    private void seedDefaults() {
        // Frontend rooms: Deluxe LKR 150,000, Executive Suite LKR 280,000, Presidential Suite LKR 850,000
        addRoom(new DeluxeRoom(101, 150000, true, "Elegant Deluxe Room with city view"));
        addRoom(new DeluxeRoom(102, 150000, true, "Elegant Deluxe Room with garden view"));
        addRoom(new SuiteRoom(201, 280000, true, "Executive Suite with separate living area"));
        addRoom(new SuiteRoom(202, 280000, true, "Executive Suite with butler service"));
        addRoom(new SuiteRoom(301, 850000, true, "Presidential Suite with private terrace"));
        addRoom(new StandardRoom(001, 75000, true, "Standard Room with all basic amenities"));
    }

    /** Parse one line into the appropriate Room subclass */
    private Room parseRoom(String line) {
        String[] p = line.split("\\|");
        if (p.length < 5) return null;
        try {
            int num = Integer.parseInt(p[0]);
            String type = p[1];
            double price = Double.parseDouble(p[2]);
            boolean avail = Boolean.parseBoolean(p[3]);
            String desc = p[4];
            switch (type.toLowerCase()) {
                case "deluxe":   return new DeluxeRoom(num, price, avail, desc);
                case "suite":    return new SuiteRoom(num, price, avail, desc);
                default:         return new StandardRoom(num, price, avail, desc);
            }
        } catch (Exception e) {
            return null;
        }
    }

    /** Persist all rooms back to rooms.txt */
    private void persist() {
        List<Room> rooms = bst.getAllRooms();
        java.util.List<String> lines = new java.util.ArrayList<>();
        for (Room r : rooms) lines.add(r.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD ============

    /** CREATE: Add a new room */
    public boolean addRoom(Room room) {
        if (bst.search(room.getRoomNumber()) != null) return false; // already exists
        bst.insert(room);
        persist();
        return true;
    }

    /** READ: Search for a room by number */
    public Room searchRoom(int roomNumber) {
        return bst.search(roomNumber);
    }

    /** READ: Get all rooms (sorted via BST in-order traversal) */
    public List<Room> getAllRooms() {
        return bst.getAllRooms();
    }

    /** UPDATE: Modify price, availability, or description */
    public boolean updateRoom(int roomNumber, Double newPrice, Boolean newAvailable, String newDescription) {
        Room r = bst.search(roomNumber);
        if (r == null) return false;
        if (newPrice != null) r.setPrice(newPrice);
        if (newAvailable != null) r.setAvailable(newAvailable);
        if (newDescription != null) r.setDescription(newDescription);
        persist();
        return true;
    }

    /** DELETE: Remove room from system */
    public boolean deleteRoom(int roomNumber) {
        boolean removed = bst.delete(roomNumber);
        if (removed) persist();
        return removed;
    }

    public int totalRooms() { return bst.size(); }
}
