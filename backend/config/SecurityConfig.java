package com.aurum.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Member 5 — Security configuration for the entire Aurum backend.
 * This class defines the security rules for all API endpoints.
 * It controls which routes are public and which require authentication.
 */
@Configuration
public class SecurityConfig {

    /**
     * Configures Spring Security filter chain.
     * This method defines how HTTP requests are secured.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF protection because this is a stateless REST API
                // (commonly disabled when using JWT or frontend-backend separation)
                .csrf(csrf -> csrf.disable())

                // Define authorization rules for different API endpoints
                .authorizeHttpRequests(auth -> auth

                        // Publicly accessible authentication endpoints (login, register, etc.)
                        .requestMatchers("/api/auth/**").permitAll()

                        // Room-related endpoints are publicly accessible
                        .requestMatchers("/api/rooms/**").permitAll()

                        // Reservation endpoints are publicly accessible
                        .requestMatchers("/api/reservations/**").permitAll()

                        // Payment endpoints are publicly accessible
                        .requestMatchers("/api/payments/**").permitAll()

                        // Review endpoints are publicly accessible
                        .requestMatchers("/api/reviews/**").permitAll()

                        // Service-related endpoints are publicly accessible
                        .requestMatchers("/api/services/**").permitAll()

                        // Customer-related endpoints are publicly accessible
                        .requestMatchers("/api/customers/**").permitAll()

                        // Admin endpoints are also currently publicly accessible
                        // (can later be restricted to ADMIN role only)
                        .requestMatchers("/api/admins/**").permitAll()

                        // Any other request not listed above requires authentication
                        .anyRequest().authenticated()
                )

                // Disable default form-based login (not used in REST APIs)
                .formLogin(login -> login.disable())

                // Disable HTTP Basic authentication (not used in this setup)
                .httpBasic(basic -> basic.disable());

        // Build and return the security filter chain
        return http.build();
    }
}