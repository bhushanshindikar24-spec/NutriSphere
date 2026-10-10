package com.nutrisphere.notification.dto;
import com.nutrisphere.notification.NotificationType;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class NotificationResponse {
    private Long id;
    private NotificationType type;
    private String title;
    private String message;
    private boolean read;
    private String referenceType;
    private Long referenceId;
    private LocalDateTime createdAt;
}
