package com.nutrisphere.ai;

import com.nutrisphere.ai.dto.AIRecommendationRequest;
import com.nutrisphere.ai.dto.AIRecommendationResponse;
import com.nutrisphere.ai.dto.AISummaryResponse;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.nutrisphere.exception.ForbiddenException;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;
    private final AIRecommendationService recommendationService;
    private final SecurityUtils securityUtils;

    @PostMapping("/query")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<AIResponse> query(@RequestBody AIRequest request) {
        if (request.getPatientUserId() == null) {
            request.setPatientUserId(securityUtils.getCurrentUserId());
        } else if (securityUtils.hasRole("PATIENT") && !request.getPatientUserId().equals(securityUtils.getCurrentUserId())) {
            throw new ForbiddenException("Cannot query another patient's clinical data");
        }
        return ApiResponse.success(aiService.query(request));
    }

    @PostMapping("/recommendations")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR')")
    public ApiResponse<AIRecommendationResponse> getRecommendations(@RequestBody AIRecommendationRequest request) {
        return ApiResponse.success(recommendationService.getRecommendations(request));
    }

    @GetMapping("/summary/{patientUserId}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR', 'PATIENT')")
    public ApiResponse<AISummaryResponse> getPatientSummary(@PathVariable Long patientUserId) {
        if (securityUtils.hasRole("PATIENT") && !patientUserId.equals(securityUtils.getCurrentUserId())) {
            throw new ForbiddenException("Cannot access another patient's AI summary");
        }
        return ApiResponse.success(aiService.getPatientSummary(patientUserId));
    }
}
