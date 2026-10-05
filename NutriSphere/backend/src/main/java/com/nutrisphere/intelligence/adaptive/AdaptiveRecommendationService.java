package com.nutrisphere.intelligence.adaptive;

import com.nutrisphere.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * AdaptiveRecommendationService handles CRUD for adaptive recommendations
 * and dietitian review workflow.
 */
@Service
@RequiredArgsConstructor
public class AdaptiveRecommendationService {
    private final AdaptiveRecommendationRepository repo;

    public List<AdaptiveRecommendation> getForPatient(Long patientUserId) {
        return repo.findByPatientUserIdOrderByCreatedAtDesc(patientUserId);
    }

    public List<AdaptiveRecommendation> getPendingForPlan(Long dietPlanId) {
        return repo.findByDietPlanIdOrderByCreatedAtDesc(dietPlanId)
            .stream()
            .filter(r -> r.getStatus() == AdaptiveRecommendationStatus.PENDING_REVIEW)
            .toList();
    }

    public AdaptiveRecommendation getById(Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("AdaptiveRecommendation", id));
    }

    @Transactional
    public AdaptiveRecommendation review(Long id, Long dietitianUserId, boolean approved, String notes) {
        AdaptiveRecommendation rec = getById(id);
        rec.setStatus(approved ? AdaptiveRecommendationStatus.APPROVED : AdaptiveRecommendationStatus.REJECTED);
        rec.setReviewedByUserId(dietitianUserId);
        rec.setReviewNotes(notes);
        rec.setReviewedAt(java.time.LocalDateTime.now());
        return repo.save(rec);
    }

    @Transactional
    public AdaptiveRecommendation markImplemented(Long id) {
        AdaptiveRecommendation rec = getById(id);
        rec.setStatus(AdaptiveRecommendationStatus.IMPLEMENTED);
        return repo.save(rec);
    }
}
