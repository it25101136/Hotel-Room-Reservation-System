package models;

/**
 * Walk-in reservation — lenient validation (customer registered on the spot).
 * Author: Member 2
 */
public class WalkInReservation extends Reservation {
    public WalkInReservation(int id, int custId, int roomNo, String ci, String co, String status, double total) {
        super(id, custId, roomNo, ci, co, status, total);
    }

    @Override
    public boolean validateBooking() {
        if (getRoomNumber() <= 0) return false;
        return getCheckInDate() != null && getCheckOutDate() != null;
    }

    @Override
    public String getReservationSource() { return "WALK_IN"; }
}
