package com.nutrisphere.intelligence.digitaltwin;

import com.nutrisphere.intelligence.adherence.AdherenceBarrierRepository;
import com.nutrisphere.intelligence.reality.RealityScore;
import com.nutrisphere.intelligence.reality.RealityScoreRepository;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import com.nutrisphere.nutrition.hydration.WaterLogRepository;
import com.nutrisphere.nutrition.logging.FoodLog;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import com.nutrisphere.patient.PatientProfile;
import com.nutrisphere.patient.PatientRepository;
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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DigitalTwinServiceTest {

    @Mock
    private PatientRepository patientRepo;
    @Mock
    private UserRepository userRepo;
    @Mock
    private FoodLogRepository logRepo;
    @Mock
    private WaterLogRepository waterRepo;
    @Mock
    private AdherenceBarrierRepository barrierRepo;
    @Mock
    private DietPlanRepository planRepo;
    @Mock
    private RealityScoreRepository realityScoreRepo;

    private DigitalTwinService service;

    @BeforeEach
    void setUp() {
        service = new DigitalTwinService(
            patientRepo,
            userRepo,
            logRepo,
            waterRepo,
            barrierRepo,
            planRepo,
            realityScoreRepo
        );
    }

    @Test
    void buildDigitalTwin_CalculatesMetricsProjectionsAndMetabolicStatus() {
        Long patientId = 10L;

        User user = User.builder().firstName("Bruce").lastName("Wayne").build();
        when(userRepo.findById(patientId)).thenReturn(Optional.of(user));

        PatientProfile profile = PatientProfile.builder()
            .weightKg(80.0)
            .heightCm(180.0)
            .bloodType("O+")
            .build();
        when(patientRepo.findByUserId(patientId)).thenReturn(Optional.of(profile));

        FoodLog log = FoodLog.builder()
            .logDate(LocalDate.now())
            .calories(14000.0) // 14000 / 7 = 2000 cal/day
            .proteinG(700.0)
            .carbsG(1400.0)
            .fatG(420.0)
            .fiberG(175.0)
            .build();
        when(logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(eq(patientId), any(), any()))
            .thenReturn(List.of(log));

        when(waterRepo.sumAmountForDate(eq(patientId), any())).thenReturn(2100.0);
        when(waterRepo.findByPatientUserIdAndLogDateOrderByLogTime(eq(patientId), any())).thenReturn(List.of());

        DietPlan plan = DietPlan.builder()
            .targetCalories(2000.0)
            .targetProteinG(100.0)
            .targetWaterMl(2500.0)
            .build();
        when(planRepo.findByPatientUserIdAndStatus(patientId, DietPlanStatus.APPROVED)).thenReturn(Optional.of(plan));

        RealityScore rs = RealityScore.builder()
            .overallScore(85.0)
            .foodAvailabilityScore(90.0)
            .affordabilityScore(85.0)
            .build();
        when(realityScoreRepo.findFirstByPatientUserIdOrderByCreatedAtDesc(patientId)).thenReturn(Optional.of(rs));

        DigitalTwinData twin = service.buildDigitalTwin(patientId);

        assertNotNull(twin);
        assertEquals("Bruce Wayne", twin.getPatientName());
        assertEquals(80.0, twin.getCurrentWeightKg());
        assertEquals(24.7, twin.getBmi());
        assertEquals(2000.0, twin.getAvgDailyCalories());
        assertEquals(2100.0, twin.getAvgDailyWaterMl());
        // Ratio = 2000 / 2000 = 1.0 -> OPTIMAL
        assertEquals("OPTIMAL", twin.getMetabolicStatus());
        assertNotNull(twin.getWeightProjectionCurve());
        assertEquals(80.0, twin.getWeightProjectionCurve().get("Day 0 (Current)"));
        assertEquals(85.0, twin.getLatestRealityScore());
        assertEquals("High Feasibility", twin.getRealityScoreInterpretation());
    }

    @Test
    void buildDigitalTwin_MetabolicWarningStatuses() {
        Long patientId = 10L;

        PatientProfile profile = PatientProfile.builder().weightKg(70.0).heightCm(170.0).build();
        when(patientRepo.findByUserId(patientId)).thenReturn(Optional.of(profile));

        // Very low calories: 500 cal/day on 2000 target -> ratio = 0.25 < 0.70 -> DEFICIT_WARNING
        FoodLog logDeficit = FoodLog.builder().logDate(LocalDate.now()).calories(3500.0).build();
        when(logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(eq(patientId), any(), any()))
            .thenReturn(List.of(logDeficit));

        DietPlan plan = DietPlan.builder().targetCalories(2000.0).build();
        when(planRepo.findByPatientUserIdAndStatus(patientId, DietPlanStatus.APPROVED)).thenReturn(Optional.of(plan));

        DigitalTwinData twinDeficit = service.buildDigitalTwin(patientId);
        assertEquals("DEFICIT_WARNING", twinDeficit.getMetabolicStatus());
    }
}
