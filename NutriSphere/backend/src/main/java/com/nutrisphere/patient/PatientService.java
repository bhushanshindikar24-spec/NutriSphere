package com.nutrisphere.patient;

import com.nutrisphere.exception.*;
import com.nutrisphere.patient.dto.*;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PatientMapper patientMapper;

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
        PatientDashboardResponse r = new PatientDashboardResponse();
        r.setPatientId(userId);
        r.setPatientName(profile != null ? profile.getUser().getFullName() : "");
        r.setAdherenceScore(75);
        r.setTodayCalories(0);
        r.setTargetCalories(2000);
        r.setHydrationLiters(0);
        r.setTargetHydrationLiters(2.5);
        r.setUnreadNotifications(0);
        return r;
    }
}
