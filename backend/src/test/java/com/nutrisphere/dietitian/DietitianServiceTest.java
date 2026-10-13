package com.nutrisphere.dietitian;

import com.nutrisphere.assignment.DietitianPatient;
import com.nutrisphere.assignment.DietitianPatientRepository;
import com.nutrisphere.common.enums.Status;
import com.nutrisphere.dietitian.dto.DietitianDashboardResponse;
import com.nutrisphere.dietitian.dto.DietitianProfileRequest;
import com.nutrisphere.dietitian.dto.DietitianProfileResponse;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.notification.NotificationRepository;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import com.nutrisphere.user.User;
import com.nutrisphere.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DietitianServiceTest {

    @Mock
    private DietitianRepository dietitianRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private DietitianMapper dietitianMapper;
    @Mock
    private DietitianPatientRepository dietitianPatientRepository;
    @Mock
    private DietPlanRepository dietPlanRepository;
    @Mock
    private NotificationRepository notificationRepository;

    private DietitianService service;

    @BeforeEach
    void setUp() {
        service = new DietitianService(
            dietitianRepository,
            userRepository,
            dietitianMapper,
            dietitianPatientRepository,
            dietPlanRepository,
            notificationRepository
        );
    }

    @Test
    void getProfile_ReturnsResponse() {
        DietitianProfile profile = new DietitianProfile();
        when(dietitianRepository.findByUserId(10L)).thenReturn(Optional.of(profile));
        when(dietitianMapper.toResponse(profile)).thenReturn(new DietitianProfileResponse());

        assertNotNull(service.getProfile(10L));
    }

    @Test
    void updateProfile_Success() {
        User user = User.builder().build();
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(dietitianRepository.findByUserId(10L)).thenReturn(Optional.of(new DietitianProfile()));
        when(dietitianRepository.save(any(DietitianProfile.class))).thenAnswer(i -> i.getArgument(0));
        when(dietitianMapper.toResponse(any(DietitianProfile.class))).thenReturn(new DietitianProfileResponse());

        DietitianProfileRequest req = new DietitianProfileRequest();
        req.setClinicName("NutriWellness");

        assertNotNull(service.updateProfile(10L, req));
        verify(dietitianRepository).save(any(DietitianProfile.class));
    }

    @Test
    void getDietitianDirectory_FiltersActiveOnly() {
        User activeUser = User.builder().status(Status.ACTIVE).build();
        User pendingUser = User.builder().status(Status.PENDING).build();

        DietitianProfile activeDiet = DietitianProfile.builder().user(activeUser).build();
        DietitianProfile pendingDiet = DietitianProfile.builder().user(pendingUser).build();

        when(dietitianRepository.findAll()).thenReturn(List.of(activeDiet, pendingDiet));
        when(dietitianMapper.toResponse(activeDiet)).thenReturn(new DietitianProfileResponse());

        List<DietitianProfileResponse> list = service.getDietitianDirectory();
        assertEquals(1, list.size());
    }

    @Test
    void getDietitianById_NotFound_ThrowsException() {
        when(dietitianRepository.findByUserId(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getDietitianById(999L));
    }

    @Test
    void getDashboard_CalculatesMetrics() {
        User user = User.builder().firstName("Dietitian").lastName("Joy").build();
        DietitianProfile profile = DietitianProfile.builder().user(user).build();
        when(dietitianRepository.findByUserId(10L)).thenReturn(Optional.of(profile));
        when(dietitianPatientRepository.countByDietitianUserId(10L)).thenReturn(8L);
        when(dietitianPatientRepository.findByDietitianUserIdAndActiveTrue(10L)).thenReturn(List.of());

        DietPlan p1 = DietPlan.builder().status(DietPlanStatus.APPROVED).build();
        DietPlan p2 = DietPlan.builder().status(DietPlanStatus.SUBMITTED).build();
        when(dietPlanRepository.findByDietitianUserIdOrderByCreatedAtDesc(10L)).thenReturn(List.of(p1, p2));
        when(notificationRepository.countByUserIdAndReadFalse(10L)).thenReturn(2L);

        DietitianDashboardResponse dash = service.getDashboard(10L);

        assertEquals(10L, dash.getDietitianId());
        assertEquals(8, dash.getTotalPatients());
        assertEquals(1, dash.getActiveDietPlans());
        assertEquals(1, dash.getPendingReviews());
        assertEquals(2, dash.getUnreadNotifications());
    }
}
