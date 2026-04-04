package com.example.demo.controller;

import com.example.demo.model.AuditLog;
import com.example.demo.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AuditLogController {

    @Autowired
    private AuditLogService service;

    @GetMapping
    public List<AuditLog> getAllLogs() {
        return service.getAllLogs();
    }

    @GetMapping("/user/{userId}")
    public List<AuditLog> getLogsByUser(@PathVariable String userId) {
        return service.getLogsByUser(userId);
    }

    @PostMapping
    public AuditLog createLog(@RequestBody AuditLogRequest req, HttpServletRequest request) {
        return service.logAction(req.userId, req.action, req.details, request);
    }

    public static class AuditLogRequest {
        public String userId;
        public String action;
        public String details;
    }
}
