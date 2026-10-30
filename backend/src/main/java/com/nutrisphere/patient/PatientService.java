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
        PatientProfile p = patientRepository.findByUserId(patientId)
            .or(() -> patientRepository.findById(patientId))
            .orElseGet(() -> {
                var user = userRepository.findById(patientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient", patientId));
                return PatientProfile.builder().user(user).build();
            });
        PatientProfileResponse res = patientMapper.toResponse(p);
        if (p.getUser() != null) {
            dietitianPatientRepository.findByPatientUserIdAndActiveTrue(p.getUser().getId())
                .stream().findFirst().ifPresent(dp -> {
                    userRepository.findById(dp.getDietitianUserId()).ifPresent(u -> {
                        res.setAssignedDietitian(u.getFullName());
                    });
                });
            doctorPatientRepository.findByPatientUserIdAndActiveTrue(p.getUser().getId())
                .stream().findFirst().ifPresent(dp -> {
                    userRepository.findById(dp.getDoctorUserId()).ifPresent(u -> {
                        res.setAssignedDoctor(u.getFullName());
                    });
                });
        }
        return res;
    }

    @Transactional
    public PatientProfileResponse updateProfile(Long userId, PatientProfileRequest req) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        if (req.getFirstName() != null && !req.getFirstName().isBlank()) {
            user.setFirstName(req.getFirstName());
        }
        if (req.getLastName() != null && !req.getLastName().isBlank()) {
            user.setLastName(req.getLastName());
        }
        if (req.getPhoneNumber() != null) {
            user.setPhoneNumber(req.getPhoneNumber());
        }
        userRepository.save(user);

        PatientProfile p = patientRepository.findByUserId(userId).orElse(new PatientProfile());
        p.setUser(user);
        if (req.getDateOfBirth() != null) p.setDateOfBirth(req.getDateOfBirth());
        if (req.getGender() != null) p.setGender(req.getGender());
        if (req.getHeightCm() != null) p.setHeightCm(req.getHeightCm());
        if (req.getWeightKg() != null) p.setWeightKg(req.getWeightKg());
        if (req.getBloodType() != null) p.setBloodType(req.getBloodType());
        if (req.getActivityLevel() != null) p.setActivityLevel(req.getActivityLevel());
        if (req.getAllergies() != null) p.setAllergies(req.getAllergies());
        if (req.getDietaryRestrictions() != null) p.setDietaryRestrictions(req.getDietaryRestrictions());
        if (req.getFoodPreferences() != null) p.setFoodPreferences(req.getFoodPreferences());
        if (req.getOccupation() != null) p.setOccupation(req.getOccupation());
        if (req.getAddress() != null) p.setAddress(req.getAddress());
        if (req.getEmergencyContactName() != null) p.setEmergencyContactName(req.getEmergencyContactName());
        if (req.getEmergencyContactPhone() != null) p.setEmergencyContactPhone(req.getEmergencyContactPhone());
        if (req.getDietaryPreference() != null) p.setDietaryPreference(req.getDietaryPreference());
        if (req.getCurrentWaterIntakeLiters() != null) p.setCurrentWaterIntakeLiters(req.getCurrentWaterIntakeLiters());
        if (req.getHealthGoals() != null) p.setHealthGoals(req.getHealthGoals());
        if (req.getNutritionalRequirements() != null) p.setNutritionalRequirements(req.getNutritionalRequirements());

        if (req.getBloodPressure() != null) p.setBloodPressure(req.getBloodPressure());
        if (req.getRestingHeartRate() != null) p.setRestingHeartRate(req.getRestingHeartRate());
        if (req.getDiagnosedConditions() != null) p.setDiagnosedConditions(req.getDiagnosedConditions());
        if (req.getCurrentSymptoms() != null) p.setCurrentSymptoms(req.getCurrentSymptoms());
        if (req.getPreviousSurgeries() != null) p.setPreviousSurgeries(req.getPreviousSurgeries());
        if (req.getFamilyMedicalHistory() != null) p.setFamilyMedicalHistory(req.getFamilyMedicalHistory());
        if (req.getCurrentMedications() != null) p.setCurrentMedications(req.getCurrentMedications());
        if (req.getVitaminsSupplements() != null) p.setVitaminsSupplements(req.getVitaminsSupplements());
        if (req.getFoodIntolerances() != null) p.setFoodIntolerances(req.getFoodIntolerances());
        if (req.getMealsPerDay() != null) p.setMealsPerDay(req.getMealsPerDay());
        if (req.getMealTimings() != null) p.setMealTimings(req.getMealTimings());
        if (req.getTypicalFoodIntake() != null) p.setTypicalFoodIntake(req.getTypicalFoodIntake());
        if (req.getExerciseType() != null) p.setExerciseType(req.getExerciseType());
        if (req.getExerciseFrequencyDuration() != null) p.setExerciseFrequencyDuration(req.getExerciseFrequencyDuration());
        if (req.getSmokingTobacco() != null) p.setSmokingTobacco(req.getSmokingTobacco());
        if (req.getAlcoholConsumption() != null) p.setAlcoholConsumption(req.getAlcoholConsumption());

        // Calculate and reflect targets in personalized diet plan
        double weight = p.getWeightKg() != null ? p.getWeightKg() : 70.0;
        double height = p.getHeightCm() != null ? p.getHeightCm() : 170.0;
        int age = p.getDateOfBirth() != null ? java.time.Period.between(p.getDateOfBirth(), LocalDate.now()).getYears() : 30;
        boolean isFemale = p.getGender() == com.nutrisphere.common.enums.Gender.FEMALE;
        double bmr = (10.0 * weight) + (6.25 * height) - (5.0 * age) + (isFemale ? -161.0 : 5.0);
        double multiplier = 1.375;
        if (p.getActivityLevel() != null) {
            switch (p.getActivityLevel()) {
                case SEDENTARY -> multiplier = 1.2;
                case LIGHTLY_ACTIVE -> multiplier = 1.375;
                case MODERATELY_ACTIVE -> multiplier = 1.55;
                case VERY_ACTIVE -> multiplier = 1.725;
                case EXTRA_ACTIVE -> multiplier = 1.9;
            }
        }
        double targetCal = bmr * multiplier;
        if (p.getHealthGoals() != null) {
            String g = p.getHealthGoals().toLowerCase();
            if (g.contains("loss") || g.contains("deficit")) targetCal -= 400;
            else if (g.contains("gain") || g.contains("muscle")) targetCal += 350;
        }
        double finalCalories = req.getTargetDailyCalories() != null && req.getTargetDailyCalories() > 0 
            ? req.getTargetDailyCalories() : Math.max(1200.0, Math.round(targetCal));
        double finalWaterMl = req.getTargetDailyWaterMl() != null && req.getTargetDailyWaterMl() > 0 
            ? req.getTargetDailyWaterMl() : (p.getCurrentWaterIntakeLiters() != null && p.getCurrentWaterIntakeLiters() > 0 
                ? p.getCurrentWaterIntakeLiters() * 1000.0 : Math.round(weight * 33.0));

        p.setTargetDailyCalories(finalCalories);
        p.setTargetDailyWaterMl(finalWaterMl);

        // Reflect in active approved diet plan if present
        dietPlanRepository.findByPatientUserIdAndStatus(userId, DietPlanStatus.APPROVED).ifPresent(dp -> {
            dp.setTargetCalories(finalCalories);
            dp.setTargetWaterMl(finalWaterMl);
            dietPlanRepository.save(dp);
        });

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
