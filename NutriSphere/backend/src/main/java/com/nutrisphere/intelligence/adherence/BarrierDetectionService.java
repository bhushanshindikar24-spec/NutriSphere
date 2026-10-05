package com.nutrisphere.intelligence.adherence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * BarrierDetectionService analyzes adherence barriers to detect patterns
 * and provide actionable insights for dietitians.
 */
@Service
@RequiredArgsConstructor
public class BarrierDetectionService {
    private final AdherenceBarrierRepository barrierRepo;

    /**
     * Detect dominant barrier patterns for a patient.
     * Returns full analysis including counts, percentages, trends, and dominant barriers.
     */
    public BarrierAnalysisResult detect(Long patientUserId) {
        BarrierAnalysisResult result = new BarrierAnalysisResult();
        result.setPatientUserId(patientUserId);

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysAgo = today.minusDays(30);

        // All barriers
        List<AdherenceBarrier> allBarriers = barrierRepo.findByPatientUserIdOrderByBarrierDateDesc(patientUserId);
        result.setTotalBarriers(allBarriers.size());

        // Recent barriers (last 30 days)
        List<AdherenceBarrier> recentBarriers = barrierRepo.findByPatientUserIdAndBarrierDateBetween(
            patientUserId, thirtyDaysAgo, today);

        // Count by type
        List<Object[]> counts = barrierRepo.countByBarrierType(patientUserId);
        Map<String, Long> countMap = new LinkedHashMap<>();
        Map<String, Double> percentMap = new LinkedHashMap<>();
        long total = allBarriers.size();

        for (Object[] row : counts) {
            String type = (String) row[0];
            Long count = (Long) row[1];
            countMap.put(type, count);
            percentMap.put(type, total > 0 ? Math.round((count * 100.0 / total) * 10.0) / 10.0 : 0.0);
        }

        result.setCountByType(countMap);
        result.setPercentByType(percentMap);

        // Dominant barrier
        countMap.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .ifPresent(e -> result.setDominantBarrier(e.getKey()));

        // Recurring barriers (≥3 occurrences)
        result.setRecurringBarriers(countMap.entrySet().stream()
            .filter(e -> e.getValue() >= 3)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList()));

        return result;
    }

    /**
     * Get barriers for a specific meal type to identify problem meals.
     */
    public List<AdherenceBarrier> getForMealType(Long patientUserId, String mealType) {
        return barrierRepo.findByPatientUserIdOrderByBarrierDateDesc(patientUserId)
            .stream()
            .filter(b -> mealType.equalsIgnoreCase(b.getMealType()))
            .collect(Collectors.toList());
    }

    /**
     * Analyze barrier trends over different time windows.
     */
    public Map<String, Object> getTrends(Long patientUserId) {
        LocalDate today = LocalDate.now();
        Map<String, Object> trends = new LinkedHashMap<>();

        // Last 7 days
        List<AdherenceBarrier> week = barrierRepo.findByPatientUserIdAndBarrierDateBetween(
            patientUserId, today.minusDays(7), today);
        trends.put("last7Days", week.size());

        // Last 30 days
        List<AdherenceBarrier> month = barrierRepo.findByPatientUserIdAndBarrierDateBetween(
            patientUserId, today.minusDays(30), today);
        trends.put("last30Days", month.size());

        // Trend direction
        int weekRate = week.size();
        int prevWeekCount = barrierRepo.findByPatientUserIdAndBarrierDateBetween(
            patientUserId, today.minusDays(14), today.minusDays(7)).size();
        trends.put("weeklyTrend", weekRate > prevWeekCount ? "INCREASING" : weekRate < prevWeekCount ? "DECREASING" : "STABLE");

        return trends;
    }

    public BarrierAnalysisResult analyzeBarriers(Long patientUserId) {
        return detect(patientUserId);
    }
}
