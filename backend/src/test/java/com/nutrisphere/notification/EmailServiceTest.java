package com.nutrisphere.notification;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private EmailService service;

    @BeforeEach
    void setUp() {
        service = new EmailService(mailSender);
        ReflectionTestUtils.setField(service, "from", "no-reply@nutrisphere.com");
        ReflectionTestUtils.setField(service, "verificationUrl", "http://localhost:5173/verify-email");
        ReflectionTestUtils.setField(service, "passwordResetUrl", "http://localhost:5173/reset-password");
    }

    @Test
    void sendVerificationEmail_Success() {
        service.sendVerificationEmail("test@example.com", "Alice", "tok123");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage msg = captor.getValue();
        assertEquals("test@example.com", msg.getTo()[0]);
        assertEquals("Verify your NutriSphere email", msg.getSubject());
        assertTrue(msg.getText().contains("http://localhost:5173/verify-email?token=tok123"));
    }

    @Test
    void sendPasswordResetEmail_Success() {
        service.sendPasswordResetEmail("user@example.com", "Bob", "rst456");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage msg = captor.getValue();
        assertEquals("user@example.com", msg.getTo()[0]);
        assertEquals("Reset your NutriSphere password", msg.getSubject());
        assertTrue(msg.getText().contains("http://localhost:5173/reset-password?token=rst456"));
    }

    @Test
    void send_ThrowsEmailDeliveryExceptionOnFailure() {
        doThrow(new MailSendException("SMTP server connection refused"))
            .when(mailSender).send(any(SimpleMailMessage.class));

        assertThrows(EmailDeliveryException.class, () ->
            service.sendVerificationEmail("fail@example.com", "Charlie", "badtok"));
    }
}
