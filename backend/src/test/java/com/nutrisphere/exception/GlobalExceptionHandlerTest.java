package com.nutrisphere.exception;

import com.nutrisphere.common.ErrorResponse;
import com.nutrisphere.integrations.ai.AIProviderException;
import com.nutrisphere.notification.EmailDeliveryException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    void handleNotFound() {
        ErrorResponse res = handler.handleNotFound(new ResourceNotFoundException("User", 1L));
        assertEquals(404, res.getStatus());
        assertEquals("Not Found", res.getError());
    }

    @Test
    void handleBadRequest() {
        ErrorResponse res = handler.handleBadRequest(new BadRequestException("Invalid input"));
        assertEquals(400, res.getStatus());
        assertEquals("Invalid input", res.getMessage());
    }

    @Test
    void handleDuplicate() {
        ErrorResponse res = handler.handleDuplicate(new DuplicateResourceException("Email exists"));
        assertEquals(409, res.getStatus());
        assertEquals("Conflict", res.getError());
    }

    @Test
    void handleUnauthorizedAndBadCredentials() {
        ErrorResponse res1 = handler.handleUnauthorized(new UnauthorizedException("Token invalid"));
        assertEquals(401, res1.getStatus());

        ErrorResponse res2 = handler.handleBadCredentials(new BadCredentialsException("Bad creds"));
        assertEquals(401, res2.getStatus());
    }

    @Test
    void handleForbiddenAndAccessDenied() {
        ErrorResponse res1 = handler.handleForbidden(new ForbiddenException("No access"));
        assertEquals(403, res1.getStatus());

        ErrorResponse res2 = handler.handleAccessDenied(new AccessDeniedException("Access denied"));
        assertEquals(403, res2.getStatus());
    }

    @Test
    void handleDisabled() {
        ErrorResponse res = handler.handleDisabled(new DisabledException("Disabled"));
        assertEquals(403, res.getStatus());
        assertEquals("Email verification required", res.getError());
    }

    @Test
    void handleValidation() {
        ValidationException ex = new ValidationException(List.of("Field1 is required", "Field2 is invalid"));
        ErrorResponse res = handler.handleValidation(ex);
        assertEquals(422, res.getStatus());
        assertEquals(2, res.getDetails().size());
    }

    @Test
    void handleMaxUpload() {
        ErrorResponse res = handler.handleMaxUpload(new MaxUploadSizeExceededException(1000L));
        assertEquals(413, res.getStatus());
    }

    @Test
    void handleFileStorage() {
        ErrorResponse res = handler.handleFileStorage(new FileStorageException("Disk full"));
        assertEquals(500, res.getStatus());
    }

    @Test
    void handleRateLimit() {
        ErrorResponse res = handler.handleRateLimit(new RateLimitException("Too fast"));
        assertEquals(429, res.getStatus());
    }

    @Test
    void handleServiceUnavailableExceptions() {
        ErrorResponse aiRes = handler.handleAIProvider(new AIProviderException("AI down"));
        assertEquals(503, aiRes.getStatus());

        ErrorResponse emailRes = handler.handleEmailDelivery(new EmailDeliveryException("SMTP down", new RuntimeException()));
        assertEquals(503, emailRes.getStatus());
    }

    @Test
    void handleGeneralException() {
        ErrorResponse res = handler.handleGeneral(new RuntimeException("Crash"));
        assertEquals(500, res.getStatus());
        assertEquals("Internal Server Error", res.getError());
    }
}
