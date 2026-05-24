package models;

/**
 * Component 03 & 05: Base User class
 * Parent for Customer and AdminUser (Inheritance)
 */
public abstract class User {
    private int id;
    private String username;
    private String password;
    private String name;
    private String email;
    private String phone;     // Sri Lankan format: +94 XX XXX XXXX
    private String role;      // CUSTOMER or ADMIN

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

    // Encapsulation
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

    /** Authenticate by comparing password */
    public boolean authenticate(String username, String password) {
        return this.username.equals(username) && this.password.equals(password);
    }
}
