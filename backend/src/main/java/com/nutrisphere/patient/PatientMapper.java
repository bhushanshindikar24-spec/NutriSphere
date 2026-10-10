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
        r.setActivityLevel(p.getActivityLevel());
        r.setAllergies(p.getAllergies());
        r.setDietaryRestrictions(p.getDietaryRestrictions());
        r.setFoodPreferences(p.getFoodPreferences());
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
