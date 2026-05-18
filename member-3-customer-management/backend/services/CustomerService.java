package services;

import models.Customer;
import models.RegularCustomer;
import models.VIPCustomer;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/** Customer Management Service. Author: Member 3 */
public class CustomerService {
    private static final String FILE_NAME = "customers.txt";
    private final List<Customer> customers = new ArrayList<>();
    private int nextId = 1;

    public CustomerService() { loadFromFile(); }

    private void loadFromFile() {
        for (String line : FileHandler.readAllLines(FILE_NAME)) {
            Customer c = parse(line);
            if (c != null) {
                customers.add(c);
                if (c.getId() >= nextId) nextId = c.getId() + 1;
            }
        }
    }

    private Customer parse(String line) {
        String[] p = line.split("\\|");
        if (p.length < 8) return null;
        try {
            int id = Integer.parseInt(p[0]);
            return p[7].equals("VIP")
                    ? new VIPCustomer(id, p[1], p[2], p[3], p[4], p[5], p[6])
                    : new RegularCustomer(id, p[1], p[2], p[3], p[4], p[5], p[6]);
        } catch (Exception e) { return null; }
    }

    private void persist() {
        List<String> lines = new ArrayList<>();
        for (Customer c : customers) lines.add(c.toFileString());
        FileHandler.writeAllLines(FILE_NAME, lines);
    }

    public Customer registerCustomer(String username, String password, String name,
                                     String email, String phone, String address, boolean vip) {
        for (Customer c : customers)
            if (c.getUsername().equalsIgnoreCase(username)) return null;
        Customer c = vip
                ? new VIPCustomer(nextId++, username, password, name, email, phone, address)
                : new RegularCustomer(nextId++, username, password, name, email, phone, address);
        customers.add(c);
        persist();
        return c;
    }

    public Customer login(String username, String password) {
        for (Customer c : customers)
            if (c.authenticate(username, password)) return c;
        return null;
    }

    public Customer getById(int id) {
        for (Customer c : customers) if (c.getId() == id) return c;
        return null;
    }

    public List<Customer> getAll() { return new ArrayList<>(customers); }

    public List<Customer> searchByName(String query) {
        List<Customer> result = new ArrayList<>();
        String q = query.toLowerCase();
        for (Customer c : customers)
            if (c.getName().toLowerCase().contains(q)) result.add(c);
        return result;
    }

    public boolean updateCustomer(int id, String email, String phone, String address) {
        Customer c = getById(id);
        if (c == null) return false;
        if (email != null && !email.isEmpty()) c.setEmail(email);
        if (phone != null && !phone.isEmpty()) c.setPhone(phone);
        if (address != null && !address.isEmpty()) c.setAddress(address);
        persist();
        return true;
    }

    public boolean upgradeToVIP(int id) {
        Customer c = getById(id);
        if (c == null || c.getCustomerType().equals("VIP")) return false;
        VIPCustomer vip = new VIPCustomer(c.getId(), c.getUsername(), c.getPassword(), c.getName(), c.getEmail(), c.getPhone(), c.getAddress());
        customers.remove(c);
        customers.add(vip);
        persist();
        return true;
    }

    public boolean deleteCustomer(int id) {
        boolean removed = customers.removeIf(c -> c.getId() == id);
        if (removed) persist();
        return removed;
    }
}
