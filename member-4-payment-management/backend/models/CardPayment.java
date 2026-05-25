package models;

/** Card payment — validates last-4 digits. Author: Member 4 */
public class CardPayment extends Payment {
    //Store last 4 digits of the card
    private String cardLastFour;

    //constructor for card payment
    public CardPayment(int paymentId, int reservationId, int customerId,
                       double amount, String status, String paymentDate, String cardLastFour) {
        //Call parent class constructor
        super(paymentId, reservationId, customerId, amount, status, paymentDate);
        //initialize card digits
        this.cardLastFour = cardLastFour;
    }
//Getter method
    public String getCardLastFour() { return cardLastFour; }
    //Setter method
    public void setCardLastFour(String cardLastFour) { this.cardLastFour = cardLastFour; }
//process card payment
    @Override
    public boolean processPayment() {
        //Validate card digits
        if (cardLastFour == null || cardLastFour.length() != 4) {

            //Mark payment as failed
            setStatus("FAILED");
            return false;
        }
        //Mark payment as completed
        setStatus("COMPLETED");
        return true;
    }
//Return payment method details
    @Override
    public String getPaymentMethod() {

        //Check whether card digit exist
        //If available, show last 4 digits
        //otherwise display the default value 0000
        return "CARD-****" + (cardLastFour != null ? cardLastFour : "0000");
    }
}
