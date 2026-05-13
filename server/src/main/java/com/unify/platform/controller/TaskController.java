package com.unify.platform.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    /** GET /api/projects/{projectId}/tasks  →  All tasks for project */
    @GetMapping
    public ResponseEntity<?> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(List.of());
    }

    /**
     * POST /api/projects/{projectId}/tasks
     * Body: { title, description, priority, deadline, assigneeId }
     */
    @PostMapping
    public ResponseEntity<?> create(@PathVariable Long projectId, @RequestBody Map<String, Object> body) {
        return ResponseEntity.status(201).body(Map.of("message", "Task created"));
    }

    /**
     * PUT /api/projects/{projectId}/tasks/{taskId}
     * Body: { title?, description?, status?, priority?, deadline?, assigneeId? }
     */
    @PutMapping("/{taskId}")
    public ResponseEntity<?> update(@PathVariable Long projectId, @PathVariable Long taskId,
                                    @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of("message", "Task updated"));
    }

    /**
     * PATCH /api/projects/{projectId}/tasks/{taskId}/status
     * Body: { status: "TODO" | "IN_PROGRESS" | "DONE" }
     */
    @PatchMapping("/{taskId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long projectId, @PathVariable Long taskId,
                                          @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }

    /** DELETE /api/projects/{projectId}/tasks/{taskId}  */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> delete(@PathVariable Long projectId, @PathVariable Long taskId) {
        return ResponseEntity.noContent().build();
    }
}
