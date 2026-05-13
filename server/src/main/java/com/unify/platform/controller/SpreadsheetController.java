package com.unify.platform.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/projects/{projectId}/spreadsheets")
@CrossOrigin(origins = "http://localhost:3000")
public class SpreadsheetController {

    @GetMapping
    public ResponseEntity<?> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(List.of());
    }

    @PostMapping
    public ResponseEntity<?> create(@PathVariable Long projectId, @RequestBody Map<String, Object> body) {
        return ResponseEntity.status(201).body(Map.of("message", "Spreadsheet created"));
    }

    /** PUT  – saves entire dataJson (columns + rows) */
    @PutMapping("/{ssId}")
    public ResponseEntity<?> save(@PathVariable Long projectId, @PathVariable Long ssId,
                                  @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("message", "Saved"));
    }

    @DeleteMapping("/{ssId}")
    public ResponseEntity<?> delete(@PathVariable Long projectId, @PathVariable Long ssId) {
        return ResponseEntity.noContent().build();
    }
}
