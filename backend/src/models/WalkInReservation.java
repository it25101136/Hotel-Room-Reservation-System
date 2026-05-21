package models;

/**
 * Component 02: Polymorphism - Walk-in reservation type
 */
public class WalkInReservation extends Reservation {

    public WalkInReservation(int reservationId, int customerId, int roomNumber,
                             String checkInDate, String checkOutDate, String status, double totalAmount) {
        super(reservationId, customerId, roomNumber, checkInDate, checkOutDate, status, totalAmount);
    }

    @Override
    public boolean validateBooking() {
        // Walk-in: more relaxed validation (customer can register on the spot)
        if (getRoomNumber() <= 0) return false;
        return getCheckInDate() != null && getCheckOutDate() != null;
    }

    @Override
    public String getReservationSource() {
        return "WALK_IN";
    }
}
