package services;

import models.*;
import utils.FileHandler;

import java.util.ArrayList;
import java.util.List;

/**
 * Component 04: Payment & Billing Service
 * Persists to payments.txt
 */
public class PaymentService {
    private static final String FILE_NAME = "payments.txt";
    private final List<Payment> payments = new ArrayList<>();
    private int nextId = 5000;

    public PaymentService() {
        loadFromFile();
    }

    private void loadFromFile() {
        List<String> lines = FileHandler.readAllLines(FILE_NAME);
        for (String line : lines) {
            Payment p = parsePayment(line);
            if (p != null) {
                payments.add(p);
                if (p.getPaymentId() >= nextId) nextId = p.getPaymentId() + 1;
            }
        }
    }

    private Payment parsePayment(String line) {
        String[] p = line.split("\\|");
        if (p.length < 7) return null;
        try {
            int id = Integer.parseInt(p[0]);
            int resId = Integer.parseInt(p[1]);
            int custId = Integer.parseInt(p[2]);
            double amount = Double.parseDouble(p[3]);
            String status = p[4];
            String date = p[5];
            String method = p[6];

            if (method.startsWith("CARD-")) {
                String last4 = method.length() >= 9 ? method.substring(method.length() - 4) : "0000";
                return new CardPayment(id, resId, custId, amount, status, date, last4);
            } else if (method.startsWith("ONLINE-")) {
                String provider = method.substring(7);
                return new OnlinePayment(id, resId, custId, amount, status, date, provider);
            } else {
                return new CashPayment(id, resId, custId, amount, status, date);
            }
        } catch (Exception e) {
            return null;
        }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Payment p : payments) lines.add(p.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD ============

    /** CREATE: Card Payment */
    public Payment recordCardPayment(int reservationId, int customerId, double amount,
                                     String date, String cardLastFour) {
        CardPayment p = new CardPayment(nextId++, reservationId, customerId, amount, "PENDING", date, cardLastFour);
        p.processPayment();
        payments.add(p);
        persist();
        return p;
    }

    /** CREATE: Cash Payment */
    public Payment recordCashPayment(int reservationId, int customerId, double amount, String date) {
        CashPayment p = new CashPayment(nextId++, reservationId, customerId, amount, "PENDING", date);
        p.processPayment();
        payments.add(p);
        persist();
        return p;
    }

    /** CREATE: Online Payment */
    public Payment recordOnlinePayment(int reservationId, int customerId, double amount,
                                       String date, String provider) {
        OnlinePayment p = new OnlinePayment(nextId++, reservationId, customerId, amount, "PENDING", date, provider);
        p.processPayment();
        payments.add(p);
        persist();
        return p;
    }

    /** READ: View payment by ID */
    public Payment getById(int paymentId) {
        for (Payment p : payments) if (p.getPaymentId() == paymentId) return p;
        return null;
    }

    /** READ: Payment history for a customer */
    public List<Payment> getByCustomer(int customerId) {
        List<Payment> list = new ArrayList<>();
        for (Payment p : payments) if (p.getCustomerId() == customerId) list.add(p);
        return list;
    }

    /** READ: All payments */
    public List<Payment> getAll() {
        return new ArrayList<>(payments);
    }

    /** UPDATE: Update payment status */
    public boolean updateStatus(int paymentId, String newStatus) {
        Payment p = getById(paymentId);
        if (p == null) return false;
        p.setStatus(newStatus);
        persist();
        return true;
    }

    /** DELETE: Remove payment record (refunds/corrections) */
    public boolean deletePayment(int paymentId) {
        boolean removed = payments.removeIf(p -> p.getPaymentId() == paymentId);
        if (removed) persist();
        return removed;
    }

    /** Generate invoice text for a payment */
    public String invoiceFor(int paymentId) {
        Payment p = getById(paymentId);
        return p == null ? "Payment not found." : p.generateInvoice();
    }
}
