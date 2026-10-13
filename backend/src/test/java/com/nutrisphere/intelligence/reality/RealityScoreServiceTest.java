package com.nutrisphere.intelligence.reality;

import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.intelligence.adherence.AdherenceBarrierRepository;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import com.nutrisphere.nutrition.logging.FoodLog;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RealityScoreServiceTest {

    @Mock
    private RealityScoreRepository repo;
    @Mock
    private AdherenceBarrierRepository barrierRepo;
    @Mock
    private FoodLogRepository logRepo;
    @Mock
    private DietPlanRepository planRepo;

    private RealityScoreService service;

    @BeforeEach
    void setUp() {
        service = new RealityScoreService(repo, barrierRepo, logRepo, planRepo);
    }

    @Test
    void assertDietPlanBelongsToPatient_ValidatesOwnership() {
        DietPlan plan = DietPlan.builder().patientUserId(20L).build();
        when(planRepo.findById(1L)).thenReturn(Optional.of(plan));

        assertThrows(ForbiddenException.class, () -> service.assertDietPlanBelongsToPatient(1L, 10L));
        assertDoesNotThrow(() -> service.assertDietPlanBelongsToPatient(1L, 20L));
    }

    @Test
    void calculateAndSave_ComputesSixDimensionsAndWeightedOverall() {
        Long patientId = 10L;
        Long planId = 1L;

        List<Object[]> barriers = new ArrayList<>();
        barriers.add(new Object[]{"FOOD_UNAVAILABLE", 1L});
        barriers.add(new Object[]{"COST", 1L});
        barriers.add(new Object[]{"COOKING_PROBLEM", 1L});
        when(barrierRepo.countByBarrierType(patientId)).thenReturn(barriers);

        DietPlan plan = DietPlan.builder()
            .patientUserId(patientId)
            .targetCalories(2000.0)
            .status(DietPlanStatus.APPROVED)
            .build();
        when(planRepo.findById(planId)).thenReturn(Optional.of(plan));

        FoodLog log = FoodLog.builder().calories(1800.0).build();
        when(logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(eq(patientId), any(), any()))
            .thenReturn(List.of(log));

        when(repo.save(any(RealityScore.class))).thenAnswer(i -> i.getArgument(0));

        RealityScoreResult result = service.calculateAndSave(patientId, planId);

        assertNotNull(result);
        assertEquals(patientId, result.getPatientUserId());
        assertEquals(planId, result.getDietPlanId());
        assertTrue(result.getOverallScore() > 0);
        assertNotNull(result.getDimensionScores());
        assertEquals(6, result.getDimensionScores().size());
        assertTrue(result.getDimensionScores().containsKey("Food Availability"));
        assertTrue(result.getDimensionScores().containsKey("Affordability"));
        assertTrue(result.getDimensionScores().containsKey("Cooking Complexity"));
        assertTrue(result.getDimensionScores().containsKey("Preference"));
        assertTrue(result.getDimensionScores().containsKey("Schedule"));
        assertTrue(result.getDimensionScores().containsKey("Historical Adherence"));
        assertNotNull(result.getInterpretation());
    }

    @Test
    void calculateAndSave_NoBarriers_ReturnsDefaultNeutralScores() {
        Long patientId = 10L;
        when(barrierRepo.countByBarrierType(patientId)).thenReturn(List.of());

        DietPlan plan = DietPlan.builder()
            .patientUserId(patientId)
            .targetCalories(2000.0)
            .build();
        when(planRepo.findByPatientUserIdAndStatus(patientId, DietPlanStatus.APPROVED)).thenReturn(Optional.of(plan));

        FoodLog log = FoodLog.builder().calories(14000.0).build(); // 2000 * 7 = 14000 -> 100% adherence
        when(logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(eq(patientId), any(), any()))
            .thenReturn(List.of(log));

        when(repo.save(any(RealityScore.class))).thenAnswer(i -> i.getArgument(0));

        RealityScoreResult result = service.calculateAndSave(patientId, null);

        assertNotNull(result);
        assertTrue(result.getOverallScore() >= 75.0);
        assertEquals("Moderate Feasibility", result.getInterpretation());
    }
}
