package com.nutrisphere.audit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditServiceTest {

    @Mock
    private AuditLogRepository repo;

    private AuditService service;

    @BeforeEach
    void setUp() {
        service = new AuditService(repo);
    }

    @Test
    void log_WithDefaultIp() {
        service.log(10L, "LOGIN", "USER", 10L, "User logged in");

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(repo).save(captor.capture());

        AuditLog log = captor.getValue();
        assertEquals(10L, log.getUserId());
        assertEquals("LOGIN", log.getAction());
        assertEquals("USER", log.getEntityType());
        assertEquals("127.0.0.1", log.getIpAddress());
    }

    @Test
    void log_WithExplicitIp() {
        service.log(10L, "UPDATE", "USER", 10L, "Profile updated", "192.168.1.100");

        ArgumentCaptor<AuditLog> captor = ArgumentCaptor.forClass(AuditLog.class);
        verify(repo).save(captor.capture());

        AuditLog log = captor.getValue();
        assertEquals("192.168.1.100", log.getIpAddress());
    }

    @Test
    void log_HandlesRepositoryExceptionGracefully() {
        doThrow(new RuntimeException("DB Connection down")).when(repo).save(any());
        assertDoesNotThrow(() -> service.log(10L, "ACTION", "ENTITY", 1L, "Desc"));
    }
}
