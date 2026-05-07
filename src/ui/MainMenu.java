package ui;
import models.*;
import services.*;
import java.util.List;
import java.util.Scanner;
/**
 * Console-based UI for Aurum Hotel Management System.
 * Provides menus for all 7 components.
 */
public class MainMenu {
    private final Scanner sc = new Scanner(System.in);
    private final RoomService rooms                 = new RoomService();          // C01
    private final ReservationService reservations   = new ReservationService();   // C02
    private final CustomerService customers         = new CustomerService();      // C03
    private final PaymentService payments           = new PaymentService();       // C04
    private final AdminService admins               = new AdminService();         // C05
    private final ReviewService reviews             = new ReviewService();        // C06
    private final FacilityService facilities        = new FacilityService();      // C07
    private Customer loggedInCustomer = null;
    private AdminUser loggedInAdmin = null;
    public void start() {
        printBanner();
        while (true) {
            System.out.println("\n========== AURUM HOTEL — MAIN MENU ==========");
            System.out.println("1. Customer Login");
            System.out.println("2. Customer Register");
            System.out.println("3. Admin Login");
            System.out.println("4. Browse Rooms (Public)");
            System.out.println("5. View Reviews (Public)");
            System.out.println("0. Exit");
            System.out.print("Choose: ");
            String c = sc.nextLine().trim();
            switch (c) {
                case "1": customerLogin(); break;
                case "2": customerRegister(); break;
                case "3": adminLogin(); break;
                case "4": listRooms(); break;
                case "5": listReviewsPublic(); break;
                case "0":
                    System.out.println("Thank you for visiting Aurum Hotel. Ayubowan!");
                    return;
                default: System.out.println("Invalid choice.");
            }
        }
    }
    private void printBanner() {
        System.out.println("\n████████████████████████████████████████████████████");
        System.out.println("█                                                  █");
        System.out.println("█        AURUM HOTEL MANAGEMENT SYSTEM             █");
        System.out.println("█        Galle Face, Colombo, Sri Lanka            █");
        System.out.println("█        Tel: +94 11 244 5555                      █");
        System.out.println("█                                                  █");
        System.out.println("████████████████████████████████████████████████████");
    }
    // ============ AUTH ============
    private void customerLogin() {
        System.out.print("Username: "); String u = sc.nextLine();
        System.out.print("Password: "); String p = sc.nextLine();
        Customer c = customers.login(u, p);
        if (c == null) { System.out.println("✗ Invalid credentials."); return; }
        loggedInCustomer = c;
        System.out.println("✓ Welcome, " + c.getName() + " (" + c.getCustomerType() + ")!");
        customerMenu();
    }
    private void customerRegister() {
        System.out.print("Username: "); String u = sc.nextLine();
        System.out.print("Password: "); String p = sc.nextLine();
        System.out.print("Full Name: "); String n = sc.nextLine();
        System.out.print("Email: "); String e = sc.nextLine();
        System.out.print("Phone (e.g. +94 77 123 4567): "); String ph = sc.nextLine();
        System.out.print("Address (Sri Lanka): "); String a = sc.nextLine();
        Customer c = customers.registerCustomer(u, p, n, e, ph, a, false);
        System.out.println(c == null ? "✗ Username already exists." : "✓ Registered! Customer ID: " + c.getId());
    }
    private void adminLogin() {
        System.out.print("Admin username: "); String u = sc.nextLine();
        System.out.print("Password: "); String p = sc.nextLine();
        AdminUser a = admins.login(u, p);
        if (a == null) { System.out.println("✗ Invalid admin credentials."); return; }
        loggedInAdmin = a;
        System.out.println("✓ Welcome, " + a.getName() + " (" + a.getPermissions() + ")");
        adminMenu();
    }
    // ============ CUSTOMER MENU ============
    private void customerMenu() {
        while (loggedInCustomer != null) {
            System.out.println("\n----- CUSTOMER MENU (" + loggedInCustomer.getName() + ") -----");
            System.out.println("1. Browse Rooms");
            System.out.println("2. Make Reservation");
            System.out.println("3. My Reservations");
            System.out.println("4. Cancel Reservation");
            System.out.println("5. Make Payment");
            System.out.println("6. Payment History");
            System.out.println("7. Browse Services");
            System.out.println("8. Request Service");
            System.out.println("9. Submit Review");
            System.out.println("10. Update My Profile");
            System.out.println("0. Logout");
            System.out.print("Choose: ");
            String c = sc.nextLine().trim();
            switch (c) {
                case "1": listRooms(); break;
                case "2": makeReservation(); break;
                case "3": viewMyReservations(); break;
                case "4": cancelReservationFlow(); break;
                case "5": makePaymentFlow(); break;
                case "6": viewMyPayments(); break;
                case "7": listServices(); break;
                case "8": requestServiceFlow(); break;
                case "9": submitReviewFlow(); break;
                case "10": updateProfileFlow(); break;
                case "0": loggedInCustomer = null; return;
                default: System.out.println("Invalid choice.");
            }
        }
    }
    // ============ ADMIN MENU ============
    private void adminMenu() {
        while (loggedInAdmin != null) {
            System.out.println("\n----- ADMIN PANEL (" + loggedInAdmin.getName() + ") -----");
            System.out.println("[Rooms]    1.List 2.Add 3.Update 4.Delete 5.Search");
            System.out.println("[Reserv]   6.List(sorted) 7.Update 8.Cancel");
            System.out.println("[Custom]   9.List 10.Search 11.Upgrade VIP 12.Delete");
            System.out.println("[Payment]  13.List 14.Update Status 15.Invoice");
            System.out.println("[Reviews]  16.List All 17.Approve 18.Delete");
            System.out.println("[Service]  19.List 20.Add 21.Update 22.Delete");
            System.out.println("[Admin]    23.List 24.Add 25.Delete");
            System.out.println("0. Logout");
            System.out.print("Choose: ");
            String c = sc.nextLine().trim();
            switch (c) {
                case "1": listRooms(); break;
                case "2": adminAddRoom(); break;
                case "3": adminUpdateRoom(); break;
                case "4": adminDeleteRoom(); break;
                case "5": adminSearchRoom(); break;
                case "6": listAllReservations(); break;
                case "7": adminUpdateReservation(); break;
                case "8": adminCancelReservation(); break;
                case "9": listAllCustomers(); break;
                case "10": adminSearchCustomer(); break;
                case "11": adminUpgradeVIP(); break;
                case "12": adminDeleteCustomer(); break;
                case "13": listAllPayments(); break;
                case "14": adminUpdatePayment(); break;
                case "15": adminViewInvoice(); break;
                case "16": listAllReviewsAdmin(); break;
                case "17": adminApproveReview(); break;
                case "18": adminDeleteReview(); break;
                case "19": listServices(); break;
                case "20": adminAddService(); break;
                case "21": adminUpdateService(); break;
                case "22": adminDeleteService(); break;
                case "23": listAllAdmins(); break;
                case "24": adminAddAdmin(); break;
                case "25": adminDeleteAdmin(); break;
                case "0": loggedInAdmin = null; return;
                default: System.out.println("Invalid choice.");
            }
        }
    }
    // ============ COMPONENT 01: ROOMS ============
    private void listRooms() {
        System.out.println("\n--- ALL ROOMS (BST in-order) ---");
        for (Room r : rooms.getAllRooms()) System.out.println(r);
    }
    private void adminAddRoom() {
        try {
            System.out.print("Room number: "); int num = Integer.parseInt(sc.nextLine());
            System.out.print("Type (standard/deluxe/suite): "); String type = sc.nextLine().toLowerCase();
            System.out.print("Price (LKR): "); double price = Double.parseDouble(sc.nextLine());
            System.out.print("Description: "); String desc = sc.nextLine();
            Room r = type.equals("deluxe") ? new DeluxeRoom(num, price, true, desc)
                    : type.equals("suite")  ? new SuiteRoom(num, price, true, desc)
                    : new StandardRoom(num, price, true, desc);
            System.out.println(rooms.addRoom(r) ? "✓ Room added." : "✗ Room number already exists.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminUpdateRoom() {
        try {
            System.out.print("Room number: "); int num = Integer.parseInt(sc.nextLine());
            System.out.print("New price (blank=skip): "); String pr = sc.nextLine();
            System.out.print("Available? (true/false/blank): "); String av = sc.nextLine();
            System.out.print("New description (blank=skip): "); String d = sc.nextLine();
            Double price = pr.isEmpty() ? null : Double.parseDouble(pr);
            Boolean avail = av.isEmpty() ? null : Boolean.parseBoolean(av);
            String desc = d.isEmpty() ? null : d;
            System.out.println(rooms.updateRoom(num, price, avail, desc) ? "✓ Updated." : "✗ Room not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminDeleteRoom() {
        try {
            System.out.print("Room number: "); int num = Integer.parseInt(sc.nextLine());
            System.out.println(rooms.deleteRoom(num) ? "✓ Deleted." : "✗ Not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminSearchRoom() {
        try {
            System.out.print("Room number: "); int num = Integer.parseInt(sc.nextLine());
            Room r = rooms.searchRoom(num);
            System.out.println(r == null ? "✗ Not found." : r);
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    // ============ COMPONENT 02: RESERVATIONS ============
    private void makeReservation() {
        try {
            System.out.print("Room number: "); int rn = Integer.parseInt(sc.nextLine());
            Room r = rooms.searchRoom(rn);
            if (r == null) { System.out.println("✗ Room not found."); return; }
            if (!r.isAvailable()) { System.out.println("✗ Room not available."); return; }
            System.out.print("Check-in (YYYY-MM-DD): "); String ci = sc.nextLine();
            System.out.print("Check-out (YYYY-MM-DD): "); String co = sc.nextLine();
            System.out.print("Number of nights: "); int nights = Integer.parseInt(sc.nextLine());
            double total = r.calculateFinalPrice(nights);
            double discount = loggedInCustomer.calculateDiscount(total);
            total -= discount;
            System.out.printf("Total after %s discount: LKR %,.2f%n", loggedInCustomer.getCustomerType(), total);
            Reservation res = reservations.createOnlineReservation(loggedInCustomer.getId(), rn, ci, co, total);
            if (res != null) {
                rooms.updateRoom(rn, null, false, null);
                System.out.println("✓ Reservation created: " + res);
            } else {
                System.out.println("✗ Booking validation failed.");
            }
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void viewMyReservations() {
        List<Reservation> list = reservations.getByCustomer(loggedInCustomer.getId());
        System.out.println("\n--- MY RESERVATIONS (sorted by check-in via QuickSort) ---");
        if (list.isEmpty()) System.out.println("(none)");
        for (Reservation r : list) System.out.println(r);
    }
    private void cancelReservationFlow() {
        try {
            System.out.print("Reservation ID: "); int id = Integer.parseInt(sc.nextLine());
            Reservation r = reservations.getById(id);
            if (r == null || r.getCustomerId() != loggedInCustomer.getId()) {
                System.out.println("✗ Reservation not found or not yours.");
                return;
            }
            if (reservations.cancelReservation(id)) {
                rooms.updateRoom(r.getRoomNumber(), null, true, null);
                System.out.println("✓ Cancelled.");
            }
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void listAllReservations() {
        System.out.println("\n--- ALL RESERVATIONS (QuickSort by check-in) ---");
        for (Reservation r : reservations.getAllSortedByCheckIn()) System.out.println(r);
    }
    private void adminUpdateReservation() {
        try {
            System.out.print("Reservation ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.print("New check-in (blank=skip): "); String ci = sc.nextLine();
            System.out.print("New check-out (blank=skip): "); String co = sc.nextLine();
            System.out.print("New room # (blank=skip): "); String rn = sc.nextLine();
            Integer roomNum = rn.isEmpty() ? null : Integer.parseInt(rn);
            System.out.println(reservations.updateReservation(id,
                    ci.isEmpty() ? null : ci, co.isEmpty() ? null : co, roomNum)
                    ? "✓ Updated." : "✗ Not found or invalid.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminCancelReservation() {
        try {
            System.out.print("Reservation ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.println(reservations.cancelReservation(id) ? "✓ Cancelled." : "✗ Not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    // ============ COMPONENT 03: CUSTOMERS ============
    private void updateProfileFlow() {
        System.out.print("New email (blank=skip): "); String e = sc.nextLine();
        System.out.print("New phone (blank=skip): "); String p = sc.nextLine();
        System.out.print("New address (blank=skip): "); String a = sc.nextLine();
        System.out.println(customers.updateCustomer(loggedInCustomer.getId(), e, p, a)
                ? "✓ Profile updated." : "✗ Update failed.");
    }
    private void listAllCustomers() {
        System.out.println("\n--- CUSTOMERS ---");
        for (Customer c : customers.getAll()) System.out.println(c);
    }
    private void adminSearchCustomer() {
        System.out.print("Search by name: "); String q = sc.nextLine();
        List<Customer> list = customers.searchByName(q);
        if (list.isEmpty()) System.out.println("(no matches)");
        for (Customer c : list) System.out.println(c);
    }
    private void adminUpgradeVIP() {
        try {
            System.out.print("Customer ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.println(customers.upgradeToVIP(id) ? "✓ Upgraded to VIP." : "✗ Failed.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminDeleteCustomer() {
        try {
            System.out.print("Customer ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.println(customers.deleteCustomer(id) ? "✓ Deleted." : "✗ Not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    // ============ COMPONENT 04: PAYMENTS ============
    private void makePaymentFlow() {
        try {
            System.out.print("Reservation ID: "); int rid = Integer.parseInt(sc.nextLine());
            Reservation r = reservations.getById(rid);
            if (r == null || r.getCustomerId() != loggedInCustomer.getId()) {
                System.out.println("✗ Reservation not found or not yours."); return;
            }
            System.out.printf("Amount due: LKR %,.2f%n", r.getTotalAmount());
            System.out.print("Method (1=Card, 2=Cash, 3=Online): "); String m = sc.nextLine();
            System.out.print("Payment date (YYYY-MM-DD): "); String d = sc.nextLine();
            Payment p;
            switch (m) {
                case "1":
                    System.out.print("Last 4 digits of card: "); String l4 = sc.nextLine();
                    p = payments.recordCardPayment(rid, loggedInCustomer.getId(), r.getTotalAmount(), d, l4); break;
                case "3":
                    System.out.print("Provider (PayHere/FriMi/Genie): "); String pr = sc.nextLine();
                    p = payments.recordOnlinePayment(rid, loggedInCustomer.getId(), r.getTotalAmount(), d, pr); break;
                default:
                    p = payments.recordCashPayment(rid, loggedInCustomer.getId(), r.getTotalAmount(), d);
            }
            System.out.println(p.generateInvoice());
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void viewMyPayments() {
        System.out.println("\n--- MY PAYMENT HISTORY ---");
        for (Payment p : payments.getByCustomer(loggedInCustomer.getId())) System.out.println(p);
    }
    private void listAllPayments() {
        System.out.println("\n--- ALL PAYMENTS ---");
        for (Payment p : payments.getAll()) System.out.println(p);
    }
    private void adminUpdatePayment() {
        try {
            System.out.print("Payment ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.print("New status: "); String s = sc.nextLine();
            System.out.println(payments.updateStatus(id, s) ? "✓ Updated." : "✗ Not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminViewInvoice() {
        try {
            System.out.print("Payment ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.println(payments.invoiceFor(id));
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    // ============ COMPONENT 05: ADMIN ============
    private void listAllAdmins() {
        System.out.println("\n--- ADMINS ---");
        for (AdminUser a : admins.getAll()) System.out.println(a);
    }
    private void adminAddAdmin() {
        if (!loggedInAdmin.canManageAdmins()) { System.out.println("✗ No permission."); return; }
        System.out.print("Username: "); String u = sc.nextLine();
        System.out.print("Password: "); String p = sc.nextLine();
        System.out.print("Name: "); String n = sc.nextLine();
        System.out.print("Email: "); String e = sc.nextLine();
        System.out.print("Phone: "); String ph = sc.nextLine();
        System.out.print("Permissions (FULL/MODERATOR/VIEWER): "); String perm = sc.nextLine();
        AdminUser a = admins.addAdmin(u, p, n, e, ph, perm);
        System.out.println(a == null ? "✗ Username taken." : "✓ Admin added: " + a);
    }
    private void adminDeleteAdmin() {
        try {
            System.out.print("Admin ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.println(admins.deleteAdmin(id) ? "✓ Deleted." : "✗ Not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    // ============ COMPONENT 06: REVIEWS ============
    private void submitReviewFlow() {
        try {
            System.out.print("Room number: "); int rn = Integer.parseInt(sc.nextLine());
            System.out.print("Rating (1-5): "); int rate = Integer.parseInt(sc.nextLine());
            System.out.print("Title: "); String t = sc.nextLine();
            System.out.print("Comment: "); String cm = sc.nextLine();
            String date = java.time.LocalDate.now().toString();
            // Look for a confirmed reservation by this customer in this room — if found, mark VERIFIED
            Reservation matched = null;
            for (Reservation r : reservations.getByCustomer(loggedInCustomer.getId())) {
                if (r.getRoomNumber() == rn && !r.getStatus().equals("CANCELLED")) { matched = r; break; }
            }
            Review review = (matched != null)
                    ? reviews.submitVerifiedReview(loggedInCustomer.getId(), rn, rate, t, cm, date, matched.getReservationId())
                    : reviews.submitPublicReview(loggedInCustomer.getId(), rn, rate, t, cm, date);
            System.out.println("✓ Review submitted (" + review.getType() + ").");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void listReviewsPublic() {
        System.out.println("\n--- GUEST REVIEWS ---");
        List<Review> list = reviews.getApproved();
        if (list.isEmpty()) System.out.println("(no approved reviews yet)");
        for (Review r : list) System.out.println(r.displayForCustomer() + "\n");
        System.out.printf("Average rating: %.1f / 5.0%n", reviews.averageRating());
    }
    private void listAllReviewsAdmin() {
        System.out.println("\n--- ALL REVIEWS (ADMIN VIEW) ---");
        for (Review r : reviews.getAll()) System.out.println(r.displayForAdmin());
    }
    private void adminApproveReview() {
        try {
            System.out.print("Review ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.print("Approve? (true/false): "); boolean ok = Boolean.parseBoolean(sc.nextLine());
            System.out.println(reviews.setApproval(id, ok) ? "✓ Updated." : "✗ Not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminDeleteReview() {
        try {
            System.out.print("Review ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.println(reviews.deleteReview(id) ? "✓ Deleted." : "✗ Not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    // ============ COMPONENT 07: SERVICES ============
    private void listServices() {
        System.out.println("\n--- AVAILABLE SERVICES ---");
        for (Service s : facilities.getAvailableServices()) System.out.println(s);
    }
    private void requestServiceFlow() {
        try {
            System.out.print("Reservation ID: "); int rid = Integer.parseInt(sc.nextLine());
            System.out.print("Service ID: "); int sid = Integer.parseInt(sc.nextLine());
            System.out.print("Quantity: "); int q = Integer.parseInt(sc.nextLine());
            CustomerServiceRequest cs = facilities.requestService(loggedInCustomer.getId(), rid, sid, q);
            System.out.println(cs == null ? "✗ Service unavailable." : "✓ Requested: " + cs);
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminAddService() {
        try {
            System.out.print("Name: "); String n = sc.nextLine();
            System.out.print("Price (LKR): "); double p = Double.parseDouble(sc.nextLine());
            System.out.print("Description: "); String d = sc.nextLine();
            System.out.print("Category (SPA/DINING/TRANSPORT/ROOM/OTHER): "); String cat = sc.nextLine();
            System.out.print("Tier (premium/basic): "); String tier = sc.nextLine();
            int id = facilities.getAllServices().stream().mapToInt(Service::getServiceId).max().orElse(0) + 1;
            Service s = tier.equalsIgnoreCase("premium")
                    ? new PremiumService(id, n, p, true, d, cat)
                    : new BasicService(id, n, p, true, d, cat);
            System.out.println(facilities.addService(s) ? "✓ Added: " + s : "✗ Failed.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminUpdateService() {
        try {
            System.out.print("Service ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.print("New price (blank=skip): "); String pr = sc.nextLine();
            System.out.print("Available? (true/false/blank): "); String av = sc.nextLine();
            System.out.print("New description (blank=skip): "); String d = sc.nextLine();
            System.out.println(facilities.updateService(id,
                    pr.isEmpty() ? null : Double.parseDouble(pr),
                    av.isEmpty() ? null : Boolean.parseBoolean(av),
                    d.isEmpty() ? null : d) ? "✓ Updated." : "✗ Not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
    private void adminDeleteService() {
        try {
            System.out.print("Service ID: "); int id = Integer.parseInt(sc.nextLine());
            System.out.println(facilities.deleteService(id) ? "✓ Deleted." : "✗ Not found.");
        } catch (Exception e) { System.out.println("✗ Invalid input."); }
    }
}