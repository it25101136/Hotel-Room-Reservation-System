package models;

/** Cash payment — completes instantly. Author: Member 4 */
public class CashPayment extends Payment {
    public CashPayment(int paymentId, int reservationId, int customerId,
                       double amount, String status, String paymentDate) {
        super(paymentId, reservationId, customerId, amount, status, paymentDate);
    }

    @Override public boolean processPayment() { setStatus("COMPLETED"); return true; }
    @Override public String getPaymentMethod() { return "CASH"; }
}
