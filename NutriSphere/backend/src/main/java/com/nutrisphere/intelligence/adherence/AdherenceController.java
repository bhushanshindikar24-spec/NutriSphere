package com.nutrisphere.intelligence.adherence;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.nutrisphere.exception.ForbiddenException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping({"/api/barriers", "/api/adherence/barriers", "/api/adherence"})
@RequiredArgsConstructor
public class AdherenceController {
    private final AdherenceService adherenceService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasAnyRole('PATIENT', 'DIETITIAN')")
    public ApiResponse<AdherenceBarrier> recordBarrier(@RequestBody BarrierRequest req) {
        Long uid = securityUtils.getCurrentUserId();
        return ApiResponse.success(adherenceService.recordBarrier(
            uid, req.getBarrierType(),
            req.getBarrierDate() != null ? req.getBarrierDate() : LocalDate.now(),
            req.getMealType(), req.getDescription(), req.getDietPlanMealId()));
    }

    @GetMapping
    public ApiResponse<List<AdherenceBarrier>> getBarriers(@RequestParam(required = false) Long patientUserId) {
        Long uid = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        securityUtils.assertPatientAccess(uid);
        return ApiResponse.success(adherenceService.getBarriers(uid));
    }

    @GetMapping("/my")
    public ApiResponse<List<AdherenceBarrier>> getMyBarriers() {
        return ApiResponse.success(adherenceService.getBarriers(securityUtils.getCurrentUserId()));
    }

    @GetMapping({"/analysis", "/summary"})
    public ApiResponse<BarrierAnalysisResult> analyze(@RequestParam(required = false) Long patientUserId) {
        Long uid = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        assertPatientOwnsTarget(uid);
        return ApiResponse.success(adherenceService.analyze(uid));
    }

    @PutMapping("/{id}/resolve")
    public ApiResponse<String> resolveBarrier(@PathVariable Long id) {
        adherenceService.resolveBarrier(id, securityUtils.getCurrentUserId(), securityUtils.hasRole("PATIENT"));
        return ApiResponse.success("Barrier resolved successfully", null);
    }

    @Data
    public static class BarrierRequest {
        private String barrierType;
        private LocalDate barrierDate;
        private String mealType;
        private String description;
        private Long dietPlanMealId;
    }
}
