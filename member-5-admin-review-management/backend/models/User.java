package models;

/**
 * Shared base User model for Member 5 standalone compilation.
 *
 * This is the parent class for all user types in the system (Admin, Customer, etc.).
 *
 * Demonstrates OOP concepts:
 * - Encapsulation (private fields with getters/setters)
 * - Inheritance (extended by other user types)
 * - Abstraction (used as a base model, not directly instantiated in most cases)
 */
public abstract class User {

    // Unique ID for each user
    private int id;

    // Username used for login
    private String username;

    // Password used for authentication
    private String password;

    // Full name of the user
    private String name;

    // Email address of the user
    private String email;

    // Phone number of the user
    private String phone;

    // Role of the user (ADMIN, CUSTOMER, etc.)
    private String role;

    /**
     * Constructor to initialize all user attributes.
     */
    public User(int id, String username, String password, String name,
                String email, String phone, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }

    // Getter and Setter methods (Encapsulation)

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    /**
     * Simple authentication method.
     * Checks if provided username and password match stored values.
     */
    public boolean authenticate(String username, String password) {
        return this.username.equals(username) && this.password.equals(password);
    }
}