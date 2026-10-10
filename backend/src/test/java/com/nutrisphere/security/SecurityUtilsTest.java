package com.nutrisphere.security;

import com.nutrisphere.assignment.DoctorPatient;
import com.nutrisphere.assignment.DoctorPatientRepository;
import com.nutrisphere.assignment.DietitianPatient;
import com.nutrisphere.assignment.DietitianPatientRepository;
import com.nutrisphere.common.enums.Status;
import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.user.Role;
import com.nutrisphere.user.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SecurityUtilsTest {

    @Mock
    private DoctorPatientRepository doctorPatientRepository;

    @Mock
    private DietitianPatientRepository dietitianPatientRepository;

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void patientCanAccessOnlyOwnRecord() {
        User patient = user(10L, Role.PATIENT);
        authenticate(patient);
        SecurityUtils utils = new SecurityUtils(doctorPatientRepository, dietitianPatientRepository);

        assertDoesNotThrow(() -> utils.assertPatientAccess(10L));
        assertThrows(ForbiddenException.class, () -> utils.assertPatientAccess(11L));
    }

    @Test
    void doctorCanAccessAssignedActivePatient() {
        User doctor = user(20L, Role.DOCTOR);
        authenticate(doctor);
        when(doctorPatientRepository.findByDoctorUserIdAndPatientUserId(20L, 30L))
            .thenReturn(Optional.of(DoctorPatient.builder().doctorUserId(20L).patientUserId(30L).active(true).build()));

        SecurityUtils utils = new SecurityUtils(doctorPatientRepository, dietitianPatientRepository);

        assertDoesNotThrow(() -> utils.assertPatientAccess(30L));
    }

    @Test
    void doctorCannotAccessUnassignedOrInactivePatient() {
        User doctor = user(20L, Role.DOCTOR);
        authenticate(doctor);
        when(doctorPatientRepository.findByDoctorUserIdAndPatientUserId(20L, 30L))
            .thenReturn(Optional.of(DoctorPatient.builder().doctorUserId(20L).patientUserId(30L).active(false).build()));

        SecurityUtils utils = new SecurityUtils(doctorPatientRepository, dietitianPatientRepository);

        assertThrows(ForbiddenException.class, () -> utils.assertPatientAccess(30L));
    }

    @Test
    void dietitianCanAccessAssignedActivePatient() {
        User dietitian = user(40L, Role.DIETITIAN);
        authenticate(dietitian);
        when(dietitianPatientRepository.findByDietitianUserIdAndPatientUserId(40L, 50L))
            .thenReturn(Optional.of(DietitianPatient.builder().dietitianUserId(40L).patientUserId(50L).active(true).build()));

        SecurityUtils utils = new SecurityUtils(doctorPatientRepository, dietitianPatientRepository);

        assertDoesNotThrow(() -> utils.assertPatientAccess(50L));
    }

    @Test
    void untrustedRoleCannotAccessClinicalPatientData() {
        User hotel = user(60L, Role.HOTEL);
        authenticate(hotel);
        SecurityUtils utils = new SecurityUtils(doctorPatientRepository, dietitianPatientRepository);

        assertThrows(ForbiddenException.class, () -> utils.assertPatientAccess(70L));
    }

    @Test
    void unverifiedUserIsDisabled() {
        User user = user(80L, Role.PATIENT);
        user.setEmailVerified(false);
        assertFalse(new CustomUserDetails(user).isEnabled());

        user.setEmailVerified(true);
        assertTrue(new CustomUserDetails(user).isEnabled());

        user.setStatus(Status.SUSPENDED);
        assertFalse(new CustomUserDetails(user).isEnabled());
    }

    private void authenticate(User user) {
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(
                new CustomUserDetails(user), null, new CustomUserDetails(user).getAuthorities()));
    }

    private User user(Long id, Role role) {
        User user = User.builder()
            .email(id + "@example.com")
            .passwordHash("hash")
            .firstName("Test")
            .lastName("User")
            .role(role)
            .status(Status.ACTIVE)
            .emailVerified(true)
            .build();
        user.setId(id);
        return user;
    }
}
