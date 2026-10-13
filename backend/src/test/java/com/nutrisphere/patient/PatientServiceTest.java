package com.nutrisphere.patient;

import com.nutrisphere.assignment.DietitianPatient;
import com.nutrisphere.assignment.DietitianPatientRepository;
import com.nutrisphere.assignment.DoctorPatient;
import com.nutrisphere.assignment.DoctorPatientRepository;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.notification.NotificationRepository;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import com.nutrisphere.nutrition.hydration.WaterLogRepository;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import com.nutrisphere.patient.dto.PatientDashboardResponse;
import com.nutrisphere.patient.dto.PatientProfileRequest;
import com.nutrisphere.patient.dto.PatientProfileResponse;
import com.nutrisphere.user.User;
import com.nutrisphere.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PatientMapper patientMapper;
    @Mock
    private FoodLogRepository foodLogRepository;
    @Mock
    private WaterLogRepository waterLogRepository;
    @Mock
    private DietPlanRepository dietPlanRepository;
    @Mock
    private NotificationRepository notificationRepository;
    @Mock
    private DoctorPatientRepository doctorPatientRepository;
    @Mock
    private DietitianPatientRepository dietitianPatientRepository;

    private PatientService service;

    @BeforeEach
    void setUp() {
        service = new PatientService(
            patientRepository,
            userRepository,
            patientMapper,
            foodLogRepository,
            waterLogRepository,
            dietPlanRepository,
            notificationRepository,
            doctorPatientRepository,
            dietitianPatientRepository
        );
    }

    @Test
    void getProfile_ReturnsProfile() {
        PatientProfile profile = new PatientProfile();
        when(patientRepository.findByUserId(10L)).thenReturn(Optional.of(profile));
        when(patientMapper.toResponse(profile)).thenReturn(new PatientProfileResponse());

        PatientProfileResponse res = service.getProfile(10L);
        assertNotNull(res);
    }

    @Test
    void getProfileByPatientId_ThrowsNotFoundWhenMissing() {
        when(patientRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getProfileByPatientId(999L));
    }

    @Test
    void updateProfile_Success() {
        User user = User.builder().firstName("John").build();
        user.setId(10L);

        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(patientRepository.findByUserId(10L)).thenReturn(Optional.of(new PatientProfile()));
        when(patientRepository.save(any(PatientProfile.class))).thenAnswer(i -> i.getArgument(0));
        when(patientMapper.toResponse(any(PatientProfile.class))).thenReturn(new PatientProfileResponse());

        PatientProfileRequest req = new PatientProfileRequest();
        req.setHeightCm(175.0);
        req.setWeightKg(70.0);

        PatientProfileResponse res = service.updateProfile(10L, req);
        assertNotNull(res);
        verify(patientRepository).save(any(PatientProfile.class));
    }

    @Test
    void getDashboard_WithDietPlanAndAssignments() {
        User patientUser = User.builder().firstName("Patient").lastName("One").build();
        PatientProfile profile = PatientProfile.builder().user(patientUser).build();
        when(patientRepository.findByUserId(10L)).thenReturn(Optional.of(profile));

        LocalDate today = LocalDate.now();
        when(foodLogRepository.sumCaloriesForDate(10L, today)).thenReturn(1800.0);
        when(waterLogRepository.sumAmountForDate(10L, today)).thenReturn(2000.0);

        DietPlan plan = DietPlan.builder()
            .targetCalories(2000.0)
            .targetWaterMl(2500.0)
            .build();
        when(dietPlanRepository.findByPatientUserIdAndStatus(10L, DietPlanStatus.APPROVED))
            .thenReturn(Optional.of(plan));

        User doctor = User.builder().firstName("Gregory").lastName("House").build();
        DoctorPatient docAssignment = DoctorPatient.builder().doctorUserId(50L).build();
        when(doctorPatientRepository.findByPatientUserIdAndActiveTrue(10L)).thenReturn(List.of(docAssignment));
        when(userRepository.findById(50L)).thenReturn(Optional.of(doctor));

        User dietitian = User.builder().firstName("Sarah").lastName("Connor").build();
        DietitianPatient dietAssignment = DietitianPatient.builder().dietitianUserId(60L).build();
        when(dietitianPatientRepository.findByPatientUserIdAndActiveTrue(10L)).thenReturn(List.of(dietAssignment));
        when(userRepository.findById(60L)).thenReturn(Optional.of(dietitian));

        when(notificationRepository.countByUserIdAndReadFalse(10L)).thenReturn(3L);

        PatientDashboardResponse dash = service.getDashboard(10L);

        assertEquals(10L, dash.getPatientId());
        assertTrue(dash.isHasDietPlan());
        assertEquals(1800.0, dash.getTodayCalories());
        assertEquals(2.0, dash.getHydrationLiters());
        assertEquals("Dr. Gregory House", dash.getDoctorName());
        assertEquals("Sarah Connor", dash.getDietitianName());
        assertEquals(3, dash.getUnreadNotifications());
        assertTrue(dash.getAdherenceScore() > 0);
    }
}
