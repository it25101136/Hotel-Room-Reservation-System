package models;

/**
 * Online reservation — strict validation.
 * Author: Member 2
 */
public class OnlineReservation extends Reservation {
    public OnlineReservation(int id, int custId, int roomNo, String ci, String co, String status, double total) {
        super(id, custId, roomNo, ci, co, status, total);
    }

    @Override
    public boolean validateBooking() {
        if (getCustomerId() <= 0) return false;
        if (getCheckInDate() == null || getCheckOutDate() == null) return false;
        return getCheckInDate().compareTo(getCheckOutDate()) < 0;
    }

    @Override
    public String getReservationSource() { return "ONLINE"; }
}
