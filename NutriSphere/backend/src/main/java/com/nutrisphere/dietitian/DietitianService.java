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

    public DietitianDashboardResponse getDashboard(Long userId) {
        DietitianProfile profile = dietitianRepository.findByUserId(userId).orElse(null);
        DietitianDashboardResponse r = new DietitianDashboardResponse();
        r.setDietitianId(userId);
        r.setDietitianName(profile != null ? profile.getUser().getFullName() : "");
        r.setTotalPatients((int) dietitianPatientRepository.countByDietitianUserId(userId));
        r.setActiveDietPlans(0);
        r.setPendingReviews(0);
        r.setUnreadNotifications(0);
        return r;
    }
}
