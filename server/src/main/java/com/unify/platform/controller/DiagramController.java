package com.unify.platform.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/projects/{projectId}/diagrams")
@CrossOrigin(origins = "http://localhost:3000")
public class DiagramController {

    @GetMapping
    public ResponseEntity<?> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<?> create(@PathVariable Long projectId, @RequestBody Map<String, Object> body) {
        return ResponseEntity.status(201).body(Map.of("message", "Diagram created"));
    }

    /** PUT  – saves shapesJson */
    @PutMapping("/{diagramId}")
    public ResponseEntity<?> save(@PathVariable Long projectId, @PathVariable Long diagramId,
                                  @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("message", "Saved"));
    }

    @DeleteMapping("/{diagramId}")
    public ResponseEntity<?> delete(@PathVariable Long projectId, @PathVariable Long diagramId) {
        return ResponseEntity.noContent().build();
    }
}
