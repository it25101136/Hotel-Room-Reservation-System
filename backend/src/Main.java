import ui.MainMenu;

/**
 * Aurum Hotel Management System — Backend Entry Point
 * Galle Face, Colombo, Sri Lanka
 *
 * Components:
 *   01. Room Management         (Binary Search Tree)
 *   02. Reservation Management  (Quick Sort)
 *   03. Customer Management
 *   04. Payment & Billing
 *   05. Admin Management
 *   06. Review Management
 *   07. Service & Facility Management
 *
 * To compile:  javac -d out src/**\/*.java src/Main.java
 * To run:      java -cp out Main
 *
 * Default admin login:  admin / admin123
 */
public class Main {
    public static void main(String[] args) {
        new MainMenu().start();
    }
}
