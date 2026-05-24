package models;

/**
 * Component 02: Polymorphism - Online reservation type
 */
public class OnlineReservation extends Reservation {

    public OnlineReservation(int reservationId, int customerId, int roomNumber,
                             String checkInDate, String checkOutDate, String status, double totalAmount) {
        super(reservationId, customerId, roomNumber, checkInDate, checkOutDate, status, totalAmount);
    }

    @Override
    public boolean validateBooking() {
        // Online: must have customer ID, valid dates, and dates must be future
        if (getCustomerId() <= 0) return false;
        if (getCheckInDate() == null || getCheckOutDate() == null) return false;
        return getCheckInDate().compareTo(getCheckOutDate()) < 0;
    }

    @Override
    public String getReservationSource() {
        return "ONLINE";
    }
}
