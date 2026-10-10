package com.nutrisphere.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {
    private final AuditLogRepository repo;

    @Async
    public void log(Long userId, String action, String entityType, Long entityId, String description) {
        log(userId, action, entityType, entityId, description, "127.0.0.1");
    }

    @Async
    public void log(Long userId, String action, String entityType, Long entityId, String description, String ipAddress) {
        try {
            AuditLog log = AuditLog.builder()
                .userId(userId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .build();
            repo.save(log);
        } catch (Exception e) {
            log.warn("Failed to save audit log: {}", e.getMessage());
        }
    }
}
