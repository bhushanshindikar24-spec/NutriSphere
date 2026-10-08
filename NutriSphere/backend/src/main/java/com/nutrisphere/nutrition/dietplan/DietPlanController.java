package com.nutrisphere.nutrition.dietplan;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.dietplan.dto.*;
import com.nutrisphere.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.nutrisphere.exception.ForbiddenException;

@RestController @RequestMapping("/api/nutrition/diet-plans") @RequiredArgsConstructor
public class DietPlanController {
    private final DietPlanService dietPlanService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<DietPlanResponse> create(@Valid @RequestBody DietPlanRequest req) {
        return ApiResponse.success(dietPlanService.createPlan(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/{id}")
    public ApiResponse<DietPlanResponse> getById(@PathVariable Long id) {
        return ApiResponse.success(dietPlanService.getPlanById(id));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<DietPlanResponse> approve(@PathVariable Long id,
            @RequestBody PlanApprovalRequest req) {
        return ApiResponse.success(dietPlanService.approvePlan(id, securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/patient/{patientUserId}")
    public ApiResponse<List<DietPlanResponse>> getForPatient(@PathVariable Long patientUserId) {
        assertPatientOwnsTarget(patientUserId);
        return ApiResponse.success(dietPlanService.getPlansForPatient(patientUserId));
    }

    @GetMapping("/patient/{patientUserId}/approved")
    public ApiResponse<List<DietPlanResponse>> getApprovedForPatient(@PathVariable Long patientUserId) {
        assertPatientOwnsTarget(patientUserId);
        return ApiResponse.success(dietPlanService.getApprovedPlanForPatient(patientUserId));
    }

    private void assertPatientOwnsTarget(Long patientUserId) {
        if (securityUtils.hasRole("PATIENT") && !patientUserId.equals(securityUtils.getCurrentUserId())) {
            throw new ForbiddenException("Cannot access another patient's diet plans");
        }
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<List<DietPlanResponse>> getMyPlans() {
        return ApiResponse.success(dietPlanService.getApprovedPlanForPatient(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/dietitian")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<List<DietPlanResponse>> getForDietitian() {
        return ApiResponse.success(dietPlanService.getPlansForDietitian(securityUtils.getCurrentUserId()));
    }

    @PostMapping("/{id}/meals")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<DietPlanMealResponse> addMeal(@PathVariable Long id,
            @RequestBody DietPlanMealRequest req) {
        return ApiResponse.success(dietPlanService.addMeal(id, securityUtils.getCurrentUserId(), req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<DietPlanResponse> update(@PathVariable Long id, @RequestBody DietPlanRequest req) {
        return ApiResponse.success(dietPlanService.updatePlan(id, securityUtils.getCurrentUserId(), req));
    }

    @PutMapping("/{planId}/meals/{mealId}")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<DietPlanMealResponse> updateMeal(@PathVariable Long planId, @PathVariable Long mealId,
            @RequestBody DietPlanMealRequest req) {
        return ApiResponse.success(dietPlanService.updateMeal(planId, mealId, securityUtils.getCurrentUserId(), req));
    }

    @DeleteMapping("/{planId}/meals/{mealId}")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<Void> deleteMeal(@PathVariable Long planId, @PathVariable Long mealId) {
        dietPlanService.deleteMeal(planId, mealId, securityUtils.getCurrentUserId());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/{planId}/meals/{mealId}/items/{itemId}")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<Void> deleteMealItem(@PathVariable Long planId, @PathVariable Long mealId,
            @PathVariable Long itemId) {
        dietPlanService.deleteMealItem(planId, mealId, itemId, securityUtils.getCurrentUserId());
        return ApiResponse.success(null);
    }
}
