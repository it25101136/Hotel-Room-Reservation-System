package com.aurum.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Member 1 — Room Management REST API.
 *
 * Endpoints:
 *   GET    /api/rooms
 *   GET    /api/rooms/{id}
 *   POST   /api/rooms
 *   PUT    /api/rooms/{id}
 *   DELETE /api/rooms/{id}
 */
@RestController // Marks this class as a REST API controller (Dependency on Spring
@RequestMapping("/api/rooms") // Base URL mapping
@CrossOrigin(origins = "*") // Allows frontend (any origin) to access backend (Dependency)
public class RoomController {

    @GetMapping
    public List<Map<String, Object>> getAllRooms() {
        return List.of(
            Map.of("id", 101, "type", "Deluxe", "price", 150000, "available", true),
            Map.of("id", 201, "type", "Suite",  "price", 280000, "available", true),
            Map.of("id", 301, "type", "Suite",  "price", 850000, "available", true)
        );
    }

    @GetMapping("/{id}")
    public Map<String, Object> getRoom(@PathVariable int id) {
        return Map.of("id", id, "type", "Deluxe", "price", 150000, "available", true);
    }

/**
 * ===============================
 * METHOD: getRoom(int id)
 * ===============================
 *
 *  DEPENDENCY:
 *    - Uses @PathVariable to receive data from URL.
 *    - Depends on Spring MVC to inject the
 value automatically.
 *
 *  REST PRINCIPLE:
 *    - Fetches a single resource using ID.
 */


@PostMapping
    public Map<String, Object> createRoom(@RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Room created", "room", body);
    }

/**
 * ===============================
 * METHOD: createRoom()
 * ===============================
 *
 *  DEPENDENCY:
 *    - Uses @RequestBody → Spring automatically converts JSON → Java Map.
 *
 *  DATA HANDLING:
 *    - Accepts dynamic input using Map (flexible structure).
 */

 @PutMapping("/{id}")
    public Map<String, Object> updateRoom(@PathVariable int id, @RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Room updated", "id", id, "data", body);
    }

/**
 * ===============================
 * METHOD: updateRoom()
 * ===============================
 *
 * ✅ DEPENDENCY:
 *    - Uses both @PathVariable and @RequestBody.
 *
 * ✅ FUNCTION:
 *    - Updates existing resource using ID.
 *
 * ✅ DESIGN:
 *    - Combines URL
 input + request body data.
 */

@DeleteMapping("/{id}")
    public Map<String, Object> deleteRoom(@PathVariable int id) {
        return Map.of("success", true, "message", "Room deleted", "id", id);
    }
}

/**
 * ===============================
 * METHOD: deleteRoom()
 * ===============================
 *
 * ✅ DEPENDENCY:
 *    - Uses @DeleteMapping annotation.
 *
 * ✅ FUNCTION:
 *    - Deletes resource using ID.
 */

