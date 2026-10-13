package com.nutrisphere.intelligence.adaptive;

import com.nutrisphere.exception.BadRequestException;
import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.intelligence.adherence.AdherenceBarrier;
import com.nutrisphere.intelligence.adherence.AdherenceBarrierRepository;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import com.nutrisphere.nutrition.hydration.WaterLogRepository;
import com.nutrisphere.nutrition.logging.FoodLog;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdaptiveEngineServiceTest {

    @Mock
    private AdaptiveRecommendationRepository repo;
    @Mock
    private FoodLogRepository logRepo;
    @Mock
    private WaterLogRepository waterRepo;
    @Mock
    private AdherenceBarrierRepository barrierRepo;
    @Mock
    private DietPlanRepository planRepo;

    private AdaptiveEngineService service;

    @BeforeEach
    void setUp() {
        service = new AdaptiveEngineService(repo, logRepo, waterRepo, barrierRepo, planRepo);
    }

    @Test
    void generateRecommendations_NullPatient_ThrowsBadRequest() {
        assertThrows(BadRequestException.class, () -> service.generateRecommendations(null, 1L));
    }

    @Test
    void generateRecommendations_UnapprovedPlan_ThrowsBadRequest() {
        DietPlan plan = DietPlan.builder().patientUserId(10L).status(DietPlanStatus.SUBMITTED).build();
        when(planRepo.findById(1L)).thenReturn(Optional.of(plan));

        assertThrows(BadRequestException.class, () -> service.generateRecommendations(10L, 1L));
    }

    @Test
    void generateRecommendations_PlanMismatch_ThrowsForbidden() {
        DietPlan plan = DietPlan.builder().patientUserId(99L).status(DietPlanStatus.APPROVED).build();
        when(planRepo.findById(1L)).thenReturn(Optional.of(plan));

        assertThrows(ForbiddenException.class, () -> service.generateRecommendations(10L, 1L));
    }

    @Test
    void generateRecommendations_DetectsProteinDeficitHydrationAndBarriers() {
        Long patientId = 10L;
        DietPlan plan = DietPlan.builder()
            .patientUserId(patientId)
            .status(DietPlanStatus.APPROVED)
            .targetProteinG(120.0) // 70% is 84g
            .targetWaterMl(2500.0) // 80% is 2000ml
            .build();
        plan.setId(1L);

        when(planRepo.findById(1L)).thenReturn(Optional.of(plan));

        // Low protein log (30g per day)
        FoodLog log = FoodLog.builder().logDate(LocalDate.now()).proteinG(30.0).build();
        when(logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(eq(patientId), any(), any()))
            .thenReturn(List.of(log));

        // 3 barriers
        AdherenceBarrier b1 = AdherenceBarrier.builder().barrierType("COST").build();
        AdherenceBarrier b2 = AdherenceBarrier.builder().barrierType("COST").build();
        AdherenceBarrier b3 = AdherenceBarrier.builder().barrierType("COST").build();
        when(barrierRepo.findByPatientUserIdAndBarrierDateBetween(eq(patientId), any(), any()))
            .thenReturn(List.of(b1, b2, b3));

        // Low water (500ml per day)
        when(waterRepo.sumAmountForDate(eq(patientId), any())).thenReturn(500.0);

        when(repo.findByPatientUserIdAndStatus(patientId, AdaptiveRecommendationStatus.PENDING_REVIEW))
            .thenReturn(Collections.emptyList());

        List<AdaptiveRecommendation> recs = service.generateRecommendations(patientId, 1L);

        assertFalse(recs.isEmpty());
        assertTrue(recs.stream().anyMatch(r -> "PROTEIN_DEFICIT".equals(r.getRecommendationType())));
        assertTrue(recs.stream().anyMatch(r -> "LOW_HYDRATION".equals(r.getRecommendationType())));
        assertTrue(recs.stream().anyMatch(r -> "BARRIER_PATTERN".equals(r.getRecommendationType())));
        verify(repo).saveAll(any());
    }

    @Test
    void reviewRecommendation_ApprovedAndRejected() {
        AdaptiveRecommendation rec = AdaptiveRecommendation.builder()
            .status(AdaptiveRecommendationStatus.PENDING_REVIEW)
            .build();
        rec.setId(5L);

        when(repo.findById(5L)).thenReturn(Optional.of(rec));
        when(repo.save(any(AdaptiveRecommendation.class))).thenAnswer(i -> i.getArgument(0));

        AdaptiveRecommendation approved = service.reviewRecommendation(5L, 20L, true, "Approved modification");
        assertEquals(AdaptiveRecommendationStatus.APPROVED, approved.getStatus());
        assertEquals(20L, approved.getReviewedByUserId());

        AdaptiveRecommendation rejected = service.reviewRecommendation(5L, 20L, false, "Declined");
        assertEquals(AdaptiveRecommendationStatus.REJECTED, rejected.getStatus());
    }
}
