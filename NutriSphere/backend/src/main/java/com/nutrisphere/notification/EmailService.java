package com.nutrisphere.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.mail.verification-url}")
    private String verificationUrl;

    @Value("${app.mail.password-reset-url}")
    private String passwordResetUrl;

    public void sendVerificationEmail(String recipient, String firstName, String token) {
        String link = verificationUrl + "?token=" + token;
        send(
            recipient,
            "Verify your NutriSphere email",
            "Hello " + firstName + ",\n\n"
                + "Please verify your NutriSphere account by opening this link:\n"
                + link + "\n\n"
                + "This verification link expires in 24 hours.\n\n"
                + "If you did not create this account, you can ignore this email."
        );
    }

    public void sendPasswordResetEmail(String recipient, String firstName, String token) {
        String link = passwordResetUrl + "?token=" + token;
        send(
            recipient,
            "Reset your NutriSphere password",
            "Hello " + firstName + ",\n\n"
                + "A password reset was requested for your NutriSphere account.\n"
                + "Open this link to choose a new password:\n"
                + link + "\n\n"
                + "This reset link expires in 1 hour.\n\n"
                + "If you did not request this, you can ignore this email."
        );
    }

    private void send(String recipient, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (MailException | IllegalArgumentException ex) {
            throw new EmailDeliveryException("Unable to deliver email", ex);
        }
    }
}
