package services;

import datastructures.BinarySearchTree;
import models.*;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/**
 * Component 01 — Room Management Service
 * Persists all rooms to rooms.txt via the BST.
 *
 * Author: Member 1
 */
public class RoomService {
    private static final String FILE_NAME = "rooms.txt";
    private final BinarySearchTree bst = new BinarySearchTree();

    public RoomService() {
        loadFromFile();
        if (bst.size() == 0) seedDefaults();
    }

    private void seedDefaults() {
        // Match the live Aurum website pricing
        addRoom(new DeluxeRoom(101, 150_000, true,  "Elegant Deluxe Room with city view"));
        addRoom(new DeluxeRoom(102, 150_000, true,  "Elegant Deluxe Room with garden view"));
        addRoom(new SuiteRoom(201,  280_000, true,  "Executive Suite with separate living area"));
        addRoom(new SuiteRoom(202,  280_000, true,  "Executive Suite with butler service"));
        addRoom(new SuiteRoom(301,  850_000, true,  "Presidential Suite with private terrace"));
        addRoom(new StandardRoom(1, 75_000,  true,  "Standard Room with all basic amenities"));
    }

    private void loadFromFile() {
        for (String line : FileHandler.readAllLines(FILE_NAME)) {
            Room r = parseRoom(line);
            if (r != null) bst.insert(r);
        }
    }

    private Room parseRoom(String line) {
        String[] p = line.split("\\|");
        if (p.length < 5) return null;
        try {
            int num   = Integer.parseInt(p[0]);
            String t  = p[1];
            double pr = Double.parseDouble(p[2]);
            boolean a = Boolean.parseBoolean(p[3]);
            String d  = p[4];
            switch (t.toLowerCase()) {
                case "deluxe": return new DeluxeRoom(num, pr, a, d);
                case "suite":  return new SuiteRoom(num, pr, a, d);
                default:       return new StandardRoom(num, pr, a, d);
            }
        } catch (Exception e) { return null; }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Room r : bst.getAllRooms()) lines.add(r.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD ============

    /** CREATE */
    public boolean addRoom(Room room) {
        if (bst.search(room.getRoomNumber()) != null) return false;
        bst.insert(room);
        persist();
        return true;
    }

    /** READ — single */
    public Room searchRoom(int roomNumber) { return bst.search(roomNumber); }

    /** READ — all */
    public List<Room> getAllRooms() { return bst.getAllRooms(); }

    /** UPDATE */
    public boolean updateRoom(int roomNumber, Double price, Boolean available, String description) {
        Room r = bst.search(roomNumber);
        if (r == null) return false;
        if (price != null) r.setPrice(price);
        if (available != null) r.setAvailable(available);
        if (description != null) r.setDescription(description);
        persist();
        return true;
    }

    /** DELETE */
    public boolean deleteRoom(int roomNumber) {
        boolean removed = bst.delete(roomNumber);
        if (removed) persist();
        return removed;
    }

    public int totalRooms() { return bst.size(); }
}
