package models;

/** Tracks services selected by customers, linked to reservations. Author: Member 6 */
public class CustomerService {
    private int id;
    private int customerId;
    private int reservationId;
    private int serviceId;
    private int quantity;
    private double totalPrice;
    private String status;

    public CustomerService(int id, int customerId, int reservationId, int serviceId,
                           int quantity, double totalPrice, String status) {
        this.id = id;
        this.customerId = customerId;
        this.reservationId = reservationId;
        this.serviceId = serviceId;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }
    public int getReservationId() { return reservationId; }
    public void setReservationId(int reservationId) { this.reservationId = reservationId; }
    public int getServiceId() { return serviceId; }
    public void setServiceId(int serviceId) { this.serviceId = serviceId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String toFileString() {
        return id + "|" + customerId + "|" + reservationId + "|" + serviceId + "|"
                + quantity + "|" + totalPrice + "|" + status;
    }

    @Override
    public String toString() {
        return String.format("CSvc #%d | Cust:%d | Res:%d | Svc:%d | Qty:%d | LKR %,.2f | %s",
                id, customerId, reservationId, serviceId, quantity, totalPrice, status);
    }
}
