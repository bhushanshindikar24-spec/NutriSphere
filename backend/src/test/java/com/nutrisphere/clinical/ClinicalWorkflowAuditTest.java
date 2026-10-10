package com.nutrisphere.clinical;

import com.nutrisphere.admin.AdminService;
import com.nutrisphere.assignment.AssignmentService;
import com.nutrisphere.assignment.DietitianPatient;
import com.nutrisphere.assignment.DietitianPatientRepository;
import com.nutrisphere.assignment.DoctorPatient;
import com.nutrisphere.assignment.DoctorPatientRepository;
import com.nutrisphere.assignment.dto.AssignmentResponse;
import com.nutrisphere.audit.AuditService;
import com.nutrisphere.auth.AuthService;
import com.nutrisphere.auth.LoginRequest;
import com.nutrisphere.auth.RegisterRequest;
import com.nutrisphere.common.enums.Status;
import com.nutrisphere.dietitian.DietitianProfile;
import com.nutrisphere.dietitian.DietitianRepository;
import com.nutrisphere.dietitian.DietitianService;
import com.nutrisphere.dietitian.dto.DietitianDashboardResponse;
import com.nutrisphere.doctor.DoctorProfile;
import com.nutrisphere.doctor.DoctorRepository;
import com.nutrisphere.doctor.DoctorService;
import com.nutrisphere.doctor.dto.DoctorDashboardResponse;
import com.nutrisphere.exception.UnauthorizedException;
import com.nutrisphere.hotel.profile.HotelRepository;
import com.nutrisphere.notification.NotificationRepository;
import com.nutrisphere.notification.NotificationService;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import com.nutrisphere.security.JwtService;
import com.nutrisphere.security.SecurityUtils;
import com.nutrisphere.user.Role;
import com.nutrisphere.user.User;
import com.nutrisphere.user.UserMapper;
import com.nutrisphere.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ClinicalWorkflowAuditTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authManager;
    @Mock private UserMapper userMapper;
    @Mock private AuditService auditService;
    @Mock private NotificationService notificationService;
    @Mock private NotificationRepository notificationRepository;
    @Mock private com.nutrisphere.patient.PatientRepository patientRepository;
    @Mock private DoctorRepository doctorRepository;
    @Mock private DietitianRepository dietitianRepository;
    @Mock private HotelRepository hotelRepository;
    @Mock private DoctorPatientRepository doctorPatientRepository;
    @Mock private DietitianPatientRepository dietitianPatientRepository;
    @Mock private DietPlanRepository dietPlanRepository;
    @Mock private SecurityUtils securityUtils;

    private User buildUser(Long id, String email, Role role, Status status) {
        User u = User.builder()
                .email(email)
                .firstName("Test")
                .lastName("User")
                .role(role)
                .status(status)
                .build();
        u.setId(id);
        return u;
    }

    @Test
    @DisplayName("Audit 1: Patient registers with direct ACTIVE status, no pending wait")
    void testPatientDirectActiveRegistration() {
        AuthService authService = new AuthService(
                userRepository, passwordEncoder, jwtService, authManager,
                userMapper, auditService, patientRepository, doctorRepository,
                dietitianRepository, hotelRepository
        );

        RegisterRequest req = new RegisterRequest();
        req.setEmail("patient1@example.com");
        req.setPassword("Password123!");
        req.setFirstName("Jane");
        req.setLastName("Doe");
        req.setRole(Role.PATIENT);

        when(userRepository.existsByEmail("patient1@example.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed_pw");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(101L);
            return u;
        });
        when(jwtService.generateToken(any(), any())).thenReturn("mock_token");
        when(jwtService.generateRefreshToken(any())).thenReturn("mock_refresh");

        var response = authService.register(req);

        assertNotNull(response);
        assertEquals("mock_token", response.getAccessToken());
        verify(userRepository, atLeastOnce()).save(argThat(u -> u.getStatus() == Status.ACTIVE && u.getRole() == Role.PATIENT));
        verify(patientRepository).save(any());
    }

    @Test
    @DisplayName("Audit 2: Doctor and Dietitian register in PENDING status awaiting Admin approval")
    void testProfessionalPendingRegistration() {
        AuthService authService = new AuthService(
                userRepository, passwordEncoder, jwtService, authManager,
                userMapper, auditService, patientRepository, doctorRepository,
                dietitianRepository, hotelRepository
        );

        RegisterRequest docReq = new RegisterRequest();
        docReq.setEmail("doc1@example.com");
        docReq.setPassword("Password123!");
        docReq.setFirstName("Alice");
        docReq.setLastName("Smith");
        docReq.setRole(Role.DOCTOR);
        docReq.setLicenseNumber("MD-99881");
        docReq.setSpecialization("Endocrinology");
        docReq.setLicenseDocumentUrl("http://localhost:8080/uploads/doc1.pdf");

        when(userRepository.existsByEmail("doc1@example.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed_pw");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(201L);
            return u;
        });

        authService.register(docReq);

        verify(userRepository).save(argThat(u -> u.getStatus() == Status.PENDING && u.getRole() == Role.DOCTOR));
        verify(doctorRepository).save(argThat(d -> "MD-99881".equals(d.getLicenseNumber()) && "PENDING".equals(d.getVerificationStatus())));
    }

    @Test
    @DisplayName("Audit 3: Unapproved Doctor cannot login and receives descriptive error")
    void testPendingUserLoginBlocked() {
        AuthService authService = new AuthService(
                userRepository, passwordEncoder, jwtService, authManager,
                userMapper, auditService, patientRepository, doctorRepository,
                dietitianRepository, hotelRepository
        );

        User pendingUser = buildUser(201L, "doc1@example.com", Role.DOCTOR, Status.PENDING);
        when(userRepository.findByEmail("doc1@example.com")).thenReturn(Optional.of(pendingUser));

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("doc1@example.com");
        loginReq.setPassword("Password123!");

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.login(loginReq));
        assertTrue(ex.getMessage().contains("PENDING administrator verification"));
    }

    @Test
    @DisplayName("Audit 4: Admin approves Doctor license and user status becomes ACTIVE")
    void testAdminVerificationApproval() {
        AdminService adminService = new AdminService(
                userRepository, doctorRepository, dietitianRepository,
                hotelRepository, notificationService, auditService
        );

        User doctorUser = buildUser(201L, "doc1@example.com", Role.DOCTOR, Status.PENDING);

        DoctorProfile docProfile = DoctorProfile.builder()
                .user(doctorUser)
                .verificationStatus("PENDING")
                .licenseNumber("MD-99881")
                .build();
        docProfile.setId(1L);

        when(userRepository.findById(201L)).thenReturn(Optional.of(doctorUser));
        when(doctorRepository.findByUserId(201L)).thenReturn(Optional.of(docProfile));

        adminService.approveVerification(201L, 1L);

        assertEquals(Status.ACTIVE, doctorUser.getStatus());
        assertEquals("APPROVED", docProfile.getVerificationStatus());
        verify(userRepository).save(doctorUser);
        verify(doctorRepository).save(docProfile);
        verify(auditService).log(eq(1L), eq("APPROVE_LICENSE"), eq("DOCTOR"), eq(201L), anyString());
    }

    @Test
    @DisplayName("Audit 5: Patient assigns Doctor and Dietitian, verified in database")
    void testPatientProviderAssignment() {
        AssignmentService assignmentService = new AssignmentService(
                doctorPatientRepository, dietitianPatientRepository,
                userRepository, patientRepository
        );

        User patient = buildUser(101L, "jane@test.com", Role.PATIENT, Status.ACTIVE);
        User doctor = buildUser(201L, "doc@test.com", Role.DOCTOR, Status.ACTIVE);

        when(userRepository.findById(101L)).thenReturn(Optional.of(patient));
        when(userRepository.findById(201L)).thenReturn(Optional.of(doctor));
        when(doctorPatientRepository.existsByDoctorUserIdAndPatientUserId(201L, 101L)).thenReturn(false);
        when(doctorPatientRepository.save(any())).thenAnswer(i -> {
            DoctorPatient dp = i.getArgument(0);
            dp.setId(1L);
            return dp;
        });

        AssignmentResponse resp = assignmentService.assignPatientToDoctor(201L, 101L, "Patient chosen from directory");

        assertNotNull(resp);
        assertEquals(101L, resp.getPatientUserId());
        assertEquals(201L, resp.getDoctorUserId());
        assertTrue(resp.isActive());
        verify(doctorPatientRepository).save(any(DoctorPatient.class));
    }

    @Test
    @DisplayName("Audit 6: Dietitian Dashboard live calculations match database counts")
    void testDietitianDashboardLiveMetrics() {
        DietitianService dietitianService = new DietitianService(
                dietitianRepository, userRepository, mock(com.nutrisphere.dietitian.DietitianMapper.class),
                dietitianPatientRepository, dietPlanRepository, notificationRepository
        );

        Long dietitianId = 301L;
        User dietUser = buildUser(dietitianId, "diet@test.com", Role.DIETITIAN, Status.ACTIVE);
        DietitianProfile profile = DietitianProfile.builder().user(dietUser).build();
        profile.setId(1L);

        when(dietitianRepository.findByUserId(dietitianId)).thenReturn(Optional.of(profile));
        when(dietitianPatientRepository.countByDietitianUserId(dietitianId)).thenReturn(5L);

        DietPlan approvedPlan = DietPlan.builder().dietitianUserId(dietitianId).status(DietPlanStatus.APPROVED).build();
        approvedPlan.setId(10L);
        DietPlan pendingPlan = DietPlan.builder().dietitianUserId(dietitianId).status(DietPlanStatus.SUBMITTED).build();
        pendingPlan.setId(11L);

        when(dietPlanRepository.findByDietitianUserIdOrderByCreatedAtDesc(dietitianId)).thenReturn(List.of(approvedPlan, pendingPlan));
        when(notificationRepository.countByUserIdAndReadFalse(dietitianId)).thenReturn(2L);

        DietitianDashboardResponse dash = dietitianService.getDashboard(dietitianId);

        assertNotNull(dash);
        assertEquals(5, dash.getTotalPatients());
        assertEquals(1, dash.getActiveDietPlans());
        assertEquals(1, dash.getPendingReviews());
        assertEquals(2, dash.getUnreadNotifications());
    }

    @Test
    @DisplayName("Audit 7: Doctor Dashboard live calculations match database counts")
    void testDoctorDashboardLiveMetrics() {
        DoctorService doctorService = new DoctorService(
                doctorRepository, userRepository, mock(com.nutrisphere.doctor.DoctorMapper.class),
                doctorPatientRepository, mock(com.nutrisphere.medical.consultation.ConsultationRepository.class),
                notificationRepository
        );

        Long doctorId = 201L;
        User docUser = buildUser(doctorId, "doc@test.com", Role.DOCTOR, Status.ACTIVE);
        DoctorProfile profile = DoctorProfile.builder().user(docUser).build();
        profile.setId(1L);

        when(doctorRepository.findByUserId(doctorId)).thenReturn(Optional.of(profile));
        when(doctorPatientRepository.countByDoctorUserId(doctorId)).thenReturn(8L);
        when(notificationRepository.countByUserIdAndReadFalse(doctorId)).thenReturn(3L);

        DoctorDashboardResponse dash = doctorService.getDashboard(doctorId);

        assertNotNull(dash);
        assertEquals(8, dash.getTotalPatients());
        assertEquals(3, dash.getUnreadNotifications());
    }
}
