package com.nutrisphere.medical.consultation;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import com.nutrisphere.user.User;
import com.nutrisphere.user.UserRepository;
import lombok.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.nutrisphere.exception.BadRequestException;
import java.security.SecureRandom;
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
    private static final SecureRandom OTP_RANDOM = new SecureRandom();

    private static String generateOtp() {
        return String.format("%04d", OTP_RANDOM.nextInt(10000));
    }

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
        c.setSymptomsDiscussed(request.getSymptomsDiscussed());
        c.setPrescribedMedicines(request.getPrescribedMedicines());
        c.setFollowUpInstructions(request.getFollowUpInstructions());
        if (request.getFollowUpDate() != null) c.setFollowUpDate(request.getFollowUpDate());
        if (request.getVitalSigns() != null) {
            c.setBloodPressure(request.getVitalSigns().getBloodPressure());
            c.setHeartRate(request.getVitalSigns().getHeartRate());
        }
        if (c.getBloodPressure() == null) c.setBloodPressure(request.getBloodPressure());
        if (c.getHeartRate() == null) c.setHeartRate(request.getHeartRate());
        
        c.setStatus(request.getStatus() != null && !request.getStatus().isBlank() ? request.getStatus() : "PENDING");
        c.setVerificationOtp(generateOtp());

        Consultation saved = repo.save(c);
        populateTransientFields(List.of(saved));
        return ApiResponse.success(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ApiResponse<Consultation> update(
            @PathVariable Long id, 
            @RequestBody ConsultationRequest request) {
        Consultation c = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation not found with id: " + id));
        securityUtils.assertPatientAccess(c.getPatientUserId());

        if (request.getChiefComplaint() != null) c.setChiefComplaint(request.getChiefComplaint());
        if (request.getDiagnosis() != null) c.setDiagnosis(request.getDiagnosis());
        if (request.getIcdCode() != null) c.setIcdCode(request.getIcdCode());
        if (request.getClinicalNotes() != null) c.setClinicalNotes(request.getClinicalNotes());
        if (request.getDietaryDirectives() != null) c.setDietaryDirectives(request.getDietaryDirectives());
        if (request.getSymptomsDiscussed() != null) c.setSymptomsDiscussed(request.getSymptomsDiscussed());
        if (request.getPrescribedMedicines() != null) c.setPrescribedMedicines(request.getPrescribedMedicines());
        if (request.getFollowUpInstructions() != null) c.setFollowUpInstructions(request.getFollowUpInstructions());
        if (request.getFollowUpDate() != null) c.setFollowUpDate(request.getFollowUpDate());
        if (request.getBloodPressure() != null) c.setBloodPressure(request.getBloodPressure());
        if (request.getHeartRate() != null) c.setHeartRate(request.getHeartRate());
        if (request.getStatus() != null) c.setStatus(request.getStatus());

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
        securityUtils.assertPatientAccess(c.getPatientUserId());
        String enteredOtp = body.get("otp");
        if (c.getVerificationOtp() == null || enteredOtp == null
                || !java.security.MessageDigest.isEqual(c.getVerificationOtp().getBytes(), enteredOtp.trim().getBytes())) {
            throw new BadRequestException("Invalid consultation verification OTP. Ask the patient for the 4-digit code shown in their Consultations page.");
        }
        c.setStatus("COMPLETED");
        c.setVerificationOtp(null);
        Consultation saved = repo.save(c);
        populateTransientFields(List.of(saved));
        return ApiResponse.success(saved);
    }

    private void populateTransientFields(List<Consultation> list) {
        Long viewerId = securityUtils.getCurrentUserId();
        boolean viewerIsPatient = securityUtils.hasRole("PATIENT");
        for (Consultation c : list) {
            // Only the patient sees their own OTP; doctors must obtain it from the patient.
            c.setOtp(viewerIsPatient && viewerId.equals(c.getPatientUserId()) ? c.getVerificationOtp() : null);
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
                vitals.put("bloodPressure", c.getBloodPressure());
                vitals.put("heartRate", c.getHeartRate());
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
        private LocalDateTime followUpDate;
        private String chiefComplaint;
        private String diagnosis;
        private String icdCode;
        private String clinicalNotes;
        private String dietaryDirectives;
        private String symptomsDiscussed;
        private String prescribedMedicines;
        private String followUpInstructions;
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
