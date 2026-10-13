package com.nutrisphere.intelligence.digitaltwin;

import com.nutrisphere.nutrition.hydration.WaterLogRepository;
import com.nutrisphere.nutrition.logging.FoodLog;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TrendAnalysisServiceTest {

    @Mock
    private FoodLogRepository logRepo;
    @Mock
    private WaterLogRepository waterRepo;

    private TrendAnalysisService service;

    @BeforeEach
    void setUp() {
        service = new TrendAnalysisService(logRepo, waterRepo);
    }

    @Test
    void weeklyNutritionTrend_CalculatesAveragesPerWeek() {
        Long patientId = 10L;
        FoodLog log = FoodLog.builder().calories(2100.0).proteinG(90.0).build();
        when(logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(eq(patientId), any(), any()))
            .thenReturn(List.of(log));
        when(waterRepo.sumAmountForDate(eq(patientId), any())).thenReturn(2000.0);

        List<Map<String, Object>> trend = service.weeklyNutritionTrend(patientId, 2);

        assertEquals(2, trend.size());
        assertEquals(2100.0, trend.get(0).get("avgCalories"));
        assertEquals(90.0, trend.get(0).get("avgProteinG"));
    }

    @Test
    void getNutritionDirection_IdentifiesTrends() {
        Long patientId = 10L;

        FoodLog lastWeekLog = FoodLog.builder().calories(2500.0).proteinG(110.0).build();
        FoodLog prevWeekLog = FoodLog.builder().calories(2000.0).proteinG(90.0).build();

        when(logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(eq(patientId), any(), any()))
            .thenReturn(List.of(lastWeekLog))  // lastWeek
            .thenReturn(List.of(prevWeekLog));  // prevWeek

        Map<String, String> dir = service.getNutritionDirection(patientId);

        // 2500 > 2000 * 1.05 -> INCREASING
        assertEquals("INCREASING", dir.get("calories"));
        assertEquals("INCREASING", dir.get("protein"));
    }
}
