package com.nutrisphere.intelligence.adherence;

import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanMeal;
import com.nutrisphere.nutrition.dietplan.DietPlanMealRepository;
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
class AdherenceServiceTest {

    @Mock
    private AdherenceBarrierRepository barrierRepo;
    @Mock
    private DietPlanMealRepository mealRepo;

    private AdherenceService service;

    @BeforeEach
    void setUp() {
        service = new AdherenceService(barrierRepo, mealRepo);
    }

    @Test
    void recordBarrier_MealOwnershipCheck() {
        DietPlan otherPlan = DietPlan.builder().patientUserId(99L).build();
        DietPlanMeal meal = DietPlanMeal.builder().dietPlan(otherPlan).build();
        when(mealRepo.findById(50L)).thenReturn(Optional.of(meal));

        assertThrows(ForbiddenException.class, () ->
            service.recordBarrier(10L, "TIME_CONSTRAINT", LocalDate.now(), "LUNCH", "Too busy", 50L));

        DietPlan ownPlan = DietPlan.builder().patientUserId(10L).build();
        DietPlanMeal ownMeal = DietPlanMeal.builder().dietPlan(ownPlan).build();
        when(mealRepo.findById(60L)).thenReturn(Optional.of(ownMeal));
        when(barrierRepo.save(any(AdherenceBarrier.class))).thenAnswer(i -> i.getArgument(0));

        AdherenceBarrier saved = service.recordBarrier(10L, "TIME_CONSTRAINT", LocalDate.now(), "LUNCH", "Too busy", 60L);
        assertNotNull(saved);
        assertEquals("TIME_CONSTRAINT", saved.getBarrierType());
    }

    @Test
    void analyze_ComputesPercentagesAndRecurringBarriers() {
        Long patientId = 10L;

        AdherenceBarrier b1 = AdherenceBarrier.builder().barrierType("COST").build();
        AdherenceBarrier b2 = AdherenceBarrier.builder().barrierType("COST").build();
        AdherenceBarrier b3 = AdherenceBarrier.builder().barrierType("COST").build();
        AdherenceBarrier b4 = AdherenceBarrier.builder().barrierType("TASTE").build();

        when(barrierRepo.findByPatientUserIdOrderByBarrierDateDesc(patientId)).thenReturn(List.of(b1, b2, b3, b4));

        List<Object[]> counts = new ArrayList<>();
        counts.add(new Object[]{"COST", 3L});
        counts.add(new Object[]{"TASTE", 1L});
        when(barrierRepo.countByBarrierType(patientId)).thenReturn(counts);

        BarrierAnalysisResult res = service.analyze(patientId);

        assertEquals(4, res.getTotalBarriers());
        assertEquals("COST", res.getDominantBarrier());
        assertEquals(75.0, res.getPercentByType().get("COST"));
        assertEquals(25.0, res.getPercentByType().get("TASTE"));
        assertTrue(res.getRecurringBarriers().contains("COST"));
        assertFalse(res.getRecurringBarriers().contains("TASTE"));
    }

    @Test
    void resolveBarrier_DeletesBarrier() {
        AdherenceBarrier b = AdherenceBarrier.builder().build();
        b.setId(5L);
        when(barrierRepo.findById(5L)).thenReturn(Optional.of(b));

        service.resolveBarrier(5L);
        verify(barrierRepo).delete(b);
    }
}
