package com.nutrisphere.doctor;

import com.nutrisphere.doctor.dto.DoctorProfileResponse;
import org.springframework.stereotype.Component;

@Component
public class DoctorMapper {
    public DoctorProfileResponse toResponse(DoctorProfile p) {
        DoctorProfileResponse r = new DoctorProfileResponse();
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
        r.setHospitalName(p.getHospitalName());
        r.setHospitalAddress(p.getHospitalAddress());
        r.setYearsExperience(p.getYearsExperience());
        r.setBio(p.getBio());
        r.setConsultationFee(p.getConsultationFee());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }
}
