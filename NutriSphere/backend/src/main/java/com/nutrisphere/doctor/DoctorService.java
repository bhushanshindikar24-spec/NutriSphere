package com.nutrisphere.doctor;

import com.nutrisphere.assignment.DoctorPatientRepository;
import com.nutrisphere.doctor.dto.*;
import com.nutrisphere.exception.*;
import com.nutrisphere.notification.NotificationService;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final DoctorMapper doctorMapper;
    private final DoctorPatientRepository doctorPatientRepository;

    public DoctorProfileResponse getProfile(Long userId) {
        DoctorProfile p = doctorRepository.findByUserId(userId)
            .orElseGet(() -> {
                var user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
                return DoctorProfile.builder().user(user).build();
            });
        return doctorMapper.toResponse(p);
    }

    @Transactional
    public DoctorProfileResponse updateProfile(Long userId, DoctorProfileRequest req) {
        var user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        DoctorProfile p = doctorRepository.findByUserId(userId).orElse(new DoctorProfile());
        p.setUser(user);
        p.setSpecialization(req.getSpecialization());
        p.setLicenseNumber(req.getLicenseNumber());
        p.setHospitalName(req.getHospitalName());
        p.setHospitalAddress(req.getHospitalAddress());
        p.setYearsExperience(req.getYearsExperience());
        p.setBio(req.getBio());
        p.setConsultationFee(req.getConsultationFee());
        return doctorMapper.toResponse(doctorRepository.save(p));
    }

    public DoctorDashboardResponse getDashboard(Long userId) {
        DoctorProfile profile = doctorRepository.findByUserId(userId).orElse(null);
        DoctorDashboardResponse r = new DoctorDashboardResponse();
        r.setDoctorId(userId);
        r.setDoctorName(profile != null ? profile.getUser().getFullName() : "");
        r.setTotalPatients((int) doctorPatientRepository.countByDoctorUserId(userId));
        r.setConsultationsToday(0);
        r.setPendingReports(0);
        r.setUnreadNotifications(0);
        return r;
    }
}
