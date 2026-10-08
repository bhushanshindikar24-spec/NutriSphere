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
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN','PATIENT','ADMIN')")
    public ApiResponse<List<MedicalReport>> getForPatient(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(reportService.getForPatient(patientUserId, securityUtils.getCurrentUserId(), securityUtils.hasRole("PATIENT")));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN','PATIENT','ADMIN')")
    public ApiResponse<MedicalReport> getById(@PathVariable Long id) {
        MedicalReport report = reportService.getById(id, securityUtils.getCurrentUserId(), securityUtils.hasRole("PATIENT"));
        securityUtils.assertPatientAccess(report.getPatientUserId());
        return ApiResponse.success(report);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT','ADMIN')")
    public ApiResponse<MedicalReport> create(@RequestBody MedicalReport report) {
        Long currentUserId = securityUtils.getCurrentUserId();
        Long patientUserId = securityUtils.hasRole("PATIENT") ? currentUserId : report.getPatientUserId();
        securityUtils.assertPatientAccess(patientUserId);
        report.setPatientUserId(patientUserId);
        report.setUploadedByUserId(currentUserId);
        return ApiResponse.success(reportService.create(report));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ApiResponse<MedicalReport> update(@PathVariable Long id, @RequestBody MedicalReport updates) {
        MedicalReport existing = reportService.getById(id, securityUtils.getCurrentUserId(), false);
        securityUtils.assertPatientAccess(existing.getPatientUserId());
        return ApiResponse.success(reportService.update(id, updates, securityUtils.getCurrentUserId(), false));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        MedicalReport existing = reportService.getById(id, securityUtils.getCurrentUserId(), false);
        securityUtils.assertPatientAccess(existing.getPatientUserId());
        reportService.delete(id, securityUtils.getCurrentUserId(), false);
        return ApiResponse.success("Deleted", null);
    }
}
