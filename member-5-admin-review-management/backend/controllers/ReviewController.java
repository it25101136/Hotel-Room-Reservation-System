package com.aurum.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Member 5 — Review Management REST API.
 *
 * Endpoints:
 *   GET    /api/reviews
 *   POST   /api/reviews
 *   PUT    /api/reviews/{id}/approve
 *   PUT    /api/reviews/{id}/reject
 *   DELETE /api/reviews/{id}
 */
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @GetMapping
    public List<Map<String, Object>> getAllReviews() {
        return List.of(
            Map.of("id", 1, "rating", 5, "title", "Absolutely stunning!", "approved", true,  "type", "VERIFIED"),
            Map.of("id", 2, "rating", 4, "title", "Royal treatment",      "approved", false, "type", "PUBLIC")
        );
    }

    @PostMapping
    public Map<String, Object> submitReview(@RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Review submitted", "review", body);
    }

    @PutMapping("/{id}/approve")
    public Map<String, Object> approveReview(@PathVariable int id) {
        return Map.of("success", true, "message", "Review approved", "id", id);
    }

    @PutMapping("/{id}/reject")
    public Map<String, Object> rejectReview(@PathVariable int id) {
        return Map.of("success", true, "message", "Review rejected", "id", id);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteReview(@PathVariable int id) {
        return Map.of("success", true, "message", "Review deleted", "id", id);
    }
}
