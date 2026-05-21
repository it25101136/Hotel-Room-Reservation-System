package services;

import models.*;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/**
 * Component 04 — Payment & Billing Service.
 * This service class handles all payment-related operations for the system.
 * It supports three payment types: Card, Cash, and Online.
 * All payment records are persisted to a flat text file (payments.txt)
 * using pipe ('|') as the delimiter between fields.
 * Author: Member 4
 */
public class PaymentService {

    // The name of the flat file used to store all payment records
    private static final String FILE_NAME = "payments.txt";

    // In-memory list of all payments loaded from file or created during runtime
    private final List<Payment> payments = new ArrayList<>();

    // Auto-incrementing ID counter for new payments; starts at 5000 to avoid ID conflicts
    private int nextId = 5000;

    /**
     * Constructor — automatically loads existing payments from the file
     * when the service is first created, so data persists across sessions.
     */
    public PaymentService() { loadFromFile(); }

    /**
     * Reads all lines from payments.txt and parses each into a Payment object.
     * Also updates nextId to be one greater than the highest existing ID,
     * preventing duplicate IDs after a restart.
     */
    private void loadFromFile() {
        for (String line : FileHandler.readAllLines(FILE_NAME)) {
            Payment p = parse(line);
            if (p != null) {
                payments.add(p);
                // Ensure nextId is always higher than any existing payment ID
                if (p.getPaymentId() >= nextId) nextId = p.getPaymentId() + 1;
            }
        }
    }

    /**
     * Parses a single pipe-delimited line from payments.txt into the correct Payment subclass.
     * File format: paymentId|reservationId|customerId|amount|status|date|method
     *
     * The 'method' field determines which subclass to instantiate:
     *   - Starts with "CARD-"   → CardPayment   (extracts last 4 digits of card)
     *   - Starts with "ONLINE-" → OnlinePayment  (extracts provider name after "ONLINE-")
     *   - Anything else         → CashPayment
     *
     * Returns null if the line is malformed or has fewer than 7 fields.
     * This demonstrates POLYMORPHISM — the same parse method returns different subtypes.
     */
    private Payment parse(String line) {
        String[] p = line.split("\\|");
        if (p.length < 7) return null; // Guard against corrupt/incomplete lines
        try {
            // Parse each field from the delimited string
            int id = Integer.parseInt(p[0]);       // Payment ID
            int rid = Integer.parseInt(p[1]);      // Reservation ID
            int cid = Integer.parseInt(p[2]);      // Customer ID
            double amt = Double.parseDouble(p[3]); // Payment amount
            String st = p[4], date = p[5], method = p[6];

            // Determine payment type from the method field and return appropriate subclass
            if (method.startsWith("CARD-")) {
                // Extract last 4 digits of the card number for CardPayment
                String l4 = method.length() >= 9 ? method.substring(method.length() - 4) : "0000";
                return new CardPayment(id, rid, cid, amt, st, date, l4);
            } else if (method.startsWith("ONLINE-")) {
                // Extract provider name (e.g., "PayPal") stored after "ONLINE-"
                return new OnlinePayment(id, rid, cid, amt, st, date, method.substring(7));
            } else {
                // Default to CashPayment if no special prefix is found
                return new CashPayment(id, rid, cid, amt, st, date);
            }
        } catch (Exception e) { return null; } // Safely skip any unparseable lines
    }

    /**
     * Saves the current state of all in-memory payments back to payments.txt.
     * Calls toFileString() on each Payment object — each subclass formats this differently.
     * This method is called after every create, update, or delete operation
     * to keep the file in sync with memory (write-through persistence strategy).
     */
    private void persist() {
        List<String> lines = new ArrayList<>();
        // Each Payment subclass implements toFileString() to serialize itself
        for (Payment p : payments) lines.add(p.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD OPERATIONS ============

    /**
     * Creates and records a new CARD payment.
     * Sets initial status to "PENDING", then calls processPayment() to update it.
     * Adds to the in-memory list and immediately persists to file.
     *
     * @param rid   Reservation ID this payment is linked to
     * @param cid   Customer ID making the payment
     * @param amt   Amount to be paid
     * @param date  Date of payment
     * @param last4 Last 4 digits of the customer's card (for display/receipt purposes)
     * @return The newly created CardPayment object
     */
    public Payment recordCardPayment(int rid, int cid, double amt, String date, String last4) {
        CardPayment p = new CardPayment(nextId++, rid, cid, amt, "PENDING", date, last4);
        p.processPayment(); // Transitions status from PENDING to COMPLETED (or FAILED)
        payments.add(p); persist(); return p;
    }

    /**
     * Creates and records a new CASH payment.
     * Same flow as card: PENDING → processPayment() → persist.
     *
     * @param rid  Reservation ID
     * @param cid  Customer ID
     * @param amt  Amount paid in cash
     * @param date Date of payment
     * @return The newly created CashPayment object
     */
    public Payment recordCashPayment(int rid, int cid, double amt, String date) {
        CashPayment p = new CashPayment(nextId++, rid, cid, amt, "PENDING", date);
        p.processPayment(); // Cash payments are typically auto-confirmed
        payments.add(p); persist(); return p;
    }

    /**
     * Creates and records a new ONLINE payment (e.g., PayPal, Stripe).
     * The provider name is stored alongside the payment for reference.
     *
     * @param rid      Reservation ID
     * @param cid      Customer ID
     * @param amt      Amount paid
     * @param date     Date of payment
     * @param provider Name of the online payment provider
     * @return The newly created OnlinePayment object
     */
    public Payment recordOnlinePayment(int rid, int cid, double amt, String date, String provider) {
        OnlinePayment p = new OnlinePayment(nextId++, rid, cid, amt, "PENDING", date, provider);
        p.processPayment(); // Processes and confirms the online payment
        payments.add(p); persist(); return p;
    }

    /**
     * Looks up a single payment by its unique payment ID.
     * Performs a linear search through the in-memory list.
     *
     * @param id The payment ID to search for
     * @return The matching Payment object, or null if not found
     */
    public Payment getById(int id) {
        for (Payment p : payments) if (p.getPaymentId() == id) return p;
        return null; // Returns null if no match is found
    }

    /**
     * Retrieves all payments associated with a specific customer.
     * Useful for showing a customer's full billing history.
     *
     * @param customerId The customer whose payments to retrieve
     * @return A list of all payments made by that customer (may be empty)
     */
    public List<Payment> getByCustomer(int customerId) {
        List<Payment> list = new ArrayList<>();
        for (Payment p : payments) if (p.getCustomerId() == customerId) list.add(p);
        return list;
    }

    /**
     * Returns a copy of all payments currently stored in memory.
     * Returns a new ArrayList to protect the internal list from external modification
     * (defensive copying — an encapsulation best practice).
     *
     * @return A new list containing all Payment records
     */
    public List<Payment> getAll() { return new ArrayList<>(payments); }

    /**
     * Updates the status of an existing payment (e.g., PENDING → COMPLETED, or REFUNDED).
     * Finds the payment by ID, updates its status field, and persists the change.
     *
     * @param id        The ID of the payment to update
     * @param newStatus The new status string to set
     * @return true if the payment was found and updated; false if not found
     */
    public boolean updateStatus(int id, String newStatus) {
        Payment p = getById(id);
        if (p == null) return false; // Payment doesn't exist — nothing to update
        p.setStatus(newStatus);
        persist(); return true; // Persist updated state to file
    }

    /**
     * Deletes a payment record by ID from both memory and the file.
     * Uses removeIf() with a lambda for concise filtering.
     * Only writes to file if a record was actually removed (avoids unnecessary I/O).
     *
     * @param id The ID of the payment to delete
     * @return true if the payment was found and deleted; false if not found
     */
    public boolean deletePayment(int id) {
        // removeIf returns true if any element was removed
        boolean removed = payments.removeIf(p -> p.getPaymentId() == id);
        if (removed) persist(); // Only persist if something actually changed
        return removed;
    }

    /**
     * Generates a formatted invoice string for a given payment.
     * Delegates to the Payment object's generateInvoice() method —
     * each subclass may format the invoice differently (POLYMORPHISM).
     *
     * @param paymentId The ID of the payment to generate an invoice for
     * @return A formatted invoice string, or an error message if not found
     */
    public String invoiceFor(int paymentId) {
        Payment p = getById(paymentId);
        // If payment not found, return a user-friendly error instead of null
        return p == null ? "Payment not found." : p.generateInvoice();
    }
}
