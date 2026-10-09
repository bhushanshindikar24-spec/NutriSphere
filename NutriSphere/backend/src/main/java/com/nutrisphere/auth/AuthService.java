package com.nutrisphere.auth;

import com.nutrisphere.common.enums.Status;
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
    private final com.nutrisphere.patient.PatientRepository patientRepository;
    private final com.nutrisphere.doctor.DoctorRepository doctorRepository;
    private final com.nutrisphere.dietitian.DietitianRepository dietitianRepository;
    private final com.nutrisphere.hotel.profile.HotelRepository hotelRepository;

    @Transactional
    public TokenResponse register(RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase(java.util.Locale.ROOT);
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already registered: " + email);
        }

        Role targetRole = req.getRole() != null ? req.getRole() : Role.PATIENT;
        if (targetRole == Role.ADMIN) {
            throw new BadRequestException("Administrator accounts cannot be self-registered.");
        }

        boolean isProfessional = (targetRole == Role.DOCTOR || targetRole == Role.DIETITIAN || targetRole == Role.HOTEL);
        Status initialStatus = isProfessional ? Status.PENDING : Status.ACTIVE;

        User user = User.builder()
            .email(email)
            .passwordHash(passwordEncoder.encode(req.getPassword()))
            .firstName(req.getFirstName())
            .lastName(req.getLastName())
            .phoneNumber(req.getPhoneNumber())
            .role(targetRole)
            .status(initialStatus)
            .emailVerified(true)
            .build();
        userRepository.save(user);

        if (targetRole == Role.PATIENT) {
            com.nutrisphere.patient.PatientProfile patientProfile = com.nutrisphere.patient.PatientProfile.builder()
                .user(user)
                .gender(com.nutrisphere.common.enums.Gender.OTHER)
                .activityLevel(com.nutrisphere.common.enums.ActivityLevel.MODERATELY_ACTIVE)
                .build();
            patientRepository.save(patientProfile);
            auditService.log(user.getId(), "REGISTER", "USER", user.getId(), "User registered as PATIENT");
            return generateTokenResponse(user);
        } else if (targetRole == Role.DOCTOR) {
            com.nutrisphere.doctor.DoctorProfile docProfile = com.nutrisphere.doctor.DoctorProfile.builder()
                .user(user)
                .licenseNumber(req.getLicenseNumber() != null && !req.getLicenseNumber().isBlank() ? req.getLicenseNumber() : "MD-" + user.getId() + "-LIC")
                .degree(req.getDegree() != null && !req.getDegree().isBlank() ? req.getDegree() : "MBBS, MD")
                .specialization(req.getSpecialization() != null && !req.getSpecialization().isBlank() ? req.getSpecialization() : "Clinical Medicine")
                .achievements(req.getAchievements() != null ? req.getAchievements() : "Licensed Medical Practitioner")
                .hospitalName(req.getHospitalOrClinic() != null ? req.getHospitalOrClinic() : "Clinical Medical Center")
                .hospitalAddress(req.getAddress())
                .yearsExperience(req.getYearsExperience() != null ? req.getYearsExperience() : 5)
                .consultationFee(req.getConsultationFee() != null ? req.getConsultationFee() : 100.0)
                .licenseDocumentUrl(req.getLicenseDocumentUrl())
                .verificationStatus("PENDING")
                .build();
            doctorRepository.save(docProfile);
            auditService.log(user.getId(), "REGISTER_PENDING", "DOCTOR", user.getId(), "Doctor registered with medical license, awaiting admin review");
            return TokenResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .status("PENDING")
                .message("Medical Doctor registration submitted with license. An administrator must verify and approve your medical credentials before account activation.")
                .build();
        } else if (targetRole == Role.DIETITIAN) {
            com.nutrisphere.dietitian.DietitianProfile dietProfile = com.nutrisphere.dietitian.DietitianProfile.builder()
                .user(user)
                .licenseNumber(req.getLicenseNumber() != null && !req.getLicenseNumber().isBlank() ? req.getLicenseNumber() : "RD-" + user.getId() + "-LIC")
                .degree(req.getDegree() != null && !req.getDegree().isBlank() ? req.getDegree() : "Registered Dietitian (RD), M.Sc Nutrition")
                .specialization(req.getSpecialization() != null && !req.getSpecialization().isBlank() ? req.getSpecialization() : "Clinical Nutrition")
                .achievements(req.getAchievements() != null ? req.getAchievements() : "Certified Dietetic Specialist")
                .clinicName(req.getHospitalOrClinic() != null ? req.getHospitalOrClinic() : "Clinical Nutrition Clinic")
                .clinicAddress(req.getAddress())
                .yearsExperience(req.getYearsExperience() != null ? req.getYearsExperience() : 5)
                .consultationFee(req.getConsultationFee() != null ? req.getConsultationFee() : 75.0)
                .licenseDocumentUrl(req.getLicenseDocumentUrl())
                .verificationStatus("PENDING")
                .build();
            dietitianRepository.save(dietProfile);
            auditService.log(user.getId(), "REGISTER_PENDING", "DIETITIAN", user.getId(), "Dietitian registered with license, awaiting admin review");
            return TokenResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .status("PENDING")
                .message("Clinical Dietitian registration submitted with professional credentials. An administrator must verify and approve your license before account activation.")
                .build();
        } else if (targetRole == Role.HOTEL) {
            com.nutrisphere.hotel.profile.HotelProfile hotelProfile = com.nutrisphere.hotel.profile.HotelProfile.builder()
                .user(user)
                .hotelName(req.getHospitalOrClinic() != null ? req.getHospitalOrClinic() : req.getFirstName() + "'s Culinary Kitchen")
                .licenseNumber(req.getLicenseNumber() != null && !req.getLicenseNumber().isBlank() ? req.getLicenseNumber() : "FSSAI-" + user.getId() + "-CUL")
                .licenseDocumentUrl(req.getLicenseDocumentUrl())
                .verificationStatus("PENDING")
                .cuisineType(req.getCuisineType() != null ? req.getCuisineType() : "Clinical & Therapeutic Catering")
                .hotelAddress(req.getAddress())
                .phoneNumber(req.getPhoneNumber())
                .active(false)
                .build();
            hotelRepository.save(hotelProfile);
            auditService.log(user.getId(), "REGISTER_PENDING", "HOTEL", user.getId(), "Culinary kitchen registered with food license, awaiting admin review");
            return TokenResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .status("PENDING")
                .message("Culinary Kitchen registration submitted with food safety license. An administrator must verify and approve your kitchen credentials before account activation.")
                .build();
        }

        return generateTokenResponse(user);
    }

    @Transactional
    public TokenResponse login(LoginRequest req) {
        String email = req.getEmail().trim().toLowerCase(java.util.Locale.ROOT);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (user.getStatus() == Status.PENDING) {
            throw new UnauthorizedException("Your account is currently PENDING administrator verification. Your submitted license and credentials are being reviewed by our clinical admin team.");
        }
        if (user.getStatus() == Status.SUSPENDED) {
            throw new UnauthorizedException("Your account has been suspended or rejected. Please contact platform administration.");
        }

        authManager.authenticate(new UsernamePasswordAuthenticationToken(email, req.getPassword()));
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
