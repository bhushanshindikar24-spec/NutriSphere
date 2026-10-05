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
    @GetMapping("/patients")
    public ApiResponse<java.util.List<com.nutrisphere.assignment.dto.AssignmentResponse>> getPatients() {
        return ApiResponse.success(assignmentService.getDietitianPatients(securityUtils.getCurrentUserId()));
    }
}
