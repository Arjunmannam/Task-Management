package com.unify.platform.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    /**
     * GET /api/analytics/summary
     * Returns: { totalProjects, totalTasks, doneTasks, inProgressTasks, todoTasks,
     *            completionRate, tasksByProject: [...], tasksByPriority: {...} }
     */
    @GetMapping("/summary")
    public ResponseEntity<?> summary() {
        return ResponseEntity.ok(Map.of("message", "Analytics summary"));
    }

    /**
     * GET /api/analytics/projects/{id}
     * Per-project detailed stats
     */
    @GetMapping("/projects/{id}")
    public ResponseEntity<?> projectStats(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("message", "Project analytics"));
    }
}
