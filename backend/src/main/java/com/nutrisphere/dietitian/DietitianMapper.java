package com.nutrisphere.dietitian;
import com.nutrisphere.dietitian.dto.DietitianProfileResponse;
import org.springframework.stereotype.Component;
@Component
public class DietitianMapper {
    public DietitianProfileResponse toResponse(DietitianProfile p) {
        DietitianProfileResponse r = new DietitianProfileResponse();
        r.setId(p.getId());
        r.setUserId(p.getUser().getId());
        r.setEmail(p.getUser().getEmail());
        r.setFirstName(p.getUser().getFirstName());
        r.setLastName(p.getUser().getLastName());
        r.setFullName(p.getUser().getFullName());
        r.setPhoneNumber(p.getUser().getPhoneNumber());
        r.setProfileImageUrl(p.getUser().getProfileImageUrl());
        r.setSpecialization(p.getSpecialization());
        r.setLicenseNumber(p.getLicenseNumber());
        r.setClinicName(p.getClinicName());
        r.setClinicAddress(p.getClinicAddress());
        r.setYearsExperience(p.getYearsExperience());
        r.setBio(p.getBio());
        r.setConsultationFee(p.getConsultationFee());
        r.setDegree(p.getDegree());
        r.setAchievements(p.getAchievements());
        r.setLicenseDocumentUrl(p.getLicenseDocumentUrl());
        r.setVerificationStatus(p.getVerificationStatus());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }
}
