package com.nutrisphere.nutrition.dietplan;

import com.nutrisphere.exception.BadRequestException;
import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.notification.NotificationService;
import com.nutrisphere.nutrition.dietplan.dto.*;
import com.nutrisphere.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DietPlanServiceTest {

    @Mock
    private DietPlanRepository planRepo;
    @Mock
    private DietPlanMealRepository mealRepo;
    @Mock
    private MealItemRepository itemRepo;
    @Mock
    private UserRepository userRepo;
    @Mock
    private NotificationService notifService;

    private DietPlanService service;

    @BeforeEach
    void setUp() {
        service = new DietPlanService(planRepo, mealRepo, itemRepo, userRepo, notifService);
    }

    @Test
    void createPlan_WithMeals_Success() {
        DietPlanRequest req = new DietPlanRequest();
        req.setPatientUserId(10L);
        req.setTitle("Cardio Plan");
        req.setTargetCalories(1800.0);
        req.setStatus("APPROVED");

        DietPlanRequest.MealItemDto mealDto = new DietPlanRequest.MealItemDto();
        mealDto.setMealType("BREAKFAST");
        mealDto.setDescription("Oatmeal & fruits");
        mealDto.setTargetCalories(400.0);
        req.setMeals(List.of(mealDto));

        DietPlan savedPlan = DietPlan.builder()
            .patientUserId(10L)
            .dietitianUserId(5L)
            .title("Cardio Plan")
            .targetCalories(1800.0)
            .status(DietPlanStatus.APPROVED)
            .build();
        savedPlan.setId(100L);

        DietPlanMeal savedMeal = DietPlanMeal.builder()
            .dietPlan(savedPlan)
            .mealType("BREAKFAST")
            .build();
        savedMeal.setId(200L);

        when(planRepo.save(any(DietPlan.class))).thenReturn(savedPlan);
        when(mealRepo.save(any(DietPlanMeal.class))).thenReturn(savedMeal);
        when(mealRepo.findByDietPlanIdOrderBySortOrder(100L)).thenReturn(List.of(savedMeal));

        DietPlanResponse response = service.createPlan(5L, req);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Cardio Plan", response.getTitle());
        verify(planRepo).save(any(DietPlan.class));
        verify(mealRepo).save(any(DietPlanMeal.class));
        verify(itemRepo).save(any(MealItem.class));
    }

    @Test
    void approvePlan_Success() {
        DietPlan plan = DietPlan.builder()
            .patientUserId(10L)
            .dietitianUserId(5L)
            .title("Diet Plan")
            .status(DietPlanStatus.SUBMITTED)
            .build();
        plan.setId(50L);

        when(planRepo.findById(50L)).thenReturn(Optional.of(plan));
        when(planRepo.save(plan)).thenReturn(plan);

        PlanApprovalRequest approvalReq = new PlanApprovalRequest();
        approvalReq.setApproved(true);
        approvalReq.setNotes("Looks great");

        DietPlanResponse res = service.approvePlan(50L, 5L, approvalReq);

        assertEquals(DietPlanStatus.APPROVED, res.getStatus());
        verify(notifService).send(eq(10L), any(), anyString(), anyString());
    }

    @Test
    void approvePlan_UnauthorizedDietitian_ThrowsForbidden() {
        DietPlan plan = DietPlan.builder()
            .patientUserId(10L)
            .dietitianUserId(5L)
            .build();
        plan.setId(50L);

        when(planRepo.findById(50L)).thenReturn(Optional.of(plan));

        assertThrows(ForbiddenException.class, () -> service.approvePlan(50L, 999L, new PlanApprovalRequest()));
    }

    @Test
    void updatePlan_ApprovedPlanIsImmutable_ThrowsBadRequestException() {
        DietPlan plan = DietPlan.builder()
            .patientUserId(10L)
            .dietitianUserId(5L)
            .status(DietPlanStatus.APPROVED)
            .build();
        plan.setId(50L);

        when(planRepo.findById(50L)).thenReturn(Optional.of(plan));

        DietPlanRequest updateReq = new DietPlanRequest();
        updateReq.setTitle("New Title");

        BadRequestException ex = assertThrows(BadRequestException.class,
            () -> service.updatePlan(50L, 5L, updateReq));
        assertTrue(ex.getMessage().contains("immutable"));
    }

    @Test
    void updatePlan_NotOwner_ThrowsForbiddenException() {
        DietPlan plan = DietPlan.builder()
            .dietitianUserId(5L)
            .status(DietPlanStatus.SUBMITTED)
            .build();
        when(planRepo.findById(50L)).thenReturn(Optional.of(plan));

        assertThrows(ForbiddenException.class, () -> service.updatePlan(50L, 999L, new DietPlanRequest()));
    }

    @Test
    void deleteMeal_ValidatesOwnershipAndPlanMatching() {
        DietPlan plan = DietPlan.builder().dietitianUserId(5L).build();
        plan.setId(10L);

        DietPlan otherPlan = DietPlan.builder().dietitianUserId(5L).build();
        otherPlan.setId(99L);

        DietPlanMeal mealMismatched = DietPlanMeal.builder().dietPlan(otherPlan).build();
        mealMismatched.setId(100L);

        when(planRepo.findById(10L)).thenReturn(Optional.of(plan));
        when(mealRepo.findById(100L)).thenReturn(Optional.of(mealMismatched));

        assertThrows(ForbiddenException.class, () -> service.deleteMeal(10L, 100L, 5L));

        // When meal belongs to plan
        DietPlanMeal correctMeal = DietPlanMeal.builder().dietPlan(plan).build();
        correctMeal.setId(200L);
        when(mealRepo.findById(200L)).thenReturn(Optional.of(correctMeal));

        service.deleteMeal(10L, 200L, 5L);
        verify(itemRepo).deleteByDietPlanMealId(200L);
        verify(mealRepo).delete(correctMeal);
    }
}
