package com.nutrisphere.medical.laboratory;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medical/laboratory")
@RequiredArgsConstructor
public class LaboratoryController {
    private final LaboratoryService labService;
    private final SecurityUtils securityUtils;

    @GetMapping("/patient/{patientUserId}")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN','PATIENT','ADMIN')")
    public ApiResponse<List<LaboratoryReport>> getForPatient(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(labService.getForPatient(patientUserId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN','PATIENT')")
    public ApiResponse<LaboratoryReport> getById(@PathVariable Long id) {
        LaboratoryReport report = labService.getById(id);
        securityUtils.assertPatientAccess(report.getPatientUserId());
        return ApiResponse.success(report);
    }

    @GetMapping("/{id}/values")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN','PATIENT')")
    public ApiResponse<List<LaboratoryValue>> getValues(@PathVariable Long id) {
        LaboratoryReport report = labService.getById(id);
        if (securityUtils.hasRole("PATIENT") && !securityUtils.getCurrentUserId().equals(report.getPatientUserId())) {
            throw new com.nutrisphere.exception.ForbiddenException("Not authorized");
        }
        return ApiResponse.success(labService.getValues(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ApiResponse<LaboratoryReport> create(@RequestBody LaboratoryReport report) {
        securityUtils.assertPatientAccess(report.getPatientUserId());
        report.setDoctorUserId(securityUtils.getCurrentUserId());
        return ApiResponse.success(labService.create(report));
    }

    @PostMapping("/{id}/values")
    @PreAuthorize("hasAnyRole('DOCTOR','ADMIN')")
    public ApiResponse<LaboratoryValue> addValue(@PathVariable Long id, @RequestBody LaboratoryValue value) {
        LaboratoryReport report = labService.getById(id);
        securityUtils.assertPatientAccess(report.getPatientUserId());
        value.setReportId(id);
        return ApiResponse.success(labService.addValue(value));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<LaboratoryReport> update(@PathVariable Long id, @RequestBody LaboratoryReport updates) {
        LaboratoryReport existing = labService.getById(id);
        securityUtils.assertPatientAccess(existing.getPatientUserId());
        return ApiResponse.success(labService.update(id, updates));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        LaboratoryReport existing = labService.getById(id);
        securityUtils.assertPatientAccess(existing.getPatientUserId());
        labService.delete(id);
        return ApiResponse.success("Deleted", null);
    }
}
