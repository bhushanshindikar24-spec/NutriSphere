package com.nutrisphere.patient;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.patient.dto.*;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;
    private final SecurityUtils securityUtils;

    @GetMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<PatientProfileResponse> getProfile() {
        return ApiResponse.success(patientService.getProfile(securityUtils.getCurrentUserId()));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<PatientProfileResponse> updateProfile(@RequestBody PatientProfileRequest req) {
        return ApiResponse.success(patientService.updateProfile(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<PatientDashboardResponse> getDashboard() {
        return ApiResponse.success(patientService.getDashboard(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/{patientId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'DIETITIAN', 'ADMIN')")
    public ApiResponse<PatientProfileResponse> getPatientById(@PathVariable Long patientId) {
        securityUtils.assertPatientAccess(patientId);
        return ApiResponse.success(patientService.getProfileByPatientId(patientId));
    }
}
