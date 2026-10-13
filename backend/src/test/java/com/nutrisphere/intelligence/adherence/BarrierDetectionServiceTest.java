package com.nutrisphere.intelligence.adherence;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BarrierDetectionServiceTest {

    @Mock
    private AdherenceBarrierRepository barrierRepo;

    private BarrierDetectionService service;

    @BeforeEach
    void setUp() {
        service = new BarrierDetectionService(barrierRepo);
    }

    @Test
    void detect_ComputesDominantAndRecurring() {
        Long patientId = 10L;

        AdherenceBarrier b1 = AdherenceBarrier.builder().barrierType("TIME_CONSTRAINT").build();
        AdherenceBarrier b2 = AdherenceBarrier.builder().barrierType("TIME_CONSTRAINT").build();
        AdherenceBarrier b3 = AdherenceBarrier.builder().barrierType("TIME_CONSTRAINT").build();
        when(barrierRepo.findByPatientUserIdOrderByBarrierDateDesc(patientId)).thenReturn(List.of(b1, b2, b3));

        List<Object[]> counts = new ArrayList<>();
        counts.add(new Object[]{"TIME_CONSTRAINT", 3L});
        when(barrierRepo.countByBarrierType(patientId)).thenReturn(counts);

        BarrierAnalysisResult res = service.detect(patientId);

        assertEquals(3, res.getTotalBarriers());
        assertEquals("TIME_CONSTRAINT", res.getDominantBarrier());
        assertTrue(res.getRecurringBarriers().contains("TIME_CONSTRAINT"));
    }

    @Test
    void getTrends_DetectsWeeklyTrendDirection() {
        Long patientId = 10L;

        AdherenceBarrier b1 = new AdherenceBarrier();
        AdherenceBarrier b2 = new AdherenceBarrier();
        AdherenceBarrier b3 = new AdherenceBarrier();

        // 3 in last 7 days
        when(barrierRepo.findByPatientUserIdAndBarrierDateBetween(eq(patientId), any(), any()))
            .thenReturn(List.of(b1, b2, b3)) // last 7 days
            .thenReturn(List.of(b1, b2, b3)) // last 30 days
            .thenReturn(List.of(b1));         // prev 7 days (1 barrier)

        Map<String, Object> trends = service.getTrends(patientId);

        assertEquals(3, trends.get("last7Days"));
        assertEquals("INCREASING", trends.get("weeklyTrend"));
    }
}
