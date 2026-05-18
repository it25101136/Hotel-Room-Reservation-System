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
@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
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

    @PostMapping
    public Map<String, Object> createRoom(@RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Room created", "room", body);
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateRoom(@PathVariable int id, @RequestBody Map<String, Object> body) {
        return Map.of("success", true, "message", "Room updated", "id", id, "data", body);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteRoom(@PathVariable int id) {
        return Map.of("success", true, "message", "Room deleted", "id", id);
    }
}
