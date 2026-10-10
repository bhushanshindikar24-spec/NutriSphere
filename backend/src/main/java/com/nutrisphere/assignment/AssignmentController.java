package com.nutrisphere.assignment;

import com.nutrisphere.assignment.dto.*;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/assignments") @RequiredArgsConstructor
public class AssignmentController {
    private final AssignmentService assignmentService;
    private final SecurityUtils securityUtils;

    @PostMapping("/doctor/patients")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<AssignmentResponse> assignToDoctor(@Valid @RequestBody AssignPatientRequest req) {
        return ApiResponse.success(assignmentService.assignPatientToDoctor(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/doctor/patients")
    @PreAuthorize("hasRole('DOCTOR')")
    public ApiResponse<List<AssignmentResponse>> getDoctorPatients() {
        return ApiResponse.success(assignmentService.getDoctorPatients(securityUtils.getCurrentUserId()));
    }

    @PostMapping("/dietitian/patients")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<AssignmentResponse> assignToDietitian(@Valid @RequestBody AssignPatientRequest req) {
        return ApiResponse.success(assignmentService.assignPatientToDietitian(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/dietitian/patients")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<List<AssignmentResponse>> getDietitianPatients() {
        return ApiResponse.success(assignmentService.getDietitianPatients(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/patient/doctors")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<List<AssignmentResponse>> getPatientDoctors() {
        return ApiResponse.success(assignmentService.getPatientDoctors(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/patient/dietitians")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<List<AssignmentResponse>> getPatientDietitians() {
        return ApiResponse.success(assignmentService.getPatientDietitians(securityUtils.getCurrentUserId()));
    }

    @PostMapping("/patient/select-doctor")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<AssignmentResponse> selectDoctor(@RequestBody java.util.Map<String, Object> body) {
        Long doctorId = Long.valueOf(body.get("doctorId").toString());
        String notes = body.get("notes") != null ? body.get("notes").toString() : "Connected via Patient directory";
        return ApiResponse.success(assignmentService.assignPatientToDoctor(doctorId, securityUtils.getCurrentUserId(), notes));
    }

    @PostMapping("/patient/select-dietitian")
    @PreAuthorize("hasRole('PATIENT')")
    public ApiResponse<AssignmentResponse> selectDietitian(@RequestBody java.util.Map<String, Object> body) {
        Long dietitianId = Long.valueOf(body.get("dietitianId").toString());
        String notes = body.get("notes") != null ? body.get("notes").toString() : "Connected via Patient directory";
        return ApiResponse.success(assignmentService.assignPatientToDietitian(dietitianId, securityUtils.getCurrentUserId(), notes));
    }
}
