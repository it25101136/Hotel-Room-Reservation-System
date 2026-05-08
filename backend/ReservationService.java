package services;

import datastructures.QuickSort;
import models.*;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/**
 * Component 02 — Reservation Management Service.
 * Persists to reservations.txt
 * Author: Member 2
 */
public class ReservationService {
    private static final String FILE_NAME = "reservations.txt";
    private final List<Reservation> reservations = new ArrayList<>();
    private int nextId = 1000;

    public ReservationService() { loadFromFile(); }

    private void loadFromFile() {
        for (String line : FileHandler.readAllLines(FILE_NAME)) {
            Reservation r = parse(line);
            if (r != null) {
                reservations.add(r);
                if (r.getReservationId() >= nextId) nextId = r.getReservationId() + 1;
            }
        }
    }

    private Reservation parse(String line) {
        String[] p = line.split("\\|");
        if (p.length < 8) return null;
        try {
            int id = Integer.parseInt(p[0]);
            int cId = Integer.parseInt(p[1]);
            int rn = Integer.parseInt(p[2]);
            String ci = p[3], co = p[4], st = p[5];
            double tot = Double.parseDouble(p[6]);
            String src = p[7];
            return src.equals("WALK_IN")
                    ? new WalkInReservation(id, cId, rn, ci, co, st, tot)
                    : new OnlineReservation(id, cId, rn, ci, co, st, tot);
        } catch (Exception e) { return null; }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Reservation r : reservations) lines.add(r.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD ============

    /** CREATE — Online */
    public Reservation createOnline(int custId, int roomNo, String ci, String co, double tot) {
        Reservation r = new OnlineReservation(nextId++, custId, roomNo, ci, co, "CONFIRMED", tot);
        if (!r.validateBooking()) { nextId--; return null; }
        reservations.add(r); persist(); return r;
    }

    /** CREATE — Walk-in */
    public Reservation createWalkIn(int custId, int roomNo, String ci, String co, double tot) {
        Reservation r = new WalkInReservation(nextId++, custId, roomNo, ci, co, "CONFIRMED", tot);
        if (!r.validateBooking()) { nextId--; return null; }
        reservations.add(r); persist(); return r;
    }

    /** READ — single */
    public Reservation getById(int id) {
        for (Reservation r : reservations) if (r.getReservationId() == id) return r;
        return null;
    }

    /** READ — all sorted (QuickSort) */
    public List<Reservation> getAllSortedByCheckIn() {
        List<Reservation> copy = new ArrayList<>(reservations);
        QuickSort.sortByCheckInDate(copy);
        return copy;
    }

    /** READ — by customer (sorted) */
    public List<Reservation> getByCustomer(int customerId) {
        List<Reservation> list = new ArrayList<>();
        for (Reservation r : reservations) if (r.getCustomerId() == customerId) list.add(r);
        QuickSort.sortByCheckInDate(list);
        return list;
    }

    /** UPDATE */
    public boolean updateReservation(int id, String newCi, String newCo, Integer newRoom) {
        Reservation r = getById(id);
        if (r == null) return false;
        if (newCi != null) r.setCheckInDate(newCi);
        if (newCo != null) r.setCheckOutDate(newCo);
        if (newRoom != null) r.setRoomNumber(newRoom);
        if (!r.validateBooking()) return false;
        persist(); return true;
    }

    /** DELETE — cancel (keep record) */
    public boolean cancelReservation(int id) {
        Reservation r = getById(id);
        if (r == null) return false;
        r.setStatus("CANCELLED");
        persist(); return true;
    }

    /** DELETE — permanent removal */
    public boolean removeReservation(int id) {
        boolean removed = reservations.removeIf(r -> r.getReservationId() == id);
        if (removed) persist();
        return removed;
    }
}
