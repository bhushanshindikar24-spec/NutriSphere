package com.nutrisphere.patient;

import com.nutrisphere.assignment.DoctorPatientRepository;
import com.nutrisphere.assignment.DietitianPatientRepository;
import com.nutrisphere.exception.*;
import com.nutrisphere.notification.NotificationRepository;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.hydration.WaterLogRepository;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import com.nutrisphere.patient.dto.*;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PatientService {
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PatientMapper patientMapper;
    private final FoodLogRepository foodLogRepository;
    private final WaterLogRepository waterLogRepository;
    private final DietPlanRepository dietPlanRepository;
    private final NotificationRepository notificationRepository;
    private final DoctorPatientRepository doctorPatientRepository;
    private final DietitianPatientRepository dietitianPatientRepository;

    public PatientProfileResponse getProfile(Long userId) {
        PatientProfile p = patientRepository.findByUserId(userId)
            .orElseGet(() -> {
                var user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
                return PatientProfile.builder().user(user).build();
            });
        return patientMapper.toResponse(p);
    }

    public PatientProfileResponse getProfileByPatientId(Long patientId) {
        PatientProfile p = patientRepository.findById(patientId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient", patientId));
        return patientMapper.toResponse(p);
    }

    @Transactional
    public PatientProfileResponse updateProfile(Long userId, PatientProfileRequest req) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        PatientProfile p = patientRepository.findByUserId(userId).orElse(new PatientProfile());
        p.setUser(user);
        p.setDateOfBirth(req.getDateOfBirth());
        p.setGender(req.getGender());
        p.setHeightCm(req.getHeightCm());
        p.setWeightKg(req.getWeightKg());
        p.setBloodType(req.getBloodType());
        p.setActivityLevel(req.getActivityLevel());
        p.setAllergies(req.getAllergies());
        p.setDietaryRestrictions(req.getDietaryRestrictions());
        p.setFoodPreferences(req.getFoodPreferences());
        p.setOccupation(req.getOccupation());
        p.setAddress(req.getAddress());
        p.setEmergencyContactName(req.getEmergencyContactName());
        p.setEmergencyContactPhone(req.getEmergencyContactPhone());
        return patientMapper.toResponse(patientRepository.save(p));
    }

    public PatientDashboardResponse getDashboard(Long userId) {
        PatientProfile profile = patientRepository.findByUserId(userId).orElse(null);
        LocalDate today = LocalDate.now();

        PatientDashboardResponse r = new PatientDashboardResponse();
        r.setPatientId(userId);
        r.setPatientName(profile != null ? profile.getUser().getFullName() : "");

        Double todayCalories = foodLogRepository.sumCaloriesForDate(userId, today);
        Double todayWaterMl = waterLogRepository.sumAmountForDate(userId, today);
        r.setTodayCalories(todayCalories != null ? todayCalories : 0.0);
        r.setHydrationLiters((todayWaterMl != null ? todayWaterMl : 0.0) / 1000.0);

        var approvedPlan = dietPlanRepository.findByPatientUserIdAndStatus(userId, DietPlanStatus.APPROVED);
        if (approvedPlan.isPresent()) {
            DietPlan plan = approvedPlan.get();
            r.setHasDietPlan(true);
            r.setTargetCalories(plan.getTargetCalories() != null ? plan.getTargetCalories() : 0.0);
            r.setTargetHydrationLiters((plan.getTargetWaterMl() != null ? plan.getTargetWaterMl() : 0.0) / 1000.0);

            double calorieScore = scoreAgainstTarget(r.getTodayCalories(), r.getTargetCalories());
            double hydrationScore = scoreAgainstTarget(r.getHydrationLiters(), r.getTargetHydrationLiters());
            if (r.getTargetCalories() > 0 && r.getTargetHydrationLiters() > 0) {
                r.setAdherenceScore((int) Math.round((calorieScore + hydrationScore) / 2.0));
            } else if (r.getTargetCalories() > 0) {
                r.setAdherenceScore((int) Math.round(calorieScore));
            } else if (r.getTargetHydrationLiters() > 0) {
                r.setAdherenceScore((int) Math.round(hydrationScore));
            } else {
                r.setAdherenceScore(0);
            }
        } else {
            r.setHasDietPlan(false);
            r.setTargetCalories(0.0);
            r.setTargetHydrationLiters(0.0);
            r.setAdherenceScore(0);
        }

        doctorPatientRepository.findByPatientUserIdAndActiveTrue(userId).stream().findFirst()
            .flatMap(a -> userRepository.findById(a.getDoctorUserId()))
            .ifPresent(u -> r.setDoctorName("Dr. " + u.getFullName()));

        dietitianPatientRepository.findByPatientUserIdAndActiveTrue(userId).stream().findFirst()
            .flatMap(a -> userRepository.findById(a.getDietitianUserId()))
            .ifPresent(u -> r.setDietitianName(u.getFullName()));

        r.setUnreadNotifications((int) notificationRepository.countByUserIdAndReadFalse(userId));
        return r;
    }

    private double scoreAgainstTarget(double actual, double target) {
        if (target <= 0) return 0;
        return Math.min(100.0, (actual / target) * 100.0);
    }
}
