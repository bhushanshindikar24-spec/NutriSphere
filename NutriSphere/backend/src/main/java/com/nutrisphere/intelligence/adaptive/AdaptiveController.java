package com.nutrisphere.intelligence.adaptive;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adaptive")
@RequiredArgsConstructor
public class AdaptiveController {
    private final AdaptiveEngineService adaptiveEngineService;
    private final SecurityUtils securityUtils;

    @PostMapping("/generate")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'ADMIN')")
    public ApiResponse<List<AdaptiveRecommendation>> generate(
            @RequestParam(required = false) Long patientUserId,
            @RequestParam(required = false) Long dietPlanId,
            @RequestBody(required = false) GenerateRequest req) {
        Long pId = patientUserId != null ? patientUserId : (req != null ? req.getPatientUserId() : null);
        Long dpId = dietPlanId != null ? dietPlanId : (req != null ? req.getDietPlanId() : null);
        return ApiResponse.success(adaptiveEngineService.generateRecommendations(pId, dpId));
    }

    @Data
    public static class GenerateRequest {
        private Long patientUserId;
        private Long dietPlanId;
    }

    @PostMapping("/evaluate")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<List<AdaptiveRecommendation>> evaluate(
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long patientUserId,
            @RequestParam(required = false) Long dietPlanId) {
        Long pId = patientId != null ? patientId : (patientUserId != null ? patientUserId : securityUtils.getCurrentUserId());
        return ApiResponse.success(adaptiveEngineService.generateRecommendations(pId, dietPlanId));
    }

    @GetMapping("/patient/{patientUserId}")
    public ApiResponse<List<AdaptiveRecommendation>> getForPatient(@PathVariable Long patientUserId) {
        return ApiResponse.success(adaptiveEngineService.getForPatient(patientUserId));
    }

    @GetMapping("/recommendations")
    public ApiResponse<List<AdaptiveRecommendation>> getRecommendations(
            @RequestParam(required = false) Long patientUserId) {
        Long uid = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        return ApiResponse.success(adaptiveEngineService.getForPatient(uid));
    }

    @GetMapping("/recommendations/pending")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<List<AdaptiveRecommendation>> getPendingRecommendations(
            @RequestParam(required = false) Long patientUserId) {
        Long uid = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        return ApiResponse.success(adaptiveEngineService.getForPatient(uid).stream()
            .filter(r -> r.getStatus() == AdaptiveRecommendationStatus.PENDING_REVIEW).toList());
    }

    @GetMapping("/plan/{dietPlanId}/pending")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<List<AdaptiveRecommendation>> getPending(@PathVariable Long dietPlanId) {
        return ApiResponse.success(adaptiveEngineService.getPendingReviews(dietPlanId));
    }

    @PostMapping({"/{id}/review", "/recommendations/{id}/review"})
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<AdaptiveRecommendation> review(@PathVariable Long id,
            @RequestBody ReviewRequest req) {
        return ApiResponse.success(adaptiveEngineService.reviewRecommendation(
            id, securityUtils.getCurrentUserId(), req.isApproved(), req.getNotes()));
    }

    @PutMapping({"/recommendations/{id}/approve", "/{id}/approve"})
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<AdaptiveRecommendation> approve(@PathVariable Long id) {
        return ApiResponse.success(adaptiveEngineService.reviewRecommendation(
            id, securityUtils.getCurrentUserId(), true, "Approved by Dietitian"));
    }

    @PutMapping({"/recommendations/{id}/reject", "/{id}/reject"})
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<AdaptiveRecommendation> reject(@PathVariable Long id) {
        return ApiResponse.success(adaptiveEngineService.reviewRecommendation(
            id, securityUtils.getCurrentUserId(), false, "Rejected by Dietitian"));
    }

    @Data
    public static class ReviewRequest {
        private boolean approved;
        private String notes;
    }
}
