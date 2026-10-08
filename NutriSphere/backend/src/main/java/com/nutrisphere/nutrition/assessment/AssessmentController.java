package com.nutrisphere.nutrition.assessment;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.assessment.dto.*;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.nutrisphere.exception.ForbiddenException;

import java.util.List;

@RestController
@RequestMapping({"/api/nutrition/assessments", "/api/assessments", "/api/dietitians/assessments"})
@RequiredArgsConstructor
public class AssessmentController {
    private final AssessmentService assessmentService;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR', 'ADMIN')")
    public ApiResponse<AssessmentResponse> create(@RequestBody AssessmentRequest req) {
        Long patientId = req.getPatientUserId() != null ? req.getPatientUserId() : req.getPatientId();
        securityUtils.assertPatientAccess(patientId);
        return ApiResponse.success(assessmentService.create(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR', 'PATIENT', 'ADMIN')")
    public ApiResponse<AssessmentResponse> getById(@PathVariable Long id) {
        AssessmentResponse response = assessmentService.getById(id);
        securityUtils.assertPatientAccess(response.getPatientUserId());
        return ApiResponse.success(response);
    }

    @GetMapping("/patient/{patientUserId}")
    @PreAuthorize("hasAnyRole('DIETITIAN', 'DOCTOR', 'PATIENT', 'ADMIN')")
    public ApiResponse<List<AssessmentResponse>> getForPatient(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(assessmentService.getForPatient(patientUserId));
    }
}
