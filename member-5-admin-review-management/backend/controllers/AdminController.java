package com.aurum.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Member 5 — Admin Management REST API.
 *
 * Endpoints:
 *   GET    /api/admins
 *   POST   /api/admins
 *   PUT    /api/admins/{id}/permissions
 *   DELETE /api/admins/{id}
 */
@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
public class AdminController {

    @GetMapping
    public List<Map<String, Object>> getAllAdmins() {
        return List.of(
            Map.of("id", 1, "name", "System Administrator", "permissions", "FULL"),
            Map.of("id", 2, "name", "Sandali Wickrama",     "permissions", "MODERATOR")
        );
    }

    @PostMapping
    public Map<String, Object> addAdmin(@RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Admin added", "admin", body);
    }

    @PutMapping("/{id}/permissions")
    public Map<String, Object> updatePermissions(@PathVariable int id, @RequestBody Map<String, String> body) {
        return Map.of("success", true, "message", "Permissions updated", "id", id);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> removeAdmin(@PathVariable int id) {
        return Map.of("success", true, "message", "Admin removed", "id", id);
    }
}
