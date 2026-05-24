package models;

/**
 * Component 04: Polymorphism - Online payment (e.g. PayHere, FriMi, etc.)
 */
public class OnlinePayment extends Payment {
    private String provider; // PayHere, FriMi, Genie, etc.

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
        // Simulate online payment gateway
        setStatus("COMPLETED");
        return true;
    }

    @Override
    public String getPaymentMethod() {
        return "ONLINE-" + (provider != null ? provider.toUpperCase() : "UNKNOWN");
    }
}
