package com.unify.platform.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/projects/{projectId}/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {

    @GetMapping
    public ResponseEntity<?> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<?> create(@PathVariable Long projectId, @RequestBody Map<String, String> body) {
        return ResponseEntity.status(201).body(Map.of("message", "Note created"));
    }

    /** PUT /api/projects/{projectId}/notes/{noteId} — autosave endpoint */
    @PutMapping("/{noteId}")
    public ResponseEntity<?> update(@PathVariable Long projectId, @PathVariable Long noteId,
                                    @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Note saved"));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> delete(@PathVariable Long projectId, @PathVariable Long noteId) {
        return ResponseEntity.noContent().build();
    }
}
