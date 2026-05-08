package models;

/**
 * Online payment via Sri Lankan gateway: PayHere, FriMi, Genie.
 * Author: Member 4
 */
public class OnlinePayment extends Payment {
    private String provider;

    public OnlinePayment(int paymentId, int reservationId, int customerId,
                         double amount, String status, String paymentDate, String provider) {
        super(paymentId, reservationId, customerId, amount, status, paymentDate);
        this.provider = provider;
    }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    @Override
    public boolean processPayment() {
        if (provider == null || provider.isEmpty()) {
            setStatus("FAILED");
            return false;
        }
        setStatus("COMPLETED");
        return true;
    }

    @Override
    public String getPaymentMethod() {
        return "ONLINE-" + (provider != null ? provider.toUpperCase() : "UNKNOWN");
    }
}
