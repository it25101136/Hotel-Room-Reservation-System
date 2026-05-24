package com.aurum.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Member 5 — Admin Management REST API.
 *
 * This controller handles CRUD operations related to Admin users.
 * It provides endpoints to view, add, update, and delete admins.
 *
 * Base URL: /api/admins
 */
@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*") // Allows frontend apps from any domain to access this API

public class AdminController {

    /**
     * GET /api/admins
     * Returns a list of all admins.
     * Currently returns mock/static data for demonstration purposes.
     */
    @GetMapping
    public List<Map<String, Object>> getAllAdmins() {
        return List.of(
                Map.of("id", 1, "name", "System Administrator", "permissions", "FULL"),
                Map.of("id", 2, "name", "Sandali Wickrama",     "permissions", "MODERATOR")
        );
    }

    /**
     * POST /api/admins
     * Adds a new admin.
     * Accepts request body as JSON and returns success response.
     */
    @PostMapping
    public Map<String, Object> addAdmin(@RequestBody Map<String, Object> body) {
        return Map.of(
                "success", true,
                "message", "Admin added",
                "admin", body
        );
    }

    /**
     * PUT /api/admins/{id}/permissions
     * Updates permissions of an existing admin by ID.
     */
    @PutMapping("/{id}/permissions")
    public Map<String, Object> updatePermissions(
            @PathVariable int id,
            @RequestBody Map<String, String> body) {

        return Map.of(
                "success", true,
                "message", "Permissions updated",
                "id", id
        );
    }

    /**
     * DELETE /api/admins/{id}
     * Removes an admin by ID.
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> removeAdmin(@PathVariable int id) {
        return Map.of(
                "success", true,
                "message", "Admin removed",
                "id", id
        );
    }
}