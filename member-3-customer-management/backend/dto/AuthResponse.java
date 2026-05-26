package com.aurum.dto;
 // DTO (Data Transfer Object) used to send
 //authentication responses to the frontend
public class AuthResponse {
    private boolean success;// Indicates whether the request was successful
    private String message;
    private String name;
    private String email;
    private String role;
     //Required for Spring Boot and JSON conversion

    public AuthResponse() {}

     //Constructor used to create authentication responses
    public AuthResponse(boolean success, String message, String name, String email, String role) {
        this.success = success;
        this.message = message;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }// Sets request success status
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
