package com.nutrisphere.nutrition.progress;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.nutrition.progress.dto.*;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.nutrisphere.exception.ForbiddenException;
import java.util.List;
@RestController @RequestMapping("/api/nutrition/progress") @RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;
    private final SecurityUtils securityUtils;

    @PostMapping("/measurements")
    @PreAuthorize("hasRole('DIETITIAN')")
    public ApiResponse<MeasurementResponse> recordMeasurement(@RequestBody MeasurementRequest req) {
        securityUtils.assertPatientAccess(req.getPatientUserId());
        return ApiResponse.success(progressService.recordMeasurement(securityUtils.getCurrentUserId(), req));
    }

    @GetMapping("/measurements/{patientUserId}")
    public ApiResponse<List<MeasurementResponse>> getMeasurements(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(progressService.getMeasurements(patientUserId));
    }

    @GetMapping("/{patientUserId}")
    public ApiResponse<List<ProgressResponse>> getProgress(@PathVariable Long patientUserId) {
        securityUtils.assertPatientAccess(patientUserId);
        return ApiResponse.success(progressService.getProgress(patientUserId));
    }
}
