package com.nutrisphere.nutrition.hydration;

import com.nutrisphere.exception.BadRequestException;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import com.nutrisphere.nutrition.hydration.dto.HydrationSummaryResponse;
import com.nutrisphere.nutrition.hydration.dto.WaterLogRequest;
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
class HydrationServiceTest {

    @Mock
    private WaterLogRepository waterLogRepo;
    @Mock
    private DietPlanRepository planRepo;

    private HydrationService service;

    @BeforeEach
    void setUp() {
        service = new HydrationService(waterLogRepo, planRepo);
    }

    @Test
    void logWater_ZeroOrNegativeAmount_ThrowsBadRequest() {
        WaterLogRequest req = new WaterLogRequest();
        req.setAmountMl(0.0);
        req.setLogDate(LocalDate.now());

        assertThrows(BadRequestException.class, () -> service.logWater(10L, req));

        req.setAmountMl(-50.0);
        assertThrows(BadRequestException.class, () -> service.logWater(10L, req));
    }

    @Test
    void logWater_Success() {
        WaterLogRequest req = new WaterLogRequest();
        req.setAmountMl(250.0);
        req.setLogDate(LocalDate.now());

        WaterLog saved = WaterLog.builder()
            .patientUserId(10L)
            .amountMl(250.0)
            .build();
        saved.setId(1L);

        when(waterLogRepo.save(any(WaterLog.class))).thenReturn(saved);

        WaterLog result = service.logWater(10L, req);
        assertNotNull(result);
        assertEquals(250.0, result.getAmountMl());
    }

    @Test
    void getSummary_CalculatesCorrectPercentage() {
        LocalDate date = LocalDate.now();
        DietPlan plan = DietPlan.builder().targetWaterMl(2000.0).build();

        when(waterLogRepo.sumAmountForDate(10L, date)).thenReturn(1500.0);
        when(planRepo.findByPatientUserIdAndStatus(10L, DietPlanStatus.APPROVED)).thenReturn(Optional.of(plan));
        when(waterLogRepo.findByPatientUserIdAndLogDateOrderByLogTime(10L, date))
            .thenReturn(List.of(new WaterLog(), new WaterLog()));

        HydrationSummaryResponse summary = service.getSummary(10L, date);

        assertEquals(1500.0, summary.getTotalMl());
        assertEquals(2000.0, summary.getTargetMl());
        // 1500 / 2000 * 100 = 75%
        assertEquals(75.0, summary.getPercentComplete());
        assertEquals(2, summary.getLogCount());
    }
}
