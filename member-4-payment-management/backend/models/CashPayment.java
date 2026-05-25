package models;

/** Cash payment — completes instantly. Author: Member 4 */
public class CashPayment extends Payment {
    //constructor for cash payment
    public CashPayment(int paymentId, int reservationId, int customerId,
                       double amount, String status, String paymentDate) {
        super(paymentId, reservationId, customerId, amount, status, paymentDate);
    }
//Process cash payment
    @Override public boolean processPayment() {
        //Mark payment as complete
        setStatus("COMPLETED");

        //Return successful payment status
        return true;
    }

    //Return payment method type
    @Override public String getPaymentMethod() {

        //Specify payment type as cash
        return "CASH";
    }
}
