package com.aurum.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Member 3 — Customer Management REST API.
 *
 * Endpoints:
 *   GET    /api/customers
 *   PUT    /api/customers/{id}
 *   PUT    /api/customers/{id}/vip
 *   DELETE /api/customers/{id}
 */
@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")// Allows requests from any frontend application
public class CustomerController {
    // Returns a sample list of customers.
    @GetMapping
    public List<Map<String, Object>> getAllCustomers() {
        return List.of(
            Map.of("id", 1, "name", "Amal Perera",   "email", "amal@example.lk",   "type", "REGULAR"),
            Map.of("id", 2, "name", "Nimali Silva",  "email", "nimali@example.lk", "type", "VIP")
        );
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateCustomer(@PathVariable int id, @RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Customer updated", "id", id);
    }

    @PutMapping("/{id}/vip")
    public Map<String, Object> upgradeVIP(@PathVariable int id) {
        return Map.of("success", true, "message", "Customer upgraded to VIP", "id", id); // Return update success response
    }
    //Deletes a customer using customer ID.
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteCustomer(@PathVariable int id) {
        return Map.of("success", true, "message", "Customer deleted", "id", id);
    }
}
