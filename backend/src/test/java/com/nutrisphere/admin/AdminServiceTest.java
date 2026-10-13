package com.nutrisphere.admin;

import com.nutrisphere.admin.dto.PendingVerificationDto;
import com.nutrisphere.audit.AuditService;
import com.nutrisphere.common.enums.Status;
import com.nutrisphere.dietitian.DietitianProfile;
import com.nutrisphere.dietitian.DietitianRepository;
import com.nutrisphere.doctor.DoctorProfile;
import com.nutrisphere.doctor.DoctorRepository;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.hotel.profile.HotelProfile;
import com.nutrisphere.hotel.profile.HotelRepository;
import com.nutrisphere.notification.NotificationService;
import com.nutrisphere.user.Role;
import com.nutrisphere.user.User;
import com.nutrisphere.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private DoctorRepository doctorRepository;
    @Mock
    private DietitianRepository dietitianRepository;
    @Mock
    private HotelRepository hotelRepository;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AuditService auditService;

    private AdminService adminService;

    @BeforeEach
    void setUp() {
        adminService = new AdminService(
            userRepository,
            doctorRepository,
            dietitianRepository,
            hotelRepository,
            notificationService,
            auditService
        );
    }

    @Test
    void getPendingVerifications_ReturnsPendingUsersForDoctorsDietitiansHotels() {
        User docUser = User.builder().firstName("John").lastName("Doctor").email("doc@nutri.com")
            .role(Role.DOCTOR).status(Status.PENDING).build();
        docUser.setId(1L);

        User dietUser = User.builder().firstName("Jane").lastName("Dietitian").email("diet@nutri.com")
            .role(Role.DIETITIAN).status(Status.PENDING).build();
        dietUser.setId(2L);

        User hotelUser = User.builder().firstName("Bob").lastName("Kitchen").email("kitchen@nutri.com")
            .role(Role.HOTEL).status(Status.PENDING).build();
        hotelUser.setId(3L);

        User activeUser = User.builder().role(Role.PATIENT).status(Status.ACTIVE).build();
        activeUser.setId(4L);

        when(userRepository.findAll()).thenReturn(List.of(docUser, dietUser, hotelUser, activeUser));

        DoctorProfile docProfile = DoctorProfile.builder().licenseNumber("MD-123").specialization("Endocrinology").build();
        when(doctorRepository.findByUserId(1L)).thenReturn(Optional.of(docProfile));

        DietitianProfile dietProfile = DietitianProfile.builder().licenseNumber("RD-456").clinicName("HealthyLife").build();
        when(dietitianRepository.findByUserId(2L)).thenReturn(Optional.of(dietProfile));

        HotelProfile hotelProfile = HotelProfile.builder().hotelName("Healthy Kitchen").cuisineType("Therapeutic").build();
        when(hotelRepository.findByUserId(3L)).thenReturn(Optional.of(hotelProfile));

        List<PendingVerificationDto> result = adminService.getPendingVerifications();

        assertEquals(3, result.size());
        assertEquals("MD-123", result.get(0).getLicenseNumber());
        assertEquals("RD-456", result.get(1).getLicenseNumber());
        assertEquals("Healthy Kitchen", result.get(2).getOrganizationName());
    }

    @Test
    void approveVerification_Doctor_Success() {
        User user = User.builder().email("doc@nutri.com").role(Role.DOCTOR).status(Status.PENDING).build();
        user.setId(10L);

        DoctorProfile profile = DoctorProfile.builder().verificationStatus("PENDING").build();

        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(doctorRepository.findByUserId(10L)).thenReturn(Optional.of(profile));

        adminService.approveVerification(10L, 999L);

        assertEquals(Status.ACTIVE, user.getStatus());
        assertTrue(user.isEmailVerified());
        assertEquals("APPROVED", profile.getVerificationStatus());
        verify(userRepository).save(user);
        verify(doctorRepository).save(profile);
        verify(auditService).log(eq(999L), eq("APPROVE_LICENSE"), eq("DOCTOR"), eq(10L), anyString());
        verify(notificationService).createNotification(eq(10L), eq("GENERAL"), anyString(), anyString(), eq(10L));
    }

    @Test
    void approveVerification_Hotel_Success() {
        User user = User.builder().email("hotel@nutri.com").role(Role.HOTEL).status(Status.PENDING).build();
        user.setId(20L);

        HotelProfile profile = HotelProfile.builder().verificationStatus("PENDING").active(false).build();

        when(userRepository.findById(20L)).thenReturn(Optional.of(user));
        when(hotelRepository.findByUserId(20L)).thenReturn(Optional.of(profile));

        adminService.approveVerification(20L, 999L);

        assertEquals(Status.ACTIVE, user.getStatus());
        assertEquals("APPROVED", profile.getVerificationStatus());
        assertTrue(profile.isActive());
        verify(hotelRepository).save(profile);
    }

    @Test
    void approveVerification_Dietitian_Success() {
        User user = User.builder().email("diet@nutri.com").role(Role.DIETITIAN).status(Status.PENDING).build();
        user.setId(30L);

        DietitianProfile profile = DietitianProfile.builder().verificationStatus("PENDING").build();

        when(userRepository.findById(30L)).thenReturn(Optional.of(user));
        when(dietitianRepository.findByUserId(30L)).thenReturn(Optional.of(profile));

        adminService.approveVerification(30L, 999L);

        assertEquals(Status.ACTIVE, user.getStatus());
        assertEquals("APPROVED", profile.getVerificationStatus());
        verify(dietitianRepository).save(profile);
    }

    @Test
    void approveVerification_UserNotFound_ThrowsException() {
        when(userRepository.findById(404L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> adminService.approveVerification(404L, 999L));
    }

    @Test
    void rejectVerification_Success() {
        User user = User.builder().email("doc@nutri.com").role(Role.DOCTOR).status(Status.PENDING).build();
        user.setId(10L);
        DoctorProfile profile = DoctorProfile.builder().verificationStatus("PENDING").build();

        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(doctorRepository.findByUserId(10L)).thenReturn(Optional.of(profile));

        adminService.rejectVerification(10L, "Invalid medical license", 999L);

        assertEquals(Status.SUSPENDED, user.getStatus());
        assertEquals("REJECTED", profile.getVerificationStatus());
        verify(userRepository).save(user);
        verify(doctorRepository).save(profile);
        verify(auditService).log(eq(999L), eq("REJECT_LICENSE"), eq("DOCTOR"), eq(10L), contains("Invalid medical license"));
    }

    @Test
    void getSystemStats_AggregatesCountsCorrectly() {
        User u1 = User.builder().role(Role.DOCTOR).status(Status.ACTIVE).build();
        User u2 = User.builder().role(Role.DIETITIAN).status(Status.ACTIVE).build();
        User u3 = User.builder().role(Role.PATIENT).status(Status.ACTIVE).build();
        User u4 = User.builder().role(Role.HOTEL).status(Status.ACTIVE).build();
        User u5 = User.builder().role(Role.DOCTOR).status(Status.PENDING).build();

        when(userRepository.findAll()).thenReturn(List.of(u1, u2, u3, u4, u5));

        Map<String, Object> stats = adminService.getSystemStats();

        assertEquals(5, stats.get("totalUsers"));
        assertEquals(1L, stats.get("pendingVerifications"));
        assertEquals(1L, stats.get("activeDoctors"));
        assertEquals(1L, stats.get("activeDietitians"));
        assertEquals(1L, stats.get("activePatients"));
        assertEquals(1L, stats.get("activeKitchens"));
    }

    @Test
    void getAllUsers_ReturnsFormattedMaps() {
        User u = User.builder().firstName("Alice").lastName("Smith").email("alice@test.com")
            .role(Role.PATIENT).status(Status.ACTIVE).emailVerified(true).build();
        u.setId(1L);

        when(userRepository.findAll()).thenReturn(List.of(u));

        List<Map<String, Object>> result = adminService.getAllUsers();
        assertEquals(1, result.size());
        assertEquals("alice@test.com", result.get(0).get("email"));
        assertEquals("PATIENT", result.get(0).get("role"));
        assertEquals("ACTIVE", result.get(0).get("status"));
    }
}
