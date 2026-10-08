package com.nutrisphere.medical.report;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medical/reports")
@RequiredArgsConstructor
public class MedicalReportController {
    private final MedicalReportService reportService;
    private final SecurityUtils securityUtils;

    @GetMapping("/patient/{patientUserId}")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN','PATIENT')")
    public ApiResponse<List<MedicalReport>> getForPatient(@PathVariable Long patientUserId) {
        return ApiResponse.success(reportService.getForPatient(patientUserId, securityUtils.getCurrentUserId(), securityUtils.hasRole("PATIENT")));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN','PATIENT')")
    public ApiResponse<MedicalReport> getById(@PathVariable Long id) {
        return ApiResponse.success(reportService.getById(id, securityUtils.getCurrentUserId(), securityUtils.hasRole("PATIENT")));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT')")
    public ApiResponse<MedicalReport> create(@RequestBody MedicalReport report) {
        Long currentUserId = securityUtils.getCurrentUserId();
        report.setUploadedByUserId(currentUserId);
        if (securityUtils.hasRole("PATIENT")) {
            report.setPatientUserId(currentUserId);
        }
        return ApiResponse.success(reportService.create(report));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<MedicalReport> update(@PathVariable Long id, @RequestBody MedicalReport updates) {
        return ApiResponse.success(reportService.update(id, updates, securityUtils.getCurrentUserId(), securityUtils.hasRole("PATIENT")));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        reportService.delete(id, securityUtils.getCurrentUserId(), securityUtils.hasRole("PATIENT"));
        return ApiResponse.success("Deleted", null);
    }
}
