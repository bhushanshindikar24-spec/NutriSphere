package com.nutrisphere.intelligence.adaptive;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;

/**
 * AdaptiveDietEngine orchestrates the adaptive diet recommendation pipeline.
 * It analyzes patient adherence patterns and generates actionable suggestions
 * for dietitian review. It does NOT automatically modify approved diet plans.
 */
@Component
@RequiredArgsConstructor
public class AdaptiveDietEngine {
    private final AdaptiveEngineService engineService;

    /**
     * Run full adaptive analysis for a patient and their current diet plan.
     * Returns list of generated recommendations pending dietitian review.
     */
    public List<AdaptiveRecommendation> analyze(Long patientUserId, Long dietPlanId) {
        return engineService.generateRecommendations(patientUserId, dietPlanId);
    }

    /**
     * Get all pending recommendations for a specific diet plan.
     */
    public List<AdaptiveRecommendation> getPendingReviews(Long dietPlanId) {
        return engineService.getPendingReviews(dietPlanId);
    }

    /**
     * Get all recommendations for a patient (all statuses).
     */
    public List<AdaptiveRecommendation> getAllForPatient(Long patientUserId) {
        return engineService.getForPatient(patientUserId);
    }
}
