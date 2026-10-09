package com.nutrisphere.dietitian;
import com.nutrisphere.assignment.DietitianPatientRepository;
import com.nutrisphere.dietitian.dto.*;
import com.nutrisphere.exception.*;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class DietitianService {
    private final DietitianRepository dietitianRepository;
    private final UserRepository userRepository;
    private final DietitianMapper dietitianMapper;
    private final DietitianPatientRepository dietitianPatientRepository;
    private final com.nutrisphere.nutrition.dietplan.DietPlanRepository dietPlanRepository;
    private final com.nutrisphere.notification.NotificationRepository notificationRepository;

    public DietitianProfileResponse getProfile(Long userId) {
        DietitianProfile p = dietitianRepository.findByUserId(userId)
            .orElseGet(() -> {
                var user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
                return DietitianProfile.builder().user(user).build();
            });
        return dietitianMapper.toResponse(p);
    }

    @Transactional
    public DietitianProfileResponse updateProfile(Long userId, DietitianProfileRequest req) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        DietitianProfile p = dietitianRepository.findByUserId(userId).orElse(new DietitianProfile());
        p.setUser(user);
        p.setSpecialization(req.getSpecialization());
        p.setLicenseNumber(req.getLicenseNumber());
        p.setClinicName(req.getClinicName());
        p.setClinicAddress(req.getClinicAddress());
        p.setYearsExperience(req.getYearsExperience());
        p.setBio(req.getBio());
        p.setConsultationFee(req.getConsultationFee());
        return dietitianMapper.toResponse(dietitianRepository.save(p));
    }

    public java.util.List<DietitianProfileResponse> getDietitianDirectory() {
        return dietitianRepository.findAll().stream()
            .filter(p -> p.getUser() != null && p.getUser().getStatus() == com.nutrisphere.common.enums.Status.ACTIVE)
            .map(dietitianMapper::toResponse)
            .toList();
    }

    public DietitianProfileResponse getDietitianById(Long dietitianUserId) {
        DietitianProfile p = dietitianRepository.findByUserId(dietitianUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Dietitian", dietitianUserId));
        return dietitianMapper.toResponse(p);
    }

    public DietitianDashboardResponse getDashboard(Long userId) {
        DietitianProfile profile = dietitianRepository.findByUserId(userId).orElse(null);
        DietitianDashboardResponse r = new DietitianDashboardResponse();
        r.setDietitianId(userId);
        r.setDietitianName(profile != null && profile.getUser() != null ? profile.getUser().getFullName() : "Clinical Dietitian");
        r.setTotalPatients((int) dietitianPatientRepository.countByDietitianUserId(userId));

        var assignedPatients = dietitianPatientRepository.findByDietitianUserIdAndActiveTrue(userId);
        var patientIds = assignedPatients.stream().map(com.nutrisphere.assignment.DietitianPatient::getPatientUserId).toList();

        var plans = dietPlanRepository.findByDietitianUserIdOrderByCreatedAtDesc(userId);
        long activeCount = plans.stream().filter(p -> p.getStatus() == com.nutrisphere.nutrition.dietplan.DietPlanStatus.APPROVED).count();
        long pendingCount = plans.stream().filter(p -> p.getStatus() == com.nutrisphere.nutrition.dietplan.DietPlanStatus.SUBMITTED).count();

        // Also count if plans are assigned directly to the patients
        if (activeCount == 0 && !patientIds.isEmpty()) {
            activeCount = dietPlanRepository.findAll().stream()
                .filter(p -> patientIds.contains(p.getPatientUserId()) && p.getStatus() == com.nutrisphere.nutrition.dietplan.DietPlanStatus.APPROVED)
                .count();
        }

        r.setActiveDietPlans((int) activeCount);
        r.setPendingReviews((int) pendingCount);
        r.setUnreadNotifications((int) notificationRepository.countByUserIdAndReadFalse(userId));
        return r;
    }
}
