package com.nutrisphere.dietitian;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.dietitian.dto.*;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/dietitians") @RequiredArgsConstructor
public class DietitianController {
    private final DietitianService dietitianService;
    private final SecurityUtils securityUtils;

    private final com.nutrisphere.assignment.AssignmentService assignmentService;

    @GetMapping("/profile")
    public ApiResponse<DietitianProfileResponse> getProfile() {
        return ApiResponse.success(dietitianService.getProfile(securityUtils.getCurrentUserId()));
    }
    @PutMapping("/profile")
    public ApiResponse<DietitianProfileResponse> updateProfile(@RequestBody DietitianProfileRequest req) {
        return ApiResponse.success(dietitianService.updateProfile(securityUtils.getCurrentUserId(), req));
    }
    @GetMapping("/dashboard")
    public ApiResponse<DietitianDashboardResponse> getDashboard() {
        return ApiResponse.success(dietitianService.getDashboard(securityUtils.getCurrentUserId()));
    }
    @GetMapping("/directory")
    public ApiResponse<java.util.List<DietitianProfileResponse>> getDirectory() {
        return ApiResponse.success(dietitianService.getDietitianDirectory());
    }

    @GetMapping("/{id}")
    public ApiResponse<DietitianProfileResponse> getDietitianById(@PathVariable Long id) {
        return ApiResponse.success(dietitianService.getDietitianById(id));
    }

    @GetMapping("/patients")
    public ApiResponse<java.util.List<com.nutrisphere.assignment.dto.AssignmentResponse>> getPatients() {
        return ApiResponse.success(assignmentService.getDietitianPatients(securityUtils.getCurrentUserId()));
    }

    @PostMapping("/patients")
    public ApiResponse<com.nutrisphere.assignment.dto.AssignmentResponse> assignPatient(
            @RequestBody java.util.Map<String, Object> body) {
        Long patientId = null;
        if (body.get("patientId") != null) {
            patientId = Long.valueOf(body.get("patientId").toString());
        } else if (body.get("patientUserId") != null) {
            patientId = Long.valueOf(body.get("patientUserId").toString());
        }
        String notes = body.get("notes") != null ? body.get("notes").toString() : "Assigned via Dietitian portal";
        return ApiResponse.success(assignmentService.assignPatientToDietitian(securityUtils.getCurrentUserId(), patientId, notes));
    }
}
