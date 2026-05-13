package com.unify.platform.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;

@RestController
@RequestMapping("/api/projects/{projectId}/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    @GetMapping
    public ResponseEntity<?> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(List.of());
    }

    /**
     * POST /api/projects/{projectId}/files
     * Content-Type: multipart/form-data
     * Part: file (binary)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@PathVariable Long projectId,
                                    @RequestParam("file") MultipartFile file) {
        // 1. Validate file type (PDF, PPTX, DOCX, XLSX)
        // 2. Generate UUID filename
        // 3. Save to ./uploads/ directory
        // 4. Persist metadata to DB
        return ResponseEntity.status(201).body(Map.of("message", "File uploaded"));
    }

    /**
     * GET /api/projects/{projectId}/files/{fileId}/download
     * Returns: file bytes as octet-stream
     */
    @GetMapping("/{fileId}/download")
    public ResponseEntity<?> download(@PathVariable Long projectId, @PathVariable Long fileId) {
        // Load file from disk, set Content-Disposition header
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<?> delete(@PathVariable Long projectId, @PathVariable Long fileId) {
        return ResponseEntity.noContent().build();
    }
}
