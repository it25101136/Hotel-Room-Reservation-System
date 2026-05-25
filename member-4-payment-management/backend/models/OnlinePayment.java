package models;

/** Online payment via Sri Lankan gateway. Author: Member 4 */
public class OnlinePayment extends Payment {
    //Store payment provider name
    private String provider;

    public OnlinePayment(int paymentId, int reservationId, int customerId,
                         double amount, String status, String paymentDate, String provider) {
        super(paymentId, reservationId, customerId, amount, status, paymentDate);
        this.provider = provider;
    }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    //Process online payment
    @Override
    public boolean processPayment() {

        //validate payment provider
        if (provider == null || provider.isEmpty()) {
            setStatus("FAILED");
            return false;
        }
        setStatus("COMPLETED");
        return true;
    }
//Return payment method details
    @Override
    public String getPaymentMethod() {

        //Display online provider name
        return "ONLINE-" + (provider != null ? provider.toUpperCase() : "UNKNOWN");
    }
}
