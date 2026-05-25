package services;

import models.*;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/** Payment & Billing Service. Author: Member 4 */
public class PaymentService {
    private static final String FILE_NAME = "payments.txt";
    private final List<Payment> payments = new ArrayList<>();
    private int nextId = 5000;

    public PaymentService() { loadFromFile(); }

    private void loadFromFile() {
        for (String line : FileHandler.readAllLines(FILE_NAME)) {
            Payment p = parse(line);
            if (p != null) {
                payments.add(p);
                if (p.getPaymentId() >= nextId) nextId = p.getPaymentId() + 1;
            }
        }
    }

    private Payment parse(String line) {
        String[] p = line.split("\\|");
        if (p.length < 7) return null;
        try {
            int id = Integer.parseInt(p[0]);
            int rid = Integer.parseInt(p[1]);
            int cid = Integer.parseInt(p[2]);
            double amt = Double.parseDouble(p[3]);
            String st = p[4], date = p[5], method = p[6];
            if (method.startsWith("CARD-")) {
                String l4 = method.length() >= 9 ? method.substring(method.length() - 4) : "0000";
                return new CardPayment(id, rid, cid, amt, st, date, l4);
            } else if (method.startsWith("ONLINE-")) {
                return new OnlinePayment(id, rid, cid, amt, st, date, method.substring(7));
            } else {
                return new CashPayment(id, rid, cid, amt, st, date);
            }
        } catch (Exception e) { return null; }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Payment p : payments) lines.add(p.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    public Payment recordCardPayment(int rid, int cid, double amt, String date, String last4) {
        CardPayment p = new CardPayment(nextId++, rid, cid, amt, "PENDING", date, last4);
        p.processPayment();
        payments.add(p); persist(); return p;
    }

    public Payment recordCashPayment(int rid, int cid, double amt, String date) {
        CashPayment p = new CashPayment(nextId++, rid, cid, amt, "PENDING", date);
        p.processPayment();
        payments.add(p); persist(); return p;
    }

    public Payment recordOnlinePayment(int rid, int cid, double amt, String date, String provider) {
        OnlinePayment p = new OnlinePayment(nextId++, rid, cid, amt, "PENDING", date, provider);
        p.processPayment();
        payments.add(p); persist(); return p;
    }

    public Payment getById(int id) {
        for (Payment p : payments) if (p.getPaymentId() == id) return p;
        return null;
    }

    public List<Payment> getByCustomer(int customerId) {
        List<Payment> list = new ArrayList<>();
        for (Payment p : payments) if (p.getCustomerId() == customerId) list.add(p);
        return list;
    }

    public List<Payment> getAll() { return new ArrayList<>(payments); }

    public boolean updateStatus(int id, String newStatus) {
        Payment p = getById(id);
        if (p == null) return false;
        p.setStatus(newStatus);
        persist(); return true;
    }

    public boolean deletePayment(int id) {
        boolean removed = payments.removeIf(p -> p.getPaymentId() == id);
        if (removed) persist();
        return removed;
    }

    public String invoiceFor(int paymentId) {
        Payment p = getById(paymentId);
        return p == null ? "Payment not found." : p.generateInvoice();
    }
}
