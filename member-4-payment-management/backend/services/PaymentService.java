package services;

import models.*;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/** Payment & Billing Service. Author: Member 4 */

//CRUD
public class PaymentService {
    //Payment text file name
    private static final String FILE_NAME = "payments.txt";
    //Store all payment objects
    private final List<Payment> payments = new ArrayList<>();

    private int nextId = 5000;

    public PaymentService() {
        //load payment data from the file
        loadFromFile();
    }
//Load all payment records
    private void loadFromFile() {

        //Read payment data from txt file
        for (String line : FileHandler.readAllLines(FILE_NAME)) {
            //convert text data into object
            Payment p = parse(line);
            if (p != null) {
                payments.add(p);

                //Generate next payment ID
                if (p.getPaymentId() >= nextId) nextId = p.getPaymentId() + 1;
            }
        }
    }

    //Convert file data into payment object
    private Payment parse(String line) {

        //spliit file data using |
        String[] p = line.split("\\|");

        //validate file format
        if (p.length < 7) return null;
        try {

            //convert text values into variables
            int id = Integer.parseInt(p[0]);
            int rid = Integer.parseInt(p[1]);
            int cid = Integer.parseInt(p[2]);
            double amt = Double.parseDouble(p[3]);

            //store status ,date and method
            String st = p[4], date = p[5], method = p[6];

            //Create card payment object
            if (method.startsWith("CARD-")) {

                //Extract last 4 digits
                String l4 = method.length() >= 9 ? method.substring(method.length() - 4) : "0000";
                return new CardPayment(id, rid, cid, amt, st, date, l4);

                //create online payment object
            } else if (method.startsWith("ONLINE-")) {
                return new OnlinePayment(id, rid, cid, amt, st, date, method.substring(7));

                //create cash payment object
            } else {
                return new CashPayment(id, rid, cid, amt, st, date);
            }

            //Handle invalid file data
        } catch (Exception e) {
            return null;
        }
    }

    //Save all payment data into file
    private void persist() {

        //Store file lines
        List<String> lines = new ArrayList<>();

        //convert objects into file format
        for (Payment p : payments) lines.add(p.toFileString());

        //write payment data into txt file
        FileHandler.writeAllLines(FILE_NAME, lines);
    }
    //CREATE
    //Create card payment
    public Payment recordCardPayment(int rid, int cid, double amt, String date, String last4) {

        //create new card payment object
        CardPayment p = new CardPayment(nextId++, rid, cid, amt, "PENDING", date, last4);

        //process payment
        p.processPayment();

        //Add payments to list
        payments.add(p);

        //Save data into file
        persist();

        return p;
    }

    //Create cash payment
    public Payment recordCashPayment(int rid, int cid, double amt, String date) {

        //Create cash payment object
        CashPayment p = new CashPayment(nextId++, rid, cid, amt, "PENDING", date);

        // Process payment
        p.processPayment();

        // Add payment to list
        payments.add(p);

        // Save data into file
        persist();

        return p;
    }

    //Create online payment
    public Payment recordOnlinePayment(int rid, int cid, double amt, String date, String provider) {

        // Create online payment object
        OnlinePayment p = new OnlinePayment(nextId++, rid, cid, amt, "PENDING", date, provider);

        // Process payment
        p.processPayment();

        // Add payment to list
        payments.add(p);

        // Save data into file
        persist();

        return p;
    }

    //READ
    // Read payment using payment ID
    public Payment getById(int id) {

        // Search payment by ID
        for (Payment p : payments)
            if (p.getPaymentId() == id)
                return p;

        return null;
    }

    // Read payments by customer ID
    public List<Payment> getByCustomer(int customerId) {

        // Store matching payments
        List<Payment> list = new ArrayList<>();

        // Search customer payments
        for (Payment p : payments)
            if (p.getCustomerId() == customerId)
                list.add(p);

        return list;
    }

    // Read all payments
    public List<Payment> getAll() {

        // Return all payment records
        return new ArrayList<>(payments);
    }

    //UPDATE
    // Update payment status
    public boolean updateStatus(int id, String newStatus) {

        // Find payment by ID
        Payment p = getById(id);

        // Validate payment
        if (p == null)
            return false;

        // Update payment status
        p.setStatus(newStatus);

        // Save updated data
        persist();

        return true;
    }

    DELETE
    //Delete payment record
    public boolean deletePayment(int id) {

        // Remove payment by ID
        boolean removed = payments.removeIf(p -> p.getPaymentId() == id);

        //Save updated file
        if (removed)
            persist();

        return removed;
    }

    // Generate invoice
    public String invoiceFor(int paymentId) {

        // Find payment
        Payment p = getById(paymentId);

        // Return invoice details
        return p == null ? "Payment not found." : p.generateInvoice();
    }
}
