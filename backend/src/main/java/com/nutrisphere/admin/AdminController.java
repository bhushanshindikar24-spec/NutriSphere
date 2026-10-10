package com.nutrisphere.admin;

import com.nutrisphere.admin.dto.PendingVerificationDto;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final SecurityUtils securityUtils;

    @GetMapping("/pending-verifications")
    public ApiResponse<List<PendingVerificationDto>> getPendingVerifications() {
        return ApiResponse.success(adminService.getPendingVerifications());
    }

    @PostMapping("/approve/{userId}")
    public ApiResponse<String> approveVerification(@PathVariable Long userId) {
        adminService.approveVerification(userId, securityUtils.getCurrentUserId());
        return ApiResponse.success("Credentials approved successfully. User account is now ACTIVE.", null);
    }

    @PostMapping("/reject/{userId}")
    public ApiResponse<String> rejectVerification(
            @PathVariable Long userId,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null && body.containsKey("reason") ? body.get("reason") : "Credentials could not be verified";
        adminService.rejectVerification(userId, reason, securityUtils.getCurrentUserId());
        return ApiResponse.success("Application rejected and account marked SUSPENDED.", null);
    }

    @GetMapping("/stats")
    public ApiResponse<Map<String, Object>> getSystemStats() {
        return ApiResponse.success(adminService.getSystemStats());
    }

    @GetMapping("/users")
    public ApiResponse<List<Map<String, Object>>> getAllUsers() {
        return ApiResponse.success(adminService.getAllUsers());
    }
}
