package com.nutrisphere.medical.consultation;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import com.nutrisphere.user.User;
import com.nutrisphere.user.UserRepository;
import lombok.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medical/consultations")
@RequiredArgsConstructor
public class ConsultationController {
    private final ConsultationRepository repo;
    private final SecurityUtils securityUtils;
    private final UserRepository userRepository;

    @GetMapping({"", "/doctor"})
    @PreAuthorize("hasAnyRole('DOCTOR', 'DIETITIAN', 'ADMIN')")
    public ApiResponse<List<Consultation>> getAllForDoctor() {
        Long currentUserId = securityUtils.getCurrentUserId();
        List<Consultation> list;
        if (securityUtils.hasRole("ADMIN")) {
            list = repo.findAll();
        } else {
            list = repo.findByDoctorUserIdOrderByConsultationDateDesc(currentUserId);
        }
        populateTransientFields(list);
        return ApiResponse.success(list);
    }

    @GetMapping({"/patient", "/my-consultations", "/my"})
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'DIETITIAN', 'ADMIN')")
    public ApiResponse<List<Consultation>> getMyConsultations() {
        Long currentUserId = securityUtils.getCurrentUserId();
        List<Consultation> list = repo.findByPatientUserIdOrderByConsultationDateDesc(currentUserId);
        populateTransientFields(list);
        return ApiResponse.success(list);
    }

    @GetMapping("/patient/{patientUserId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'DIETITIAN', 'PATIENT', 'ADMIN')")
    public ApiResponse<List<Consultation>> getForPatient(@PathVariable Long patientUserId) {
        Long currentUserId = securityUtils.getCurrentUserId();
        securityUtils.assertPatientAccess(patientUserId);
        List<Consultation> list = repo.findByPatientUserIdOrderByConsultationDateDesc(patientUserId);
        populateTransientFields(list);
        return ApiResponse.success(list);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'DIETITIAN', 'PATIENT', 'ADMIN')")
    public ApiResponse<Consultation> getById(@PathVariable Long id) {
        Consultation c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
        Long currentUserId = securityUtils.getCurrentUserId();
        securityUtils.assertPatientAccess(c.getPatientUserId());
        populateTransientFields(List.of(c));
        return ApiResponse.success(c);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN', 'PATIENT')")
    public ApiResponse<Consultation> create(@RequestBody ConsultationRequest request) {
        Long currentUserId = securityUtils.getCurrentUserId();
        Consultation c = new Consultation();
        Long patientId = request.getPatientId() != null ? request.getPatientId() : request.getPatientUserId();
        if (patientId == null) {
            patientId = currentUserId;
        }
        c.setPatientUserId(patientId);

        Long doctorId = request.getDoctorUserId() != null ? request.getDoctorUserId() : currentUserId;
        c.setDoctorUserId(doctorId);
        c.setConsultationDate(request.getConsultationDate() != null ? request.getConsultationDate() : LocalDateTime.now());
        c.setChiefComplaint(request.getChiefComplaint());
        c.setDiagnosis(request.getDiagnosis());
        c.setIcdCode(request.getIcdCode());
        c.setClinicalNotes(request.getClinicalNotes());
        c.setDietaryDirectives(request.getDietaryDirectives());
        if (request.getVitalSigns() != null) {
            c.setBloodPressure(request.getVitalSigns().getBloodPressure());
            c.setHeartRate(request.getVitalSigns().getHeartRate());
        }
        if (c.getBloodPressure() == null) c.setBloodPressure(request.getBloodPressure());
        if (c.getHeartRate() == null) c.setHeartRate(request.getHeartRate());
        
        // Status defaults to PENDING (with dummy OTP 1234)
        c.setStatus(request.getStatus() != null && !request.getStatus().isBlank() ? request.getStatus() : "PENDING");
        c.setOtp("1234");

        Consultation saved = repo.save(c);
        populateTransientFields(List.of(saved));
        return ApiResponse.success(saved);
    }

    @PostMapping("/{id}/verify-otp")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ApiResponse<Consultation> verifyOtpAndComplete(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body) {
        Consultation c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
        String enteredOtp = body.get("otp");
        if (enteredOtp == null || !enteredOtp.trim().equals("1234")) {
            throw new RuntimeException("Invalid consultation verification OTP. Please provide the patient's 4-digit OTP (1234).");
        }
        c.setStatus("COMPLETED");
        Consultation saved = repo.save(c);
        populateTransientFields(List.of(saved));
        return ApiResponse.success(saved);
    }

    private void populateTransientFields(List<Consultation> list) {
        for (Consultation c : list) {
            c.setOtp("1234");
            if (c.getStatus() == null || c.getStatus().isBlank()) {
                c.setStatus("PENDING");
            }
            if (c.getPatientUserId() != null) {
                userRepository.findById(c.getPatientUserId()).ifPresent(u -> {
                    c.setPatientName(u.getFirstName() + " " + u.getLastName());
                });
            }
            if (c.getDoctorUserId() != null) {
                userRepository.findById(c.getDoctorUserId()).ifPresent(u -> {
                    c.setPhysicianName("Dr. " + u.getFirstName() + " " + u.getLastName());
                });
            }
            if (c.getBloodPressure() != null || c.getHeartRate() != null) {
                Map<String, String> vitals = new HashMap<>();
                vitals.put("bloodPressure", c.getBloodPressure() != null ? c.getBloodPressure() : "120/80");
                vitals.put("heartRate", c.getHeartRate() != null ? c.getHeartRate() : "72");
                c.setVitalSigns(vitals);
            }
        }
    }

    @Data
    public static class ConsultationRequest {
        private Long patientId;
        private Long patientUserId;
        private Long doctorUserId;
        private LocalDateTime consultationDate;
        private String chiefComplaint;
        private String diagnosis;
        private String icdCode;
        private String clinicalNotes;
        private String dietaryDirectives;
        private String bloodPressure;
        private String heartRate;
        private String status;
        private VitalSignsDto vitalSigns;
    }

    @Data
    public static class VitalSignsDto {
        private String bloodPressure;
        private String heartRate;
    }
}
