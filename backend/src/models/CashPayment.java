package models;

/**
 * Component 04: Polymorphism - Cash payment
 */
public class CashPayment extends Payment {

    public CashPayment(int paymentId, int reservationId, int customerId,
                       double amount, String status, String paymentDate) {
        super(paymentId, reservationId, customerId, amount, status, paymentDate);
    }

    @Override
    public boolean processPayment() {
        // Cash always completes immediately
        setStatus("COMPLETED");
        return true;
    }

    @Override
    public String getPaymentMethod() {
        return "CASH";
    }
}
