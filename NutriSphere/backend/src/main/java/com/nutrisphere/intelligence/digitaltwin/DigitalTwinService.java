package com.nutrisphere.intelligence.digitaltwin;

import com.nutrisphere.intelligence.adherence.AdherenceBarrierRepository;
import com.nutrisphere.intelligence.reality.RealityScoreRepository;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.hydration.WaterLogRepository;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import com.nutrisphere.patient.PatientRepository;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class DigitalTwinService {
    private final PatientRepository patientRepo;
    private final UserRepository userRepo;
    private final FoodLogRepository logRepo;
    private final WaterLogRepository waterRepo;
    private final AdherenceBarrierRepository barrierRepo;
    private final DietPlanRepository planRepo;
    private final RealityScoreRepository realityScoreRepo;

    public DigitalTwinData buildDigitalTwin(Long patientUserId) {
        DigitalTwinData twin = new DigitalTwinData();
        twin.setPatientUserId(patientUserId);

        userRepo.findById(patientUserId).ifPresent(u -> twin.setPatientName(u.getFullName()));

        patientRepo.findByUserId(patientUserId).ifPresent(p -> {
            twin.setCurrentWeightKg(p.getWeightKg());
            twin.setHeightCm(p.getHeightCm());
            if (p.getHeightCm() != null && p.getWeightKg() != null && p.getHeightCm() > 0) {
                double h = p.getHeightCm() / 100.0;
                twin.setBmi(Math.round((p.getWeightKg() / (h*h)) * 10.0) / 10.0);
            }
            twin.setBloodType(p.getBloodType());
        });

        // Nutrition 7-day
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(6);
        var logs = logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(patientUserId, weekAgo, today);

        twin.setTotalFoodLogs(logs.size());
        if (!logs.isEmpty()) {
            twin.setAvgDailyCalories(logs.stream().mapToDouble(l -> l.getCalories() != null ? l.getCalories() : 0).sum() / 7.0);
            twin.setAvgDailyProteinG(logs.stream().mapToDouble(l -> l.getProteinG() != null ? l.getProteinG() : 0).sum() / 7.0);
            twin.setAvgDailyCarbsG(logs.stream().mapToDouble(l -> l.getCarbsG() != null ? l.getCarbsG() : 0).sum() / 7.0);
            twin.setAvgDailyFatG(logs.stream().mapToDouble(l -> l.getFatG() != null ? l.getFatG() : 0).sum() / 7.0);
        }

        // Water 7-day
        double totalWater = 0;
        for (int i=0; i<7; i++) {
            Double amount = waterRepo.sumAmountForDate(patientUserId, today.minusDays(i));
            totalWater += amount != null ? amount : 0.0;
        }
        twin.setAvgDailyWaterMl(totalWater / 7.0);

        // Diet plan targets
        planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED).ifPresent(plan -> {
            twin.setTargetCalories(plan.getTargetCalories());
            twin.setTargetProteinG(plan.getTargetProteinG());
            twin.setTargetCarbsG(plan.getTargetCarbsG());
            twin.setTargetFatG(plan.getTargetFatG());
            twin.setTargetWaterMl(plan.getTargetWaterMl());
        });

        // Adherence
        if (twin.getTargetCalories() != null && twin.getTargetCalories() > 0 && twin.getAvgDailyCalories() != null) {
            twin.setAdherencePercent(Math.min(100, (twin.getAvgDailyCalories() / twin.getTargetCalories()) * 100));
        }

        // Barriers
        var barriers = barrierRepo.findByPatientUserIdOrderByBarrierDateDesc(patientUserId);
        twin.setTotalBarriers(barriers.size());
        barrierRepo.countByBarrierType(patientUserId).stream()
            .max(Comparator.comparingLong(row -> (Long) row[1]))
            .ifPresent(row -> twin.setDominantBarrier((String) row[0]));

        // Nutrition history (daily breakdown)
        Map<LocalDate, DigitalTwinData.DailyNutrition> byDate = new LinkedHashMap<>();
        for (int i=6; i>=0; i--) {
            LocalDate d = today.minusDays(i);
            DigitalTwinData.DailyNutrition dn = new DigitalTwinData.DailyNutrition();
            dn.setDate(d);
            byDate.put(d, dn);
        }
        logs.forEach(l -> {
            byDate.computeIfPresent(l.getLogDate(), (d, dn) -> {
                dn.setCalories(dn.getCalories() + (l.getCalories() != null ? l.getCalories() : 0));
                dn.setProteinG(dn.getProteinG() + (l.getProteinG() != null ? l.getProteinG() : 0));
                dn.setCarbsG(dn.getCarbsG() + (l.getCarbsG() != null ? l.getCarbsG() : 0));
                dn.setFatG(dn.getFatG() + (l.getFatG() != null ? l.getFatG() : 0));
                return dn;
            });
        });
        twin.setNutritionHistory(new ArrayList<>(byDate.values()));

        // Reality Score
        realityScoreRepo.findFirstByPatientUserIdOrderByCreatedAtDesc(patientUserId).ifPresent(rs -> {
            twin.setLatestRealityScore(rs.getOverallScore());
            twin.setRealityScoreInterpretation(rs.getOverallScore() != null && rs.getOverallScore() >= 75 ? "High Feasibility" :
                rs.getOverallScore() != null && rs.getOverallScore() >= 50 ? "Moderate Feasibility" : "Low Feasibility");
        });

        twin.setLastUpdated(LocalDateTime.now());
        return twin;
    }
}
