package models;

/**
 * Component 04 — Payment & Billing
 * Abstract Payment class — Abstraction.
 * Author: Member 4
 */
public abstract class Payment {
    private int paymentId;
    private int reservationId;
    private int customerId;
    private double amount;        // LKR
    private String status;        // PENDING / COMPLETED / FAILED / REFUNDED
    private String paymentDate;   // YYYY-MM-DD

    public Payment(int paymentId, int reservationId, int customerId,
                   double amount, String status, String paymentDate) {
        this.paymentId = paymentId;
        this.reservationId = reservationId;
        this.customerId = customerId;
        this.amount = amount;
        this.status = status;
        this.paymentDate = paymentDate;
    }

    public int getPaymentId() { return paymentId; }
    public void setPaymentId(int paymentId) { this.paymentId = paymentId; }
    public int getReservationId() { return reservationId; }
    public void setReservationId(int reservationId) { this.reservationId = reservationId; }
    public int getCustomerId() { return customerId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }

    /** Abstraction — each payment method processes itself */
    public abstract boolean processPayment();
    /** Polymorphism — each method describes itself */
    public abstract String getPaymentMethod();

    public String toFileString() {
        return paymentId + "|" + reservationId + "|" + customerId + "|" + amount
                + "|" + status + "|" + paymentDate + "|" + getPaymentMethod();
    }

    /** Generate Aurum Hotel invoice */
    public String generateInvoice() {
        StringBuilder sb = new StringBuilder();
        sb.append("\n========== AURUM HOTEL INVOICE ==========\n");
        sb.append("Galle Face Hotel Road, Colombo 003, Sri Lanka\n");
        sb.append("Tel: +94 11 244 5555\n");
        sb.append("-----------------------------------------\n");
        sb.append("Payment ID    : ").append(paymentId).append("\n");
        sb.append("Reservation # : ").append(reservationId).append("\n");
        sb.append("Customer ID   : ").append(customerId).append("\n");
        sb.append("Method        : ").append(getPaymentMethod()).append("\n");
        sb.append("Date          : ").append(paymentDate).append("\n");
        sb.append("Status        : ").append(status).append("\n");
        sb.append("-----------------------------------------\n");
        sb.append(String.format("TOTAL         : LKR %,.2f%n", amount));
        sb.append("=========================================\n");
        return sb.toString();
    }

    @Override
    public String toString() {
        return String.format("Pay #%d | Res:%d | Cust:%d | LKR %,.2f | %s | %s | %s",
                paymentId, reservationId, customerId, amount, status, paymentDate, getPaymentMethod());
    }
}
