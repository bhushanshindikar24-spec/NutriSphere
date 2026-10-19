package com.nutrisphere.medical.history;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
@RestController @RequestMapping("/api/medical/history") @RequiredArgsConstructor
public class MedicalHistoryController {
    private final MedicalHistoryRepository repo;
    private final SecurityUtils securityUtils;

    @GetMapping("/patient/{patientUserId}")
    @PreAuthorize("hasAnyRole('DOCTOR','DIETITIAN','PATIENT','ADMIN')")
    public ApiResponse<List<MedicalHistory>> getForPatient(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(repo.findByPatientUserIdOrderByDiagnosisDateDesc(patientUserId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<List<MedicalHistory>> getMyHistory() {
        return ApiResponse.success(repo.findByPatientUserIdOrderByDiagnosisDateDesc(securityUtils.getCurrentUserId()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT','ADMIN')")
    public ApiResponse<MedicalHistory> create(@RequestBody MedicalHistory h) {
        if (securityUtils.hasRole("PATIENT")) {
            h.setPatientUserId(securityUtils.getCurrentUserId());
        } else {
            securityUtils.assertPatientAccess(h.getPatientUserId());
            h.setDoctorUserId(securityUtils.getCurrentUserId());
        }
        return ApiResponse.success(repo.save(h));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT','ADMIN')")
    public ApiResponse<MedicalHistory> update(@PathVariable Long id, @RequestBody MedicalHistory updates) {
        MedicalHistory existing = repo.findById(id)
            .orElseThrow(() -> new com.nutrisphere.exception.ResourceNotFoundException("MedicalHistory", id));
        securityUtils.assertPatientAccess(existing.getPatientUserId());
        if (updates.getConditionName() != null) existing.setConditionName(updates.getConditionName());
        if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
        if (updates.getDiagnosisDate() != null) existing.setDiagnosisDate(updates.getDiagnosisDate());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        if (updates.getTreatment() != null) existing.setTreatment(updates.getTreatment());
        if (updates.getMedications() != null) existing.setMedications(updates.getMedications());
        if (updates.getSeverity() != null) existing.setSeverity(updates.getSeverity());
        if (updates.getOngoingTreatments() != null) existing.setOngoingTreatments(updates.getOngoingTreatments());
        if (updates.getPastSurgeries() != null) existing.setPastSurgeries(updates.getPastSurgeries());
        if (updates.getRelevantSymptoms() != null) existing.setRelevantSymptoms(updates.getRelevantSymptoms());
        if (updates.getFamilyMembersAffected() != null) existing.setFamilyMembersAffected(updates.getFamilyMembersAffected());
        if (updates.getHereditaryRiskFactors() != null) existing.setHereditaryRiskFactors(updates.getHereditaryRiskFactors());
        if (updates.getFamilyHistoryDetails() != null) existing.setFamilyHistoryDetails(updates.getFamilyHistoryDetails());
        return ApiResponse.success(repo.save(existing));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR','PATIENT','ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        MedicalHistory existing = repo.findById(id)
            .orElseThrow(() -> new com.nutrisphere.exception.ResourceNotFoundException("MedicalHistory", id));
        securityUtils.assertPatientAccess(existing.getPatientUserId());
        existing.setActive(false);
        repo.save(existing);
        return ApiResponse.success("Archived", null);
    }
}
