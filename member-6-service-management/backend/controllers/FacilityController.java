package com.aurum.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Member 6 — Service & Facility REST API.
 *
 * Endpoints:
 *   GET    /api/services
 *   POST   /api/services
 *   PUT    /api/services/{id}
 *   DELETE /api/services/{id}
 *   POST   /api/services/{id}/request
 */
@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class FacilityController {

    @GetMapping
    public List<Map<String, Object>> getAllServices() {
        return List.of(
            Map.of("id", 1, "name", "Royal Gold Facial",   "price", 105000, "tier", "PREMIUM"),
            Map.of("id", 6, "name", "Breakfast Buffet",    "price",  12000, "tier", "BASIC"),
            Map.of("id", 7, "name", "Airport Pickup",      "price",  18000, "tier", "BASIC")
        );
    }

    @PostMapping
    public Map<String, Object> addService(@RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Service added", "service", body);
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateService(@PathVariable int id, @RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Service updated", "id", id);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteService(@PathVariable int id) {
        return Map.of("success", true, "message", "Service deleted", "id", id);
    }

    @PostMapping("/{id}/request")
    public Map<String, Object> requestService(@PathVariable int id, @RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Service request created", "id", id, "details", body);
    }
}
