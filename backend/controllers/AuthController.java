package com.aurum.controller;

import com.aurum.dto.AuthResponse;
import com.aurum.dto.LoginRequest;
import com.aurum.dto.RegisterRequest;
import org.springframework.web.bind.annotation.*;

/**
 * Member 3 — Authentication API (Login + Register).
 *
 * Endpoints:
 *   POST /api/auth/login
 *   POST /api/auth/register
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        if ("admin@aurumhotel.lk".equalsIgnoreCase(request.getEmail())
                && "admin123".equals(request.getPassword())) {
            return new AuthResponse(true, "Welcome, Admin!", "System Administrator", request.getEmail(), "admin");
        }

        // Auto-create a guest account for any other email/password (matches frontend behavior)
        String name = request.getEmail().split("@")[0];
        return new AuthResponse(true, "Welcome to Aurum!", name, request.getEmail(), "guest");
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return new AuthResponse(true, "Registration successful.", request.getName(), request.getEmail(), "guest");
    }
}
