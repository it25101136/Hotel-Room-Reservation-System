package com.aurum.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Member 2 — Reservation Management REST API.
 *
 * Endpoints:
 *   GET    /api/reservations
 *   POST   /api/reservations
 *   PUT    /api/reservations/{id}
 *   DELETE /api/reservations/{id}
 */
@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    @GetMapping
    public List<Map<String, Object>> getAllReservations() {
        return List.of(
            Map.of("id", 1001, "customerId", 1, "roomNumber", 101, "checkIn", "2026-01-15", "checkOut", "2026-01-18", "status", "CONFIRMED"),
            Map.of("id", 1002, "customerId", 2, "roomNumber", 201, "checkIn", "2026-02-10", "checkOut", "2026-02-14", "status", "CONFIRMED")
        );
    }

    @PostMapping
    public Map<String, Object> createReservation(@RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Reservation created", "reservation", body);
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateReservation(@PathVariable int id, @RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Reservation updated", "id", id);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> cancelReservation(@PathVariable int id) {
        return Map.of("success", true, "message", "Reservation cancelled", "id", id);
    }
}
