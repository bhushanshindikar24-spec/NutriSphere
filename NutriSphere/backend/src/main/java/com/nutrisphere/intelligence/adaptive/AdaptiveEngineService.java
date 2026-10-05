package com.nutrisphere.intelligence.adaptive;

import com.nutrisphere.intelligence.adherence.AdherenceBarrierRepository;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.hydration.WaterLogRepository;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service @RequiredArgsConstructor
public class AdaptiveEngineService {
    private final AdaptiveRecommendationRepository repo;
    private final FoodLogRepository logRepo;
    private final WaterLogRepository waterRepo;
    private final AdherenceBarrierRepository barrierRepo;
    private final DietPlanRepository planRepo;

    /**
     * Adaptive Diet Engine — analyzes patterns and generates suggestions.
     * Does NOT automatically change the approved diet plan.
     * All suggestions require dietitian review.
     */
    @Transactional
    public List<AdaptiveRecommendation> generateRecommendations(Long patientUserId, Long dietPlanId) {
        List<AdaptiveRecommendation> generated = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);

        var logs = logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(patientUserId, weekAgo, today);
        var barriers = barrierRepo.findByPatientUserIdAndBarrierDateBetween(patientUserId, weekAgo, today);
        var plan = dietPlanId != null ? planRepo.findById(dietPlanId).orElse(null)
            : planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED).orElse(null);
        Long effectivePlanId = plan != null ? plan.getId() : dietPlanId;

        // 1. Low protein intake detection
        if (plan != null && plan.getTargetProteinG() != null) {
            double avgProtein = logs.stream().mapToDouble(l -> l.getProteinG() != null ? l.getProteinG() : 0).average().orElse(0);
            if (avgProtein < plan.getTargetProteinG() * 0.7) {
                generated.add(createRecommendation(patientUserId, effectivePlanId, "PROTEIN_DEFICIT",
                    "Low Protein Intake Detected",
                    "Patient average protein intake (" + String.format("%.1f",avgProtein) + "g) is significantly below target (" + plan.getTargetProteinG() + "g). Consider adding high-protein foods.",
                    "Low protein intake over 7 days", "Add Greek yogurt, eggs, or lean protein to meals", "HIGH"));
            }
        }

        // 2. Low hydration
        double avgWater = 0;
        for (int i=0; i<7; i++) {
            avgWater += waterRepo.sumAmountForDate(patientUserId, today.minusDays(i));
        }
        avgWater /= 7;
        if (avgWater < 1500) {
            generated.add(createRecommendation(patientUserId, effectivePlanId, "LOW_HYDRATION",
                "Low Hydration Pattern",
                "Average water intake of " + String.format("%.0f",avgWater) + "ml/day is below recommended 2000ml. Consider hydration reminders.",
                "Consistently low water intake", "Set hydration reminders, carry a water bottle", "MEDIUM"));
        }

        // 3. Frequent barriers
        if (barriers.size() >= 3) {
            Map<String, Long> barrierCount = new HashMap<>();
            barriers.forEach(b -> barrierCount.merge(b.getBarrierType(), 1L, Long::sum));
            String dominant = barrierCount.entrySet().stream().max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("");
            if (!dominant.isEmpty()) {
                generated.add(createRecommendation(patientUserId, effectivePlanId, "BARRIER_PATTERN",
                    "Recurring Adherence Barrier: " + dominant,
                    "Barrier '" + dominant + "' detected " + barrierCount.get(dominant) + " times in the last 7 days. Diet plan may need adjustment.",
                    "Recurring " + dominant + " barrier", "Review meals that trigger this barrier, consider alternatives", "HIGH"));
            }
        }

        repo.saveAll(generated);
        return generated;
    }

    public List<AdaptiveRecommendation> getPendingReviews(Long dietPlanId) {
        return repo.findByDietPlanIdOrderByCreatedAtDesc(dietPlanId)
            .stream().filter(r -> r.getStatus() == AdaptiveRecommendationStatus.PENDING_REVIEW).toList();
    }

    public List<AdaptiveRecommendation> getForPatient(Long patientUserId) {
        return repo.findByPatientUserIdOrderByCreatedAtDesc(patientUserId);
    }

    @Transactional
    public AdaptiveRecommendation reviewRecommendation(Long recId, Long dietitianUserId, boolean approved, String notes) {
        AdaptiveRecommendation rec = repo.findById(recId)
            .orElseThrow(() -> new com.nutrisphere.exception.ResourceNotFoundException("Recommendation", recId));
        rec.setStatus(approved ? AdaptiveRecommendationStatus.APPROVED : AdaptiveRecommendationStatus.REJECTED);
        rec.setReviewedByUserId(dietitianUserId);
        rec.setReviewNotes(notes);
        rec.setReviewedAt(java.time.LocalDateTime.now());
        return repo.save(rec);
    }

    private AdaptiveRecommendation createRecommendation(Long patientUserId, Long dietPlanId, String type,
            String title, String desc, String issues, String suggested, String priority) {
        return AdaptiveRecommendation.builder()
            .patientUserId(patientUserId).dietPlanId(dietPlanId)
            .recommendationType(type).title(title).description(desc)
            .detectedIssues(issues).suggestedChanges(suggested).priority(priority)
            .build();
    }
}
