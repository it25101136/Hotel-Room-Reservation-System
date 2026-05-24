package services;

import models.Customer;
import models.RegularCustomer;
import models.VIPCustomer;
import utils.FileHandler;

import java.util.ArrayList;
import java.util.List;

/**
 * Component 03: Customer Management Service
 * Persists to customers.txt
 */
public class CustomerService {
    private static final String FILE_NAME = "customers.txt";
    private final List<Customer> customers = new ArrayList<>();
    private int nextId = 1;

    public CustomerService() {
        loadFromFile();
    }

    private void loadFromFile() {
        List<String> lines = FileHandler.readAllLines(FILE_NAME);
        for (String line : lines) {
            Customer c = parseCustomer(line);
            if (c != null) {
                customers.add(c);
                if (c.getId() >= nextId) nextId = c.getId() + 1;
            }
        }
    }

    private Customer parseCustomer(String line) {
        String[] p = line.split("\\|");
        if (p.length < 8) return null;
        try {
            int id = Integer.parseInt(p[0]);
            String username = p[1], password = p[2], name = p[3];
            String email = p[4], phone = p[5], address = p[6], type = p[7];
            return type.equals("VIP")
                    ? new VIPCustomer(id, username, password, name, email, phone, address)
                    : new RegularCustomer(id, username, password, name, email, phone, address);
        } catch (Exception e) {
            return null;
        }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Customer c : customers) lines.add(c.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    // ============ CRUD ============

    /** CREATE: Register a new customer */
    public Customer registerCustomer(String username, String password, String name,
                                     String email, String phone, String address, boolean vip) {
        // Reject duplicate usernames
        for (Customer c : customers)
            if (c.getUsername().equalsIgnoreCase(username)) return null;

        Customer c = vip
                ? new VIPCustomer(nextId++, username, password, name, email, phone, address)
                : new RegularCustomer(nextId++, username, password, name, email, phone, address);
        customers.add(c);
        persist();
        return c;
    }

    /** Login: authenticate by username + password */
    public Customer login(String username, String password) {
        for (Customer c : customers)
            if (c.authenticate(username, password)) return c;
        return null;
    }

    /** READ: Search by ID */
    public Customer getById(int id) {
        for (Customer c : customers)
            if (c.getId() == id) return c;
        return null;
    }

    /** READ: Get all customers */
    public List<Customer> getAll() {
        return new ArrayList<>(customers);
    }

    /** READ: Search by name (partial, case-insensitive) */
    public List<Customer> searchByName(String query) {
        List<Customer> result = new ArrayList<>();
        String q = query.toLowerCase();
        for (Customer c : customers)
            if (c.getName().toLowerCase().contains(q)) result.add(c);
        return result;
    }

    /** UPDATE: Modify contact details */
    public boolean updateCustomer(int id, String email, String phone, String address) {
        Customer c = getById(id);
        if (c == null) return false;
        if (email != null && !email.isEmpty()) c.setEmail(email);
        if (phone != null && !phone.isEmpty()) c.setPhone(phone);
        if (address != null && !address.isEmpty()) c.setAddress(address);
        persist();
        return true;
    }

    /** Promote a customer to VIP status */
    public boolean upgradeToVIP(int id) {
        Customer c = getById(id);
        if (c == null || c.getCustomerType().equals("VIP")) return false;
        VIPCustomer vip = new VIPCustomer(c.getId(), c.getUsername(), c.getPassword(),
                c.getName(), c.getEmail(), c.getPhone(), c.getAddress());
        customers.remove(c);
        customers.add(vip);
        persist();
        return true;
    }

    /** DELETE: Remove customer account */
    public boolean deleteCustomer(int id) {
        boolean removed = customers.removeIf(c -> c.getId() == id);
        if (removed) persist();
        return removed;
    }
}
