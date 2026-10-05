package com.nutrisphere.doctor;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.doctor.dto.*;
import com.nutrisphere.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final SecurityUtils securityUtils;

    private final com.nutrisphere.assignment.AssignmentService assignmentService;

    @GetMapping("/profile")
    public ApiResponse<DoctorProfileResponse> getProfile() {
        return ApiResponse.success(doctorService.getProfile(securityUtils.getCurrentUserId()));
    }

    @PutMapping("/profile")
    public ApiResponse<DoctorProfileResponse> updateProfile(@RequestBody DoctorProfileRequest req) {
        return ApiResponse.success(doctorService.updateProfile(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/dashboard")
    public ApiResponse<DoctorDashboardResponse> getDashboard() {
        return ApiResponse.success(doctorService.getDashboard(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/patients")
    public ApiResponse<java.util.List<com.nutrisphere.assignment.dto.AssignmentResponse>> getPatients() {
        return ApiResponse.success(assignmentService.getDoctorPatients(securityUtils.getCurrentUserId()));
    }
}
