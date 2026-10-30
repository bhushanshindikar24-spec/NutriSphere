package com.nutrisphere.patient;

import com.nutrisphere.patient.dto.*;
import org.springframework.stereotype.Component;

@Component
public class PatientMapper {
    public PatientProfileResponse toResponse(PatientProfile p) {
        PatientProfileResponse r = new PatientProfileResponse();
        r.setId(p.getId());
        r.setUserId(p.getUser().getId());
        r.setEmail(p.getUser().getEmail());
        r.setFirstName(p.getUser().getFirstName());
        r.setLastName(p.getUser().getLastName());
        r.setFullName(p.getUser().getFullName());
        r.setPhoneNumber(p.getUser().getPhoneNumber());
        r.setProfileImageUrl(p.getUser().getProfileImageUrl());
        r.setDateOfBirth(p.getDateOfBirth());
        r.setGender(p.getGender());
        r.setHeightCm(p.getHeightCm());
        r.setWeightKg(p.getWeightKg());
        if (p.getHeightCm() != null && p.getWeightKg() != null && p.getHeightCm() > 0) {
            double h = p.getHeightCm() / 100.0;
            r.setBmi(Math.round((p.getWeightKg() / (h * h)) * 10.0) / 10.0);
        }
        r.setBloodType(p.getBloodType());
        r.setBloodGroup(p.getBloodType());
        if (p.getDateOfBirth() != null) {
            r.setAge(java.time.Period.between(p.getDateOfBirth(), java.time.LocalDate.now()).getYears());
        } else {
            r.setAge(null);
        }
        r.setStatus(p.getUser() != null && p.getUser().getStatus() != null ? p.getUser().getStatus().name() : null);
        r.setActiveCondition(p.getDiagnosedConditions());
        r.setActivityLevel(p.getActivityLevel());
        r.setAllergies(p.getAllergies());
        r.setDietaryRestrictions(p.getDietaryRestrictions());
        r.setFoodPreferences(p.getFoodPreferences());
        r.setDietaryPreference(p.getDietaryPreference());
        r.setCurrentWaterIntakeLiters(p.getCurrentWaterIntakeLiters());
        r.setHealthGoals(p.getHealthGoals());
        r.setNutritionalRequirements(p.getNutritionalRequirements());
        r.setTargetDailyCalories(p.getTargetDailyCalories());
        r.setTargetDailyWaterMl(p.getTargetDailyWaterMl());

        // New Comprehensive Fields
        r.setBloodPressure(p.getBloodPressure());
        r.setRestingHeartRate(p.getRestingHeartRate());
        r.setDiagnosedConditions(p.getDiagnosedConditions());
        r.setCurrentSymptoms(p.getCurrentSymptoms());
        r.setPreviousSurgeries(p.getPreviousSurgeries());
        r.setFamilyMedicalHistory(p.getFamilyMedicalHistory());
        r.setCurrentMedications(p.getCurrentMedications());
        r.setVitaminsSupplements(p.getVitaminsSupplements());
        r.setFoodIntolerances(p.getFoodIntolerances());
        r.setMealsPerDay(p.getMealsPerDay());
        r.setMealTimings(p.getMealTimings());
        r.setTypicalFoodIntake(p.getTypicalFoodIntake());
        r.setExerciseType(p.getExerciseType());
        r.setExerciseFrequencyDuration(p.getExerciseFrequencyDuration());
        r.setSmokingTobacco(p.getSmokingTobacco());
        r.setAlcoholConsumption(p.getAlcoholConsumption());

        // Calculate BMR & TDEE (Mifflin-St Jeor formula) only if weight & height are present
        if (p.getWeightKg() != null && p.getHeightCm() != null && p.getWeightKg() > 0 && p.getHeightCm() > 0) {
            double weight = p.getWeightKg();
            double height = p.getHeightCm();
            int age = r.getAge() != null ? r.getAge() : 30;
            boolean isFemale = p.getGender() == com.nutrisphere.common.enums.Gender.FEMALE;
            double bmr = (10.0 * weight) + (6.25 * height) - (5.0 * age) + (isFemale ? -161.0 : 5.0);
            r.setBmr(Math.round(bmr * 10.0) / 10.0);

            // Activity multiplier
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
            double tdee = bmr * multiplier;
            r.setTdee(Math.round(tdee * 10.0) / 10.0);

            // Goals adjustment
            double targetCal = tdee;
            if (p.getHealthGoals() != null) {
                String g = p.getHealthGoals().toLowerCase();
                if (g.contains("loss") || g.contains("deficit")) targetCal -= 400;
                else if (g.contains("gain") || g.contains("muscle")) targetCal += 350;
            }
            r.setRecommendedCalories(Math.max(1200.0, Math.round(targetCal)));
            double recWaterLiters = Math.round((weight * 0.033) * 10.0) / 10.0;
            r.setRecommendedWaterLiters(recWaterLiters);
        }

        r.setOccupation(p.getOccupation());
        r.setAddress(p.getAddress());
        r.setEmergencyContactName(p.getEmergencyContactName());
        r.setEmergencyContactPhone(p.getEmergencyContactPhone());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }

    public PatientSummaryResponse toSummary(PatientProfile p) {
        PatientSummaryResponse r = new PatientSummaryResponse();
        r.setId(p.getId());
        r.setUserId(p.getUser().getId());
        r.setFullName(p.getUser().getFullName());
        r.setEmail(p.getUser().getEmail());
        r.setProfileImageUrl(p.getUser().getProfileImageUrl());
        r.setWeightKg(p.getWeightKg());
        r.setHeightCm(p.getHeightCm());
        return r;
    }
}
