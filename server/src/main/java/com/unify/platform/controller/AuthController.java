package com.unify.platform.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    /**
     * POST /api/auth/register
     * Body: { fullName, email, password }
     * Returns: { token, user: { id, fullName, email, role } }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        // 1. Validate input
        // 2. Check email uniqueness
        // 3. Hash password (BCrypt)
        // 4. Save user
        // 5. Generate JWT
        // 6. Return token + user DTO
        return ResponseEntity.ok(Map.of("message", "User registered"));
    }

    /**
     * POST /api/auth/login
     * Body: { email, password }
     * Returns: { token, user: { id, fullName, email, role } }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        // 1. Load user by email
        // 2. Verify password
        // 3. Generate JWT
        // 4. Return token + user DTO
        return ResponseEntity.ok(Map.of("message", "Login successful"));
    }

    /**
     * GET /api/auth/me
     * Header: Authorization: Bearer <token>
     * Returns: { id, fullName, email, role }
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        return ResponseEntity.ok(Map.of("message", "Current user"));
    }
}
