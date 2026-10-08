package com.nutrisphere.auth;

import com.nutrisphere.audit.AuditService;
import com.nutrisphere.exception.*;
import com.nutrisphere.notification.EmailService;
import com.nutrisphere.security.*;
import com.nutrisphere.user.*;
import com.nutrisphere.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final int VERIFICATION_TOKEN_HOURS = 24;
    private static final int PASSWORD_RESET_TOKEN_HOURS = 1;
    private static final Duration AUTH_EMAIL_COOLDOWN = Duration.ofSeconds(60);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final UserMapper userMapper;
    private final AuditService auditService;
    private final EmailService emailService;
    private final ConcurrentHashMap<String, Instant> emailActionTimes = new ConcurrentHashMap<>();

    @Transactional
    public RegistrationResponse register(RegisterRequest req) {
        String normalizedEmail = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("Email already registered");
        }
        if (req.getPassword() == null || req.getPassword().length() < 8) {
            throw new BadRequestException("Password must contain at least 8 characters");
        }

        String verificationToken = UUID.randomUUID().toString();
        LocalDateTime verificationExpires = LocalDateTime.now().plusHours(VERIFICATION_TOKEN_HOURS);

        User user = User.builder()
            .email(normalizedEmail)
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .phoneNumber(req.getPhoneNumber())
            .role(Role.PATIENT)
            .emailVerified(false)
            .emailVerifyToken(verificationToken)
            .emailVerifyExpires(verificationExpires)
            .build();

        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationToken);
        auditService.log(user.getId(), "REGISTER", "USER", user.getId(), "User registered as PATIENT; email verification required");

        return RegistrationResponse.builder()
            .email(user.getEmail())
            .verificationRequired(true)
            .build();
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        enforceEmailCooldown(normalizedEmail);
        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            if (user.isEmailVerified()) {
                return;
            }

            String token = UUID.randomUUID().toString();
            user.setEmailVerifyToken(token);
            user.setEmailVerifyExpires(LocalDateTime.now().plusHours(VERIFICATION_TOKEN_HOURS));
            userRepository.save(user);

            emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), token);
        });
    }

    @Transactional
    public TokenResponse login(LoginRequest req) {
        String normalizedEmail = req.getEmail().trim().toLowerCase();
        authManager.authenticate(new UsernamePasswordAuthenticationToken(normalizedEmail, req.getPassword()));
        User user = userRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User", 0L));

        user.setLastLoginAt(LocalDateTime.now());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        auditService.log(user.getId(), "LOGIN", "USER", user.getId(), "User logged in");
        return generateTokenResponse(user, refreshToken);
    }

    @Transactional
    public TokenResponse refreshToken(String refreshToken) {
        User user = userRepository.findByRefreshToken(refreshToken)
            .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        if (!jwtService.isTokenValid(refreshToken, user.getEmail())) {
            throw new UnauthorizedException("Refresh token expired");
        }
        String newRefresh = jwtService.generateRefreshToken(user.getEmail());
        user.setRefreshToken(newRefresh);
        userRepository.save(user);
        return generateTokenResponse(user, newRefresh);
    }

    @Transactional
    public void logout(Long userId) {
        userRepository.findById(userId).ifPresent(u -> {
            u.setRefreshToken(null);
            userRepository.save(u);
        });
    }

    @Transactional
    public void forgotPassword(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        enforceEmailCooldown(normalizedEmail);
        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetExpires(LocalDateTime.now().plusHours(PASSWORD_RESET_TOKEN_HOURS));
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), token);
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
            .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (user.getPasswordResetExpires() == null || user.getPasswordResetExpires().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token expired");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpires(null);
        user.setRefreshToken(null);
        userRepository.save(user);
        auditService.log(user.getId(), "PASSWORD_RESET", "USER", user.getId(), "Password reset successfully");
    }

    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerifyToken(token)
            .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (user.getEmailVerifyExpires() == null || user.getEmailVerifyExpires().isBefore(LocalDateTime.now())) {
            user.setEmailVerifyToken(null);
            user.setEmailVerifyExpires(null);
            userRepository.save(user);
            throw new BadRequestException("Verification token expired");
        }

        user.setEmailVerified(true);
        user.setEmailVerifyToken(null);
        user.setEmailVerifyExpires(null);
        userRepository.save(user);
        auditService.log(user.getId(), "EMAIL_VERIFIED", "USER", user.getId(), "Email address verified");
    }

    public UserResponse getMe(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        return userMapper.toResponse(user);
    }

    private void enforceEmailCooldown(String normalizedEmail) {
        Instant now = Instant.now();
        Instant previous = emailActionTimes.putIfAbsent(normalizedEmail, now);
        if (previous != null && Duration.between(previous, now).compareTo(AUTH_EMAIL_COOLDOWN) < 0) {
            throw new RateLimitException("Please wait before requesting another authentication email");
        }
        emailActionTimes.put(normalizedEmail, now);
    }

    private TokenResponse generateTokenResponse(User user, String refreshToken) {
        Map<String, Object> claims = Map.of(
            "role", user.getRole().name(),
            "userId", user.getId(),
            "firstName", user.getFirstName()
        );
        String access = jwtService.generateToken(user.getEmail(), claims);
        return TokenResponse.builder()
            .accessToken(access)
            .refreshToken(refreshToken)
            .tokenType("Bearer")
            .expiresIn(86400)
            .userId(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole())
            .build();
    }
}
