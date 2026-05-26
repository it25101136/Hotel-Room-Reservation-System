package models;

/**
 * Component 02 — Reservation Management
 * Abstract parent — Abstraction
 * Author: Member 2
 */
public abstract class Reservation {
    private int reservationId;
    private int customerId;
    private int roomNumber;
    private String checkInDate;   // YYYY-MM-DD
    private String checkOutDate;
    private String status;        // CONFIRMED / CANCELLED / CHECKED_IN / CHECKED_OUT
    private double totalAmount;   // LKR

    public Reservation(int reservationId, int customerId, int roomNumber,
                       String checkInDate, String checkOutDate, String status, double totalAmount) {
        this.reservationId = reservationId;
        this.customerId = customerId;
        this.roomNumber = roomNumber;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.status = status;
        this.totalAmount = totalAmount;
    }

    public int getReservationId() { return reservationId; }
    public void setReservationId(int reservationId) { this.reservationId = reservationId; }
    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }
    public int getRoomNumber() { return roomNumber; }
    public void setRoomNumber(int roomNumber) { this.roomNumber = roomNumber; }
    public String getCheckInDate() { return checkInDate; }
    public void setCheckInDate(String checkInDate) { this.checkInDate = checkInDate; }
    public String getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(String checkOutDate) { this.checkOutDate = checkOutDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public abstract boolean validateBooking();
    public abstract String getReservationSource();

    public String toFileString() {
        return reservationId + "|" + customerId + "|" + roomNumber + "|" + checkInDate
                + "|" + checkOutDate + "|" + status + "|" + totalAmount + "|" + getReservationSource();
    }

    @Override
    public String toString() {
        return String.format("Res #%d | Cust:%d | Room:%d | %s → %s | %s | LKR %,.2f | %s",
                reservationId, customerId, roomNumber, checkInDate, checkOutDate, status, totalAmount, getReservationSource());
    }
}
