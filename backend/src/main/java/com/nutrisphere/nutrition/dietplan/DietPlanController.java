package com.nutrisphere.nutrition.dietplan;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.dietplan.dto.*;
import com.nutrisphere.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController 
@RequestMapping({"/api/nutrition/diet-plans", "/api/diet-plans"}) 
@RequiredArgsConstructor
public class DietPlanController {
    private final DietPlanService dietPlanService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasAnyRole('DIETITIAN', 'PATIENT')")
    public ApiResponse<DietPlanResponse> create(@Valid @RequestBody DietPlanRequest req) {
        Long patientId = req.getPatientUserId() != null ? req.getPatientUserId() : securityUtils.getCurrentUserId();
        securityUtils.assertPatientAccess(patientId);
        return ApiResponse.success(dietPlanService.createPlan(securityUtils.getCurrentUserId(), req));
    }

    @PostMapping("/generate-ai")
    @PreAuthorize("hasAnyRole('PATIENT', 'DIETITIAN')")
    public ApiResponse<DietPlanResponse> generateAiDietPlan(
            @RequestParam(required = false) Long patientUserId,
            @RequestParam(defaultValue = "10") Integer durationDays) {
        Long targetPatientId = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        securityUtils.assertPatientAccess(targetPatientId);
        return ApiResponse.success(dietPlanService.generateAiPlan(targetPatientId, securityUtils.getCurrentUserId(), durationDays != null ? durationDays : 10));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<List<DietPlanResponse>> getPendingPlans() {
        return ApiResponse.success(dietPlanService.getPendingPlansForDietitian(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('PATIENT', 'DIETITIAN')")
    public ApiResponse<List<DietPlanResponse>> getMyPlans() {
        return ApiResponse.success(dietPlanService.getApprovedPlanForPatient(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/dietitian")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<List<DietPlanResponse>> getForDietitian() {
        return ApiResponse.success(dietPlanService.getPlansForDietitian(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/patient/{patientUserId}")
    public ApiResponse<List<DietPlanResponse>> getForPatient(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(dietPlanService.getPlansForPatient(patientUserId));
    }

    @GetMapping("/patient/{patientUserId}/approved")
    public ApiResponse<List<DietPlanResponse>> getApprovedForPatient(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(dietPlanService.getApprovedPlanForPatient(patientUserId));
    }

    @GetMapping("/{id}")
    public ApiResponse<DietPlanResponse> getById(@PathVariable Long id) {
        DietPlanResponse plan = dietPlanService.getPlanById(id);
        securityUtils.assertPatientAccess(plan.getPatientUserId());
        return ApiResponse.success(plan);
    }

    @PostMapping("/{id}/meals")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'PATIENT')")
    public ApiResponse<DietPlanMealResponse> addMeal(@PathVariable Long id,
            @RequestBody DietPlanMealRequest req) {
        return ApiResponse.success(dietPlanService.addMeal(id, securityUtils.getCurrentUserId(), req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'PATIENT')")
    public ApiResponse<DietPlanResponse> update(@PathVariable Long id, @RequestBody DietPlanRequest req) {
        return ApiResponse.success(dietPlanService.updatePlan(id, securityUtils.getCurrentUserId(), req));
    }

    @PutMapping("/{planId}/meals/{mealId}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'PATIENT')")
    public ApiResponse<DietPlanMealResponse> updateMeal(@PathVariable Long planId, @PathVariable Long mealId,
            @RequestBody DietPlanMealRequest req) {
        return ApiResponse.success(dietPlanService.updateMeal(planId, mealId, securityUtils.getCurrentUserId(), req));
    }

    @DeleteMapping("/{planId}/meals/{mealId}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'PATIENT')")
    public ApiResponse<Void> deleteMeal(@PathVariable Long planId, @PathVariable Long mealId) {
        dietPlanService.deleteMeal(planId, mealId, securityUtils.getCurrentUserId());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{planId}/meals/{mealId}/items/{itemId}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'PATIENT')")
    public ApiResponse<Void> deleteMealItem(@PathVariable Long planId, @PathVariable Long mealId,
            @PathVariable Long itemId) {
        dietPlanService.deleteMealItem(planId, mealId, itemId, securityUtils.getCurrentUserId());
        return ApiResponse.success(null);
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR')")
    public ApiResponse<DietPlanResponse> approvePlan(
            @PathVariable Long id,
            @RequestBody(required = false) PlanApprovalRequest req) {
        return ApiResponse.success(dietPlanService.approvePlan(id, securityUtils.getCurrentUserId(), req));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR')")
    public ApiResponse<DietPlanResponse> rejectPlan(
            @PathVariable Long id,
            @RequestParam(required = false) String notes) {
        return ApiResponse.success(dietPlanService.rejectPlan(id, securityUtils.getCurrentUserId(), notes));
    }
}
