package com.nutrisphere.intelligence.adherence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class AdherenceService {
    private final AdherenceBarrierRepository barrierRepo;

    @Transactional
    public AdherenceBarrier recordBarrier(Long patientUserId, String barrierType, LocalDate date,
                                          String mealType, String description, Long dietPlanMealId) {
        AdherenceBarrier b = AdherenceBarrier.builder()
            .patientUserId(patientUserId).barrierType(barrierType)
            .barrierDate(date).mealType(mealType)
            .description(description).dietPlanMealId(dietPlanMealId)
            .build();
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

    @Transactional
    public void resolveBarrier(Long barrierId) {
        if (barrierRepo.existsById(barrierId)) {
            barrierRepo.deleteById(barrierId);
        }
    }

    public BarrierAnalysisResult analyzeBarriers(Long patientUserId) {
        return analyze(patientUserId);
    }
}
