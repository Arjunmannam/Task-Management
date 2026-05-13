package com.unify.platform.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    /** GET /api/projects  →  List all projects for current user */
    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(List.of());
    }

    /** POST /api/projects  →  Create project */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(201).body(Map.of("message", "Created"));
    }

    /** GET /api/projects/{id}  →  Get project detail */
    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("id", id));
    }

    /** PUT /api/projects/{id}  →  Update project */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("message", "Updated"));
    }

    /** DELETE /api/projects/{id}  →  Delete project */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }

    /** POST /api/projects/{id}/members  →  Add member to project */
    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        return ResponseEntity.ok(Map.of("message", "Member added"));
    }
}
