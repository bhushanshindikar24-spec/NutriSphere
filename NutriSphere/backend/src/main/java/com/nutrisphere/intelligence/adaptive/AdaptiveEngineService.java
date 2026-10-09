package com.nutrisphere.intelligence.adaptive;

import com.nutrisphere.exception.BadRequestException;
import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.intelligence.adherence.AdherenceBarrierRepository;
import com.nutrisphere.nutrition.hydration.WaterLogRepository;
import com.nutrisphere.nutrition.logging.FoodLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdaptiveEngineService {
    private final AdaptiveRecommendationRepository repo;
    private final FoodLogRepository logRepo;
    private final WaterLogRepository waterRepo;
    private final AdherenceBarrierRepository barrierRepo;
    private final DietPlanRepository planRepo;

    @Transactional
    public List<AdaptiveRecommendation> generateRecommendations(Long patientUserId, Long dietPlanId) {
        if (patientUserId == null) {
            throw new BadRequestException("Patient is required");
        }

        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(6);
        DietPlan plan = resolvePlan(patientUserId, dietPlanId);
        Long effectivePlanId = plan != null ? plan.getId() : null;

        var logs = logRepo.findByPatientUserIdAndLogDateBetweenOrderByLogDateAscLogTimeAsc(
            patientUserId, weekAgo, today);
        var barriers = barrierRepo.findByPatientUserIdAndBarrierDateBetween(
            patientUserId, weekAgo, today);

        List<AdaptiveRecommendation> generated = new ArrayList<>();

        // Protein is evaluated as daily totals, then averaged across the 7-day window.
        if (plan != null && plan.getTargetProteinG() != null && plan.getTargetProteinG() > 0) {
            Map<LocalDate, Double> dailyProtein = new HashMap<>();
            for (int i = 0; i < 7; i++) {
                dailyProtein.put(today.minusDays(i), 0.0);
            }
            logs.forEach(l -> dailyProtein.computeIfPresent(l.getLogDate(),
                (d, value) -> value + (l.getProteinG() != null ? l.getProteinG() : 0.0)));
            double avgProtein = dailyProtein.values().stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

            if (avgProtein < plan.getTargetProteinG() * 0.7) {
                addIfNotPending(generated, createRecommendation(patientUserId, effectivePlanId, "PROTEIN_DEFICIT",
                    "Low Protein Intake Detected",
                    "Average daily protein intake (" + String.format("%.1f", avgProtein) + "g) is below 70% of the approved target (" +
                        plan.getTargetProteinG() + "g). Consider a dietitian-reviewed adjustment.",
                    "Low protein intake over 7 days",
                    "Review protein distribution and add appropriate protein sources",
                    "HIGH"));
            }
        }

        // Hydration uses the approved plan target when available; no fabricated universal target.
        double avgWater = 0.0;
        for (int i = 0; i < 7; i++) {
            Double amount = waterRepo.sumAmountForDate(patientUserId, today.minusDays(i));
            avgWater += amount != null ? amount : 0.0;
        }
        avgWater /= 7.0;

        double targetWater = plan != null && plan.getTargetWaterMl() != null ? plan.getTargetWaterMl() : 2000.0;
        if ((targetWater > 0 && avgWater < targetWater * 0.8) || (avgWater < 1500.0)) {
            addIfNotPending(generated, createRecommendation(patientUserId, effectivePlanId, "LOW_HYDRATION",
                "Low Hydration Pattern",
                "Average water intake of " + String.format("%.0f", avgWater) +
                    "ml/day is below clinical hydration threshold (" + String.format("%.0f", Math.min(targetWater * 0.8, 1500.0)) + "ml/day).",
                "Consistently low water intake over 7-day period",
                "Use hydration reminders and distribute fluids across the day within the approved plan",
                "MEDIUM"));
        }

        // Frequent barriers.
        if (barriers.size() >= 3) {
            Map<String, Long> barrierCount = new HashMap<>();
            barriers.forEach(b -> barrierCount.merge(b.getBarrierType(), 1L, Long::sum));
            String dominant = barrierCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey).orElse("");

            if (!dominant.isEmpty()) {
                addIfNotPending(generated, createRecommendation(patientUserId, effectivePlanId, "BARRIER_PATTERN",
                    "Recurring Adherence Barrier: " + dominant,
                    "Barrier '" + dominant + "' was detected " + barrierCount.get(dominant) +
                        " times in the last 7 days. Review the affected meals before changing the approved plan.",
                    "Recurring " + dominant + " barrier",
                    "Review affected meals and consider clinically appropriate alternatives",
                    "HIGH"));
            }
        }

        if (!generated.isEmpty()) {
            repo.saveAll(generated);
        }
        return generated;
    }

    private DietPlan resolvePlan(Long patientUserId, Long dietPlanId) {
        DietPlan plan;
        if (dietPlanId != null) {
            plan = planRepo.findById(dietPlanId)
                .orElseThrow(() -> new ResourceNotFoundException("DietPlan", dietPlanId));
            if (!patientUserId.equals(plan.getPatientUserId())) {
                throw new ForbiddenException("Diet plan does not belong to this patient");
            }
        } else {
            plan = planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED).orElse(null);
        }

        if (plan != null && plan.getStatus() != DietPlanStatus.APPROVED) {
            throw new BadRequestException("Adaptive analysis requires an approved diet plan");
        }
        return plan;
    }

    public void assertPlanBelongsToPatient(Long dietPlanId, Long patientUserId) {
        resolvePlan(patientUserId, dietPlanId);
    }

    public Long getPatientUserIdForPlan(Long dietPlanId) {
        return planRepo.findById(dietPlanId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", dietPlanId))
            .getPatientUserId();
    }

    public Long getPatientUserIdForRecommendation(Long recommendationId) {
        return repo.findById(recommendationId)
            .orElseThrow(() -> new ResourceNotFoundException("Recommendation", recommendationId))
            .getPatientUserId();
    }

    public List<AdaptiveRecommendation> getPendingReviews(Long dietPlanId) {
        return repo.findByDietPlanIdOrderByCreatedAtDesc(dietPlanId)
            .stream()
            .filter(r -> r.getStatus() == AdaptiveRecommendationStatus.PENDING_REVIEW)
            .toList();
    }

    public List<AdaptiveRecommendation> getForPatient(Long patientUserId) {
        return repo.findByPatientUserIdOrderByCreatedAtDesc(patientUserId);
    }

    @Transactional
    public AdaptiveRecommendation reviewRecommendation(Long recId, Long dietitianUserId, boolean approved, String notes) {
        AdaptiveRecommendation rec = repo.findById(recId)
            .orElseThrow(() -> new ResourceNotFoundException("Recommendation", recId));
        rec.setStatus(approved ? AdaptiveRecommendationStatus.APPROVED : AdaptiveRecommendationStatus.REJECTED);
        rec.setReviewedByUserId(dietitianUserId);
        rec.setReviewNotes(notes);
        rec.setReviewedAt(java.time.LocalDateTime.now());
        return repo.save(rec);
    }

    private void addIfNotPending(List<AdaptiveRecommendation> generated, AdaptiveRecommendation candidate) {
        boolean alreadyPending = repo.findByPatientUserIdAndStatus(candidate.getPatientUserId(), AdaptiveRecommendationStatus.PENDING_REVIEW)
            .stream()
            .anyMatch(existing ->
                Objects.equals(existing.getDietPlanId(), candidate.getDietPlanId()) &&
                Objects.equals(existing.getRecommendationType(), candidate.getRecommendationType()));
        if (!alreadyPending) {
            generated.add(candidate);
        }
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
