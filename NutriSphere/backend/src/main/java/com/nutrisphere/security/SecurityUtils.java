package com.nutrisphere.security;

import com.nutrisphere.assignment.DoctorPatientRepository;
import com.nutrisphere.assignment.DietitianPatientRepository;
import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
    private final DoctorPatientRepository doctorPatientRepository;
    private final DietitianPatientRepository dietitianPatientRepository;

    public SecurityUtils(DoctorPatientRepository doctorPatientRepository,
                         DietitianPatientRepository dietitianPatientRepository) {
        this.doctorPatientRepository = doctorPatientRepository;
        this.dietitianPatientRepository = dietitianPatientRepository;
    }

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails ud) {
            return ud.getUser();
        }
        throw new com.nutrisphere.exception.UnauthorizedException("Not authenticated");
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public boolean isCurrentUser(Long userId) {
        return getCurrentUserId().equals(userId);
    }

    public boolean hasRole(String roleName) {
        return getCurrentUser().getRole().name().equals(roleName);
    }

    /**
     * Enforces object-level clinical access.
     * Patients may access only themselves. Doctors and dietitians may access
     * only actively assigned patients. Admins are allowed for operational support.
     */
    public void assertPatientAccess(Long patientUserId) {
        if (patientUserId == null) {
            throw new ForbiddenException("Patient is required");
        }

        Long currentUserId = getCurrentUserId();

        if (hasRole("ADMIN")) {
            return;
        }

        if (hasRole("PATIENT")) {
            if (!currentUserId.equals(patientUserId)) {
                throw new ForbiddenException("Cannot access another patient's clinical data");
            }
            return;
        }

        if (hasRole("DOCTOR")) {
            if (!doctorPatientRepository.findByDoctorUserIdAndPatientUserId(currentUserId, patientUserId)
                    .filter(a -> a.isActive())
                    .isPresent()) {
                throw new ForbiddenException("Patient is not assigned to this doctor");
            }
            return;
        }

        if (hasRole("DIETITIAN")) {
            if (!dietitianPatientRepository.findByDietitianUserIdAndPatientUserId(currentUserId, patientUserId)
                    .filter(a -> a.isActive())
                    .isPresent()) {
                throw new ForbiddenException("Patient is not assigned to this dietitian");
            }
            return;
        }

        throw new ForbiddenException("Role is not permitted to access clinical patient data");
    }
}
