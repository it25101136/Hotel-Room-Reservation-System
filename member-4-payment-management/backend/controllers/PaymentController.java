package com.aurum.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Member 4 — Payment & Billing REST API.
 *
 * Endpoints:
 *   GET  /api/payments
 *   POST /api/payments
 *   PUT  /api/payments/{id}/status
 *   GET  /api/payments/{id}/invoice
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    //Read all payment records
    @GetMapping
    public List<Map<String, Object>> getAllPayments() {
        return List.of(
            Map.of("id", 5001, "amount", 165000,  "method", "CARD",   "status", "COMPLETED"),
            Map.of("id", 5002, "amount", 1344000, "method", "ONLINE", "status", "COMPLETED")
        );
    }
//create new payment record
    @PostMapping
    public Map<String, Object> recordPayment(@RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Payment recorded", "payment", body);
    }

    //Update payment status
    @PutMapping("/{id}/status")
    public Map<String, Object> updateStatus(@PathVariable int id, @RequestBody Map<String, String> body) {
        return Map.of("success", true, "message", "Payment status updated", "id", id, "newStatus", body.get("status"));
    }

    //Generate invoice details
    @GetMapping("/{id}/invoice")
    public Map<String, Object> getInvoice(@PathVariable int id) {
        return Map.of("paymentId", id, "hotel", "Aurum Hotel", "address", "Galle Face, Colombo 003");
    }
}
