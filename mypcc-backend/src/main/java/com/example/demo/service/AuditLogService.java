package com.example.demo.service;

import com.example.demo.model.AuditLog;
import com.example.demo.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository repository;

    public List<AuditLog> getAllLogs() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public List<AuditLog> getLogsByUser(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public AuditLog logAction(String userId, String action, String details, HttpServletRequest request) {
        AuditLog log = new AuditLog();
        log.setId("c" + UUID.randomUUID().toString().substring(0, 24).replace("-", "")); // Mock CUID
        log.setUserId(userId);
        log.setAction(action);
        log.setDetails(details);
        if (request != null) {
            log.setIpAddress(request.getRemoteAddr());
            log.setUserAgent(request.getHeader("User-Agent"));
        }
        return repository.save(log);
    }
}
