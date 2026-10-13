package com.nutrisphere.nutrition.logging;

import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanMeal;
import com.nutrisphere.nutrition.dietplan.DietPlanMealRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import com.nutrisphere.nutrition.logging.dto.FoodLogRequest;
import com.nutrisphere.nutrition.logging.dto.FoodLogResponse;
import com.nutrisphere.nutrition.logging.dto.MealDeviationRequest;
import com.nutrisphere.nutrition.logging.dto.PlannedVsActualResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FoodLogServiceTest {

    @Mock
    private FoodLogRepository logRepo;
    @Mock
    private MealDeviationRepository deviationRepo;
    @Mock
    private DietPlanRepository planRepo;
    @Mock
    private DietPlanMealRepository mealRepo;

    private FoodLogService service;

    @BeforeEach
    void setUp() {
        service = new FoodLogService(logRepo, deviationRepo, planRepo, mealRepo);
    }

    @Test
    void logFood_MealBelongsToAnotherPatient_ThrowsForbidden() {
        DietPlan plan = DietPlan.builder().patientUserId(99L).build();
        DietPlanMeal meal = DietPlanMeal.builder().dietPlan(plan).build();

        when(mealRepo.findById(50L)).thenReturn(Optional.of(meal));

        FoodLogRequest req = new FoodLogRequest();
        req.setDietPlanMealId(50L);
        req.setFoodName("Apple");

        assertThrows(ForbiddenException.class, () -> service.logFood(10L, req));
    }

    @Test
    void logFood_Success() {
        FoodLogRequest req = new FoodLogRequest();
        req.setFoodName("Chicken Breast");
        req.setCalories(165.0);
        req.setProteinG(31.0);
        req.setLogDate(LocalDate.now());

        FoodLog saved = FoodLog.builder()
            .patientUserId(10L)
            .foodName("Chicken Breast")
            .calories(165.0)
            .proteinG(31.0)
            .logDate(LocalDate.now())
            .build();
        saved.setId(1L);

        when(logRepo.save(any(FoodLog.class))).thenReturn(saved);

        FoodLogResponse res = service.logFood(10L, req);
        assertEquals(1L, res.getId());
        assertEquals("Chicken Breast", res.getFoodName());
    }

    @Test
    void recordDeviation_Success() {
        MealDeviationRequest req = new MealDeviationRequest();
        req.setDeviationDate(LocalDate.now());
        req.setReason("Eating out");
        req.setActualFood("Burger");

        service.recordDeviation(10L, req);
        verify(deviationRepo).save(any(MealDeviation.class));
    }

    @Test
    void getPlannedVsActual_CalculatesAdherence() {
        LocalDate date = LocalDate.now();

        FoodLog l1 = FoodLog.builder().calories(500.0).proteinG(30.0).carbsG(50.0).fatG(20.0).build();
        FoodLog l2 = FoodLog.builder().calories(1000.0).proteinG(50.0).carbsG(100.0).fatG(40.0).build();

        DietPlan plan = DietPlan.builder()
            .targetCalories(2000.0)
            .targetProteinG(120.0)
            .targetCarbsG(200.0)
            .targetFatG(65.0)
            .build();

        when(logRepo.findByPatientUserIdAndLogDateOrderByLogTime(10L, date)).thenReturn(List.of(l1, l2));
        when(planRepo.findByPatientUserIdAndStatus(10L, DietPlanStatus.APPROVED)).thenReturn(Optional.of(plan));

        PlannedVsActualResponse res = service.getPlannedVsActual(10L, date);

        assertEquals(1500.0, res.getActualCalories());
        assertEquals(80.0, res.getActualProteinG());
        assertEquals(2000.0, res.getPlannedCalories());
        // 1500 / 2000 * 100 = 75%
        assertEquals(75.0, res.getAdherencePercent());
    }
}
