package com.nutrisphere.intelligence.adherence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import com.nutrisphere.exception.*;
import com.nutrisphere.nutrition.dietplan.DietPlanMeal;
import com.nutrisphere.nutrition.dietplan.DietPlanMealRepository;
@Service @RequiredArgsConstructor
public class AdherenceService {
    private final AdherenceBarrierRepository barrierRepo;
    private final DietPlanMealRepository mealRepo;

    @Transactional
    public AdherenceBarrier recordBarrier(Long patientUserId, String barrierType, LocalDate date,
                                          String mealType, String description, Long dietPlanMealId) {
        AdherenceBarrier b = AdherenceBarrier.builder()
            .patientUserId(patientUserId).barrierType(barrierType)
            .barrierDate(date).mealType(mealType)
            .description(description).dietPlanMealId(dietPlanMealId)
            .build();
        if (dietPlanMealId != null) {
            DietPlanMeal meal = mealRepo.findById(dietPlanMealId)
                .orElseThrow(() -> new ResourceNotFoundException("DietPlanMeal", dietPlanMealId));
            if (meal.getDietPlan() == null || !patientUserId.equals(meal.getDietPlan().getPatientUserId())) {
                throw new ForbiddenException("Diet plan meal does not belong to this patient");
            }
        }
        return barrierRepo.save(b);
    }

    public BarrierAnalysisResult analyze(Long patientUserId) {
        BarrierAnalysisResult result = new BarrierAnalysisResult();
        result.setPatientUserId(patientUserId);
        List<AdherenceBarrier> all = barrierRepo.findByPatientUserIdOrderByBarrierDateDesc(patientUserId);
        result.setTotalBarriers(all.size());

        List<Object[]> counts = barrierRepo.countByBarrierType(patientUserId);
        Map<String, Long> countMap = new LinkedHashMap<>();
        Map<String, Double> pctMap = new LinkedHashMap<>();
        for (Object[] row : counts) {
            countMap.put((String) row[0], (Long) row[1]);
        }
        result.setCountByType(countMap);

        long total = all.size();
        countMap.forEach((k, v) -> pctMap.put(k, total > 0 ? Math.round((v * 100.0 / total) * 10.0) / 10.0 : 0));
        result.setPercentByType(pctMap);

        if (!countMap.isEmpty()) {
            result.setDominantBarrier(countMap.keySet().iterator().next());
        }
        result.setRecurringBarriers(countMap.entrySet().stream()
            .filter(e -> e.getValue() >= 3)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList()));

        return result;
    }

    public List<AdherenceBarrier> getBarriers(Long patientUserId) {
        return barrierRepo.findByPatientUserIdOrderByBarrierDateDesc(patientUserId);
    }

    public AdherenceBarrier getBarrier(Long barrierId) {
        return barrierRepo.findById(barrierId)
            .orElseThrow(() -> new ResourceNotFoundException("AdherenceBarrier", barrierId));
    }

    @Transactional
    public void resolveBarrier(Long barrierId) {
        barrierRepo.delete(getBarrier(barrierId));
    }

    public BarrierAnalysisResult analyzeBarriers(Long patientUserId) {
        return analyze(patientUserId);
    }
}
