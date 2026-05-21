package models;

/** Card payment — validates last-4 digits. Author: Member 4 */
public class CardPayment extends Payment {
    private String cardLastFour;

    public CardPayment(int paymentId, int reservationId, int customerId,
                       double amount, String status, String paymentDate, String cardLastFour) {
        super(paymentId, reservationId, customerId, amount, status, paymentDate);
        this.cardLastFour = cardLastFour;
    }

    public String getCardLastFour() { return cardLastFour; }
    public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }

    @Override
    public boolean processPayment() {
        if (cardLastFour == null || cardLastFour.length() != 4) {
            setStatus("FAILED");
            return false;
        }
        setStatus("COMPLETED");
        return true;
    }

    @Override
    public String getPaymentMethod() {
        return "CARD-****" + (cardLastFour != null ? cardLastFour : "0000");
    }
}
