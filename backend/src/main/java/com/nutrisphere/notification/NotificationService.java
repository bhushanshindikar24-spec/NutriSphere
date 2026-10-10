package com.nutrisphere.notification;

import com.nutrisphere.notification.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository repo;

    @Async
    public void send(Long userId, NotificationType type, String title, String message) {
        send(userId, type, title, message, null, null);
    }

    @Async
    public void send(Long userId, NotificationType type, String title, String message,
                     String refType, Long refId) {
        Notification n = Notification.builder()
            .userId(userId).type(type).title(title).message(message)
            .referenceType(refType).referenceId(refId).build();
        repo.save(n);
    }

    @Async
    public void createNotification(Long userId, String typeStr, String title, String message, Long refId) {
        NotificationType type;
        try {
            type = NotificationType.valueOf(typeStr.toUpperCase());
        } catch (Exception e) {
            type = NotificationType.GENERAL;
        }
        send(userId, type, title, message, typeStr, refId);
    }

    public Page<NotificationResponse> getNotifications(Long userId, int page, int size) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size))
            .map(this::toResponse);
    }

    public long getUnreadCount(Long userId) {
        return repo.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markRead(Long notifId, Long userId) {
        repo.findById(notifId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                n.setRead(true);
                repo.save(n);
            }
        });
    }

    @Transactional
    public void markAllRead(Long userId) {
        repo.markAllReadForUser(userId);
    }

    @Transactional
    public void deleteNotification(Long notifId, Long userId) {
        repo.findById(notifId).ifPresent(n -> {
            if (n.getUserId().equals(userId)) {
                repo.delete(n);
            }
        });
    }

    private NotificationResponse toResponse(Notification n) {
        NotificationResponse r = new NotificationResponse();
        r.setId(n.getId());
        r.setType(n.getType());
        r.setTitle(n.getTitle());
        r.setMessage(n.getMessage());
        r.setRead(n.isRead());
        r.setReferenceType(n.getReferenceType());
        r.setReferenceId(n.getReferenceId());
        r.setCreatedAt(n.getCreatedAt());
        return r;
    }
}
