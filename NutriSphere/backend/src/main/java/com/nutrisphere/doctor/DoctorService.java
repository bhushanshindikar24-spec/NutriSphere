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
@Transactional(readOnly = true)
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final DoctorMapper doctorMapper;
    private final DoctorPatientRepository doctorPatientRepository;
    private final com.nutrisphere.medical.consultation.ConsultationRepository consultationRepository;
    private final com.nutrisphere.notification.NotificationRepository notificationRepository;

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

    public java.util.List<DoctorProfileResponse> getDoctorDirectory() {
        return doctorRepository.findAll().stream()
            .filter(p -> p.getUser() != null && p.getUser().getStatus() == com.nutrisphere.common.enums.Status.ACTIVE)
            .map(doctorMapper::toResponse)
            .toList();
    }

    public DoctorProfileResponse getDoctorById(Long doctorUserId) {
        DoctorProfile p = doctorRepository.findByUserId(doctorUserId)
            .orElseThrow(() -> new ResourceNotFoundException("Doctor", doctorUserId));
        return doctorMapper.toResponse(p);
    }

    public DoctorDashboardResponse getDashboard(Long userId) {
        DoctorProfile profile = doctorRepository.findByUserId(userId).orElse(null);
        DoctorDashboardResponse r = new DoctorDashboardResponse();
        r.setDoctorId(userId);
        r.setDoctorName(profile != null && profile.getUser() != null ? profile.getUser().getFullName() : "Medical Doctor");
        r.setTotalPatients((int) doctorPatientRepository.countByDoctorUserId(userId));

        var consultations = consultationRepository.findByDoctorUserIdOrderByConsultationDateDesc(userId);
        long todayCount = consultations.stream()
            .filter(c -> java.time.LocalDate.now().equals(c.getConsultationDate()))
            .count();

        r.setConsultationsToday((int) todayCount);
        r.setPendingReports(consultations.size());
        r.setUnreadNotifications((int) notificationRepository.countByUserIdAndReadFalse(userId));
        return r;
    }
}
