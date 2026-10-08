package com.nutrisphere.medical.condition;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medical/conditions")
@RequiredArgsConstructor
public class ConditionController {
    private final ConditionService conditionService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ApiResponse<List<HealthCondition>> getAllConditions() {
        return ApiResponse.success(conditionService.getAllHealthConditions());
    }

    @GetMapping("/patient/{patientUserId}")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN')")
    public ApiResponse<List<PatientCondition>> getPatientConditions(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(conditionService.getPatientConditions(patientUserId));
    }

    @PostMapping("/patient")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN')")
    public ApiResponse<PatientCondition> addCondition(@RequestBody PatientCondition condition) {
        securityUtils.assertPatientAccess(condition.getPatientUserId());
        return ApiResponse.success(conditionService.addConditionToPatient(condition));
    }

    @DeleteMapping("/patient/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN')")
    public ApiResponse<Void> removeCondition(@PathVariable Long id) {
        PatientCondition condition = conditionService.getById(id);
        securityUtils.assertPatientAccess(condition.getPatientUserId());
        conditionService.removePatientCondition(id);
        return ApiResponse.success("Condition removed", null);
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<HealthCondition> createHealthCondition(@RequestBody HealthCondition condition) {
        return ApiResponse.success(conditionService.createHealthCondition(condition));
    }
}
