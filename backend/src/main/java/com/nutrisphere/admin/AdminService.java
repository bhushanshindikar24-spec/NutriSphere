package com.nutrisphere.admin;

import com.nutrisphere.admin.dto.PendingVerificationDto;
import com.nutrisphere.audit.AuditService;
import com.nutrisphere.common.enums.Status;
import com.nutrisphere.dietitian.DietitianProfile;
import com.nutrisphere.dietitian.DietitianRepository;
import com.nutrisphere.doctor.DoctorProfile;
import com.nutrisphere.doctor.DoctorRepository;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.hotel.profile.HotelProfile;
import com.nutrisphere.hotel.profile.HotelRepository;
import com.nutrisphere.notification.NotificationService;
import com.nutrisphere.notification.NotificationType;
import com.nutrisphere.user.Role;
import com.nutrisphere.user.User;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DietitianRepository dietitianRepository;
    private final HotelRepository hotelRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public List<PendingVerificationDto> getPendingVerifications() {
        List<PendingVerificationDto> result = new ArrayList<>();

        // Fetch users who are in PENDING status
        List<User> pendingUsers = userRepository.findAll().stream()
            .filter(u -> u.getStatus() == Status.PENDING)
            .toList();

        for (User u : pendingUsers) {
            PendingVerificationDto.PendingVerificationDtoBuilder builder = PendingVerificationDto.builder()
                .userId(u.getId())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .phoneNumber(u.getPhoneNumber())
                .role(u.getRole())
                .status(u.getStatus().name())
                .registeredAt(u.getCreatedAt());

            if (u.getRole() == Role.DOCTOR) {
                doctorRepository.findByUserId(u.getId()).ifPresent(doc -> {
                    builder.licenseNumber(doc.getLicenseNumber())
                        .degree(doc.getDegree())
                        .specialization(doc.getSpecialization())
                        .achievements(doc.getAchievements())
                        .organizationName(doc.getHospitalName())
                        .organizationAddress(doc.getHospitalAddress())
                        .licenseDocumentUrl(doc.getLicenseDocumentUrl())
                        .yearsExperience(doc.getYearsExperience())
                        .consultationFee(doc.getConsultationFee())
                        .verificationStatus(doc.getVerificationStatus());
                });
            } else if (u.getRole() == Role.DIETITIAN) {
                dietitianRepository.findByUserId(u.getId()).ifPresent(diet -> {
                    builder.licenseNumber(diet.getLicenseNumber())
                        .degree(diet.getDegree())
                        .specialization(diet.getSpecialization())
                        .achievements(diet.getAchievements())
                        .organizationName(diet.getClinicName())
                        .organizationAddress(diet.getClinicAddress())
                        .licenseDocumentUrl(diet.getLicenseDocumentUrl())
                        .yearsExperience(diet.getYearsExperience())
                        .consultationFee(diet.getConsultationFee())
                        .verificationStatus(diet.getVerificationStatus());
                });
            } else if (u.getRole() == Role.HOTEL) {
                hotelRepository.findByUserId(u.getId()).ifPresent(hotel -> {
                    builder.licenseNumber(hotel.getLicenseNumber())
                        .specialization(hotel.getCuisineType())
                        .organizationName(hotel.getHotelName())
                        .organizationAddress(hotel.getHotelAddress())
                        .licenseDocumentUrl(hotel.getLicenseDocumentUrl())
                        .verificationStatus(hotel.getVerificationStatus());
                });
            }

            result.add(builder.build());
        }

        return result;
    }

    @Transactional
    public void approveVerification(Long userId, Long adminUserId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        user.setStatus(Status.ACTIVE);
        user.setEmailVerified(true);
        userRepository.save(user);

        if (user.getRole() == Role.DOCTOR) {
            doctorRepository.findByUserId(userId).ifPresent(doc -> {
                doc.setVerificationStatus("APPROVED");
                doctorRepository.save(doc);
            });
        } else if (user.getRole() == Role.DIETITIAN) {
            dietitianRepository.findByUserId(userId).ifPresent(diet -> {
                diet.setVerificationStatus("APPROVED");
                dietitianRepository.save(diet);
            });
        } else if (user.getRole() == Role.HOTEL) {
            hotelRepository.findByUserId(userId).ifPresent(hotel -> {
                hotel.setVerificationStatus("APPROVED");
                hotel.setActive(true);
                hotelRepository.save(hotel);
            });
        }

        auditService.log(adminUserId, "APPROVE_LICENSE", user.getRole().name(), userId,
            "Admin approved credentials and activated user: " + user.getEmail());

        try {
            notificationService.createNotification(
                user.getId(),
                "GENERAL",
                "License Verified & Approved",
                "Congratulations! Your professional credentials and license have been verified and approved by the Clinical Administrator. You now have full platform access.",
                user.getId()
            );
        } catch (Exception e) {
            log.warn("Failed to send approval notification: {}", e.getMessage());
        }
    }

    @Transactional
    public void rejectVerification(Long userId, String reason, Long adminUserId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        user.setStatus(Status.SUSPENDED);
        userRepository.save(user);

        if (user.getRole() == Role.DOCTOR) {
            doctorRepository.findByUserId(userId).ifPresent(doc -> {
                doc.setVerificationStatus("REJECTED");
                doctorRepository.save(doc);
            });
        } else if (user.getRole() == Role.DIETITIAN) {
            dietitianRepository.findByUserId(userId).ifPresent(diet -> {
                diet.setVerificationStatus("REJECTED");
                dietitianRepository.save(diet);
            });
        } else if (user.getRole() == Role.HOTEL) {
            hotelRepository.findByUserId(userId).ifPresent(hotel -> {
                hotel.setVerificationStatus("REJECTED");
                hotel.setActive(false);
                hotelRepository.save(hotel);
            });
        }

        auditService.log(adminUserId, "REJECT_LICENSE", user.getRole().name(), userId,
            "Admin rejected application for user: " + user.getEmail() + ". Reason: " + reason);
    }

    public Map<String, Object> getSystemStats() {
        List<User> all = userRepository.findAll();
        long pending = all.stream().filter(u -> u.getStatus() == Status.PENDING).count();
        long doctors = all.stream().filter(u -> u.getRole() == Role.DOCTOR && u.getStatus() == Status.ACTIVE).count();
        long dietitians = all.stream().filter(u -> u.getRole() == Role.DIETITIAN && u.getStatus() == Status.ACTIVE).count();
        long patients = all.stream().filter(u -> u.getRole() == Role.PATIENT && u.getStatus() == Status.ACTIVE).count();
        long hotels = all.stream().filter(u -> u.getRole() == Role.HOTEL && u.getStatus() == Status.ACTIVE).count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", all.size());
        stats.put("pendingVerifications", pending);
        stats.put("activeDoctors", doctors);
        stats.put("activeDietitians", dietitians);
        stats.put("activePatients", patients);
        stats.put("activeKitchens", hotels);
        return stats;
    }

    public List<Map<String, Object>> getAllUsers() {
        List<User> all = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : all) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", u.getId());
            map.put("email", u.getEmail());
            map.put("fullName", u.getFullName());
            map.put("role", u.getRole().name());
            map.put("status", u.getStatus().name());
            map.put("emailVerified", u.isEmailVerified());
            map.put("createdAt", u.getCreatedAt());
            result.add(map);
        }
        return result;
    }
}
