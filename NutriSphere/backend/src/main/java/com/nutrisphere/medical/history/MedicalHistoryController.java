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

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<MedicalHistory> create(@RequestBody MedicalHistory h) {
        securityUtils.assertPatientAccess(h.getPatientUserId());
        h.setDoctorUserId(securityUtils.getCurrentUserId());
        return ApiResponse.success(repo.save(h));
    }
}
