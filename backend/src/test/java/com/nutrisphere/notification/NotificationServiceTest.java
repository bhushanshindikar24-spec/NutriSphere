package com.nutrisphere.notification;

import com.nutrisphere.notification.dto.NotificationResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository repo;

    private NotificationService service;

    @BeforeEach
    void setUp() {
        service = new NotificationService(repo);
    }

    @Test
    void send_SavesNotification() {
        service.send(10L, NotificationType.DIET_PLAN_APPROVED, "Approved", "Plan ready");
        verify(repo).save(any(Notification.class));
    }

    @Test
    void createNotification_ParsesTypeAndSaves() {
        service.createNotification(10L, "ORDER_UPDATE", "Order Update", "Preparing", 50L);
        verify(repo).save(any(Notification.class));

        // Invalid type string falls back to GENERAL
        service.createNotification(10L, "UNKNOWN_CUSTOM_TYPE", "Title", "Msg", null);
        verify(repo, times(2)).save(any(Notification.class));
    }

    @Test
    void getNotifications_ReturnsPagedResponses() {
        Notification n = Notification.builder().title("Reminder").build();
        n.setId(1L);

        when(repo.findByUserIdOrderByCreatedAtDesc(eq(10L), any(PageRequest.class)))
            .thenReturn(new PageImpl<>(List.of(n)));

        Page<NotificationResponse> page = service.getNotifications(10L, 0, 10);
        assertEquals(1, page.getTotalElements());
        assertEquals("Reminder", page.getContent().get(0).getTitle());
    }

    @Test
    void markRead_ValidatesOwnership() {
        Notification n = Notification.builder().userId(10L).read(false).build();
        when(repo.findById(1L)).thenReturn(Optional.of(n));

        service.markRead(1L, 10L);
        assertTrue(n.isRead());
        verify(repo).save(n);

        // Not owner -> doesn't mark read
        Notification n2 = Notification.builder().userId(99L).read(false).build();
        when(repo.findById(2L)).thenReturn(Optional.of(n2));
        service.markRead(2L, 10L);
        assertFalse(n2.isRead());
    }

    @Test
    void markAllRead_CallsRepo() {
        service.markAllRead(10L);
        verify(repo).markAllReadForUser(10L);
    }

    @Test
    void deleteNotification_ValidatesOwnership() {
        Notification n = Notification.builder().userId(10L).build();
        when(repo.findById(1L)).thenReturn(Optional.of(n));

        service.deleteNotification(1L, 10L);
        verify(repo).delete(n);
    }
}
