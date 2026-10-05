package com.nutrisphere.auth;

import com.nutrisphere.audit.AuditService;
import com.nutrisphere.exception.*;
import com.nutrisphere.security.*;
import com.nutrisphere.user.*;
import com.nutrisphere.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final UserMapper userMapper;
    private final AuditService auditService;

    @Transactional
    public TokenResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + req.getEmail());
        }
        // SECURITY: Public registration ALWAYS defaults to PATIENT.
        // Professional roles (DOCTOR, DIETITIAN, HOTEL) must be provisioned by admin.
        // Never trust the role field from the client request.
        User user = User.builder()
            .email(req.getEmail())
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .phoneNumber(req.getPhoneNumber())
            .role(com.nutrisphere.user.Role.PATIENT)
            .emailVerified(true) // For demo; in prod send verification email
            .build();
        userRepository.save(user);
        auditService.log(user.getId(), "REGISTER", "USER", user.getId(), "User registered as PATIENT");
        return generateTokenResponse(user);
    }

    @Transactional
    public TokenResponse login(LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail())
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
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetExpires(LocalDateTime.now().plusHours(1));
            userRepository.save(user);
            log.info("Password reset token for {}: {}", email, token);
            // In production: send email with reset link
        });
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
            .orElseThrow(() -> new BadRequestException("Invalid reset token"));
        if (user.getPasswordResetExpires().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token expired");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpires(null);
        user.setRefreshToken(null); // Invalidate active sessions
        userRepository.save(user);
        auditService.log(user.getId(), "PASSWORD_RESET", "USER", user.getId(), "Password reset successfully");
    }

    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerifyToken(token)
            .orElseThrow(() -> new BadRequestException("Invalid verification token"));
        user.setEmailVerified(true);
        user.setEmailVerifyToken(null);
        userRepository.save(user);
    }

    public UserResponse getMe(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        return userMapper.toResponse(user);
    }

    private TokenResponse generateTokenResponse(User user) {
        String refresh = jwtService.generateRefreshToken(user.getEmail());
        user.setRefreshToken(refresh);
        userRepository.save(user);
        return generateTokenResponse(user, refresh);
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
