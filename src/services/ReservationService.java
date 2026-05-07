package services;

import datastructures.QuickSort;
import models.*;
import utils.FileHandler;

import java.util.ArrayList;
import java.util.List;

/**
 * Component 02: Reservation Management Service
 * Uses QuickSort to display reservations sorted by check-in date.
 * Persists to reservations.txt
 */
public class ReservationService {
    private static final String FILE_NAME = "reservations.txt";
    private final List<Reservation> reservations = new ArrayList<>();
    private int nextId = 1000;

    public ReservationService() {
        loadFromFile();
    }

    private void loadFromFile() {
        List<String> lines = FileHandler.readAllLines(FILE_NAME);
        for (String line : lines) {
            Reservation r = parseReservation(line);
            if (r != null) {
                reservations.add(r);
                if (r.getReservationId() >= nextId) nextId = r.getReservationId() + 1;
            }
        }
    }

    private Reservation parseReservation(String line) {
        String[] p = line.split("\\|");
        if (p.length < 8) return null;
        try {
            int id = Integer.parseInt(p[0]);
            int custId = Integer.parseInt(p[1]);
            int roomNo = Integer.parseInt(p[2]);
            String checkIn = p[3];
            String checkOut = p[4];
            String status = p[5];
            double total = Double.parseDouble(p[6]);
            String source = p[7];
            return source.equals("WALK_IN")
                    ? new WalkInReservation(id, custId, roomNo, checkIn, checkOut, status, total)
                    : new OnlineReservation(id, custId, roomNo, checkIn, checkOut, status, total);
        } catch (Exception e) {
            return null;
        }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Reservation r : reservations) lines.add(r.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD ============

    /** CREATE: New online reservation */
    public Reservation createOnlineReservation(int customerId, int roomNumber,
                                               String checkIn, String checkOut, double totalAmount) {
        Reservation r = new OnlineReservation(nextId++, customerId, roomNumber,
                checkIn, checkOut, "CONFIRMED", totalAmount);
        if (!r.validateBooking()) {
            nextId--;
            return null;
        }
        reservations.add(r);
        persist();
        return r;
    }

    /** CREATE: New walk-in reservation */
    public Reservation createWalkInReservation(int customerId, int roomNumber,
                                               String checkIn, String checkOut, double totalAmount) {
        Reservation r = new WalkInReservation(nextId++, customerId, roomNumber,
                checkIn, checkOut, "CONFIRMED", totalAmount);
        if (!r.validateBooking()) {
            nextId--;
            return null;
        }
        reservations.add(r);
        persist();
        return r;
    }

    /** READ: View one reservation */
    public Reservation getById(int reservationId) {
        for (Reservation r : reservations) {
            if (r.getReservationId() == reservationId) return r;
        }
        return null;
    }

    /** READ: All reservations sorted by check-in date (using QuickSort) */
    public List<Reservation> getAllSortedByCheckIn() {
        List<Reservation> copy = new ArrayList<>(reservations);
        QuickSort.sortByCheckInDate(copy);
        return copy;
    }

    /** READ: Reservations for a specific customer */
    public List<Reservation> getByCustomer(int customerId) {
        List<Reservation> list = new ArrayList<>();
        for (Reservation r : reservations)
            if (r.getCustomerId() == customerId) list.add(r);
        QuickSort.sortByCheckInDate(list);
        return list;
    }

    /** UPDATE: Modify reservation dates or assigned room */
    public boolean updateReservation(int reservationId, String newCheckIn,
                                     String newCheckOut, Integer newRoomNumber) {
        Reservation r = getById(reservationId);
        if (r == null) return false;
        if (newCheckIn != null) r.setCheckInDate(newCheckIn);
        if (newCheckOut != null) r.setCheckOutDate(newCheckOut);
        if (newRoomNumber != null) r.setRoomNumber(newRoomNumber);
        if (!r.validateBooking()) return false;
        persist();
        return true;
    }

    /** DELETE: Cancel a reservation (sets status, keeps record) */
    public boolean cancelReservation(int reservationId) {
        Reservation r = getById(reservationId);
        if (r == null) return false;
        r.setStatus("CANCELLED");
        persist();
        return true;
    }

    /** DELETE: Permanently remove a reservation */
    public boolean removeReservation(int reservationId) {
        boolean removed = reservations.removeIf(r -> r.getReservationId() == reservationId);
        if (removed) persist();
        return removed;
    }
}
