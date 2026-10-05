package com.nutrisphere.notification;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.notification.dto.NotificationResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/notifications") @RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ApiResponse<Page<NotificationResponse>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(notificationService.getNotifications(securityUtils.getCurrentUserId(), page, size));
    }

    @GetMapping("/unread-count")
    public ApiResponse<Long> getUnreadCount() {
        return ApiResponse.success(notificationService.getUnreadCount(securityUtils.getCurrentUserId()));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<Void> markRead(@PathVariable Long id) {
        notificationService.markRead(id, securityUtils.getCurrentUserId());
        return ApiResponse.success("Marked as read", null);
    }

    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllRead() {
        notificationService.markAllRead(securityUtils.getCurrentUserId());
        return ApiResponse.success("All marked as read", null);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id, securityUtils.getCurrentUserId());
        return ApiResponse.success("Notification deleted", null);
    }
}
