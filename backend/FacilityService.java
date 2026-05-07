package services;

import models.BasicService;
import models.PremiumService;
import models.Service;
import models.CustomerService;
import utils.FileHandler;
import java.util.ArrayList;
import java.util.List;

/**
 * Component 07 — Service & Facility Management Service.
 * Persists services to services.txt
 * Persists customer-selected services to customer_services.txt
 * Author: Member 6
 */
public class FacilityService {
    private static final String SERVICES_FILE = "services.txt";
    private static final String CUSTOMER_SERVICES_FILE = "customer_services.txt";

    private final List<Service> services = new ArrayList<>();
    private final List<CustomerService> customerServices = new ArrayList<>();
    private int nextServiceId = 1;
    private int nextCustomerServiceId = 1;

    public FacilityService() {
        loadServices();
        loadCustomerServices();
        if (services.isEmpty()) seedDefaultServices();
    }

    private void seedDefaultServices() {
        // Match Aurum spa treatments
        addService(new PremiumService(nextServiceId++, "Royal Gold Facial",   105_000, true, "90 min luxury facial",      "SPA"));
        addService(new PremiumService(nextServiceId++, "Deep Tissue Massage",  72_000, true, "60 min therapeutic massage","SPA"));
        addService(new PremiumService(nextServiceId++, "Aromatherapy Journey", 92_000, true, "75 min aromatherapy",       "SPA"));
        addService(new PremiumService(nextServiceId++, "Hot Stone Therapy",   115_000, true, "90 min hot stone therapy",  "SPA"));
        addService(new BasicService(nextServiceId++,   "Wi-Fi (Premium)",       2_500, true, "High-speed unlimited Wi-Fi","ROOM"));
        addService(new BasicService(nextServiceId++,   "Breakfast Buffet",     12_000, true, "Continental + Sri Lankan",  "DINING"));
        addService(new BasicService(nextServiceId++,   "Airport Pickup",       18_000, true, "BIA Colombo → Hotel",       "TRANSPORT"));
        addService(new BasicService(nextServiceId++,   "Valet Parking",         5_000, true, "24/7 secured parking",      "TRANSPORT"));
    }

    // ===== SERVICES =====
    private void loadServices() {
        for (String line : FileHandler.readAllLines(SERVICES_FILE)) {
            Service s = parseService(line);
            if (s != null) {
                services.add(s);
                if (s.getServiceId() >= nextServiceId) nextServiceId = s.getServiceId() + 1;
            }
        }
    }

    private Service parseService(String line) {
        String[] p = line.split("\\|");
        if (p.length < 7) return null;
        try {
            int id = Integer.parseInt(p[0]);
            String name = p[1];
            double price = Double.parseDouble(p[2]);
            boolean avail = Boolean.parseBoolean(p[3]);
            String desc = p[4], cat = p[5], tier = p[6];
            return tier.equals("PREMIUM")
                    ? new PremiumService(id, name, price, avail, desc, cat)
                    : new BasicService(id, name, price, avail, desc, cat);
        } catch (Exception e) { return null; }
    }

    private void persistServices() {
        List<String> lines = new ArrayList<>();
        for (Service s : services) lines.add(s.toFileString());
        FileHandler.writeAllLines(SERVICES_FILE, lines);
    }

    // ===== CUSTOMER SERVICES =====
    private void loadCustomerServices() {
        for (String line : FileHandler.readAllLines(CUSTOMER_SERVICES_FILE)) {
            CustomerService cs = parseCustomerService(line);
            if (cs != null) {
                customerServices.add(cs);
                if (cs.getId() >= nextCustomerServiceId) nextCustomerServiceId = cs.getId() + 1;
            }
        }
    }

    private CustomerService parseCustomerService(String line) {
        String[] p = line.split("\\|");
        if (p.length < 7) return null;
        try {
            return new CustomerService(
                    Integer.parseInt(p[0]), Integer.parseInt(p[1]),
                    Integer.parseInt(p[2]), Integer.parseInt(p[3]),
                    Integer.parseInt(p[4]), Double.parseDouble(p[5]), p[6]);
        } catch (Exception e) { return null; }
    }

    private void persistCustomerServices() {
        List<String> lines = new ArrayList<>();
        for (CustomerService cs : customerServices) lines.add(cs.toFileString());
        FileHandler.writeAllLines(CUSTOMER_SERVICES_FILE, lines);
    }

    // ============ CRUD: SERVICES ============

    public boolean addService(Service s) {
        for (Service x : services) if (x.getServiceId() == s.getServiceId()) return false;
        services.add(s);
        persistServices();
        return true;
    }

    public Service getServiceById(int id) {
        for (Service s : services) if (s.getServiceId() == id) return s;
        return null;
    }

    public List<Service> getAllServices() { return new ArrayList<>(services); }

    public List<Service> getAvailableServices() {
        List<Service> list = new ArrayList<>();
        for (Service s : services) if (s.isAvailable()) list.add(s);
        return list;
    }

    public boolean updateService(int id, Double price, Boolean available, String description) {
        Service s = getServiceById(id);
        if (s == null) return false;
        if (price != null) s.setPrice(price);
        if (available != null) s.setAvailable(available);
        if (description != null && !description.isEmpty()) s.setDescription(description);
        persistServices();
        return true;
    }

    public boolean deleteService(int id) {
        boolean removed = services.removeIf(s -> s.getServiceId() == id);
        if (removed) persistServices();
        return removed;
    }

    // ============ CRUD: CUSTOMER SERVICES ============

    public CustomerService requestService(int customerId, int reservationId, int serviceId, int quantity) {
        Service s = getServiceById(serviceId);
        if (s == null || !s.isAvailable()) return null;
        double total = s.calculatePrice(quantity);
        CustomerService cs = new CustomerService(nextCustomerServiceId++, customerId,
                reservationId, serviceId, quantity, total, "REQUESTED");
        customerServices.add(cs);
        persistCustomerServices();
        return cs;
    }

    public List<CustomerService> getCustomerServicesByReservation(int reservationId) {
        List<CustomerService> list = new ArrayList<>();
        for (CustomerService cs : customerServices)
            if (cs.getReservationId() == reservationId) list.add(cs);
        return list;
    }

    public List<CustomerService> getAllCustomerServices() {
        return new ArrayList<>(customerServices);
    }

    public boolean updateCustomerServiceStatus(int id, String newStatus) {
        for (CustomerService cs : customerServices) {
            if (cs.getId() == id) {
                cs.setStatus(newStatus);
                persistCustomerServices();
                return true;
            }
        }
        return false;
    }

    public boolean cancelCustomerService(int id) {
        return updateCustomerServiceStatus(id, "CANCELLED");
    }

    public boolean removeCustomerService(int id) {
        boolean removed = customerServices.removeIf(cs -> cs.getId() == id);
        if (removed) persistCustomerServices();
        return removed;
    }
}
