package com.aurum.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Member 5 — Review Management REST API.
 *
 * This controller handles all review-related operations such as:
 * viewing reviews, submitting reviews, approving, rejecting, and deleting reviews.
 *
 * Base URL: /api/reviews
 */
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*") // Allows frontend applications to access this API from any origin

public class ReviewController {

    /**
     * GET /api/reviews
     * Returns all reviews in the system.
     * Currently returns mock data for testing purposes.
     */
    @GetMapping
    public List<Map<String, Object>> getAllReviews() {
        return List.of(
                Map.of("id", 1, "rating", 5, "title", "Absolutely stunning!", "approved", true,  "type", "VERIFIED"),
                Map.of("id", 2, "rating", 4, "title", "Royal treatment",      "approved", false, "type", "PUBLIC")
        );
    }

    /**
     * POST /api/reviews
     * Submits a new review.
     * Request body contains review details in JSON format.
     */
    @PostMapping
    public Map<String, Object> submitReview(@RequestBody Map<String, Object> body) {
        return Map.of(
                "success", true,
                "message", "Review submitted",
                "review", body
        );
    }

    /**
     * PUT /api/reviews/{id}/approve
     * Approves a review by its ID.
     * Typically used by admin/moderator users.
     */
    @PutMapping("/{id}/approve")
    public Map<String, Object> approveReview(@PathVariable int id) {
        return Map.of(
                "success", true,
                "message", "Review approved",
                "id", id
        );
    }

    /**
     * PUT /api/reviews/{id}/reject
     * Rejects a review by its ID.
     * Used when a review is inappropriate or invalid.
     */
    @PutMapping("/{id}/reject")
    public Map<String, Object> rejectReview(@PathVariable int id) {
        return Map.of(
                "success", true,
                "message", "Review rejected",
                "id", id
        );
    }

    /**
     * DELETE /api/reviews/{id}
     * Deletes a review permanently from the system.
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteReview(@PathVariable int id) {
        return Map.of(
                "success", true,
                "message", "Review deleted",
                "id", id
        );
    }
}