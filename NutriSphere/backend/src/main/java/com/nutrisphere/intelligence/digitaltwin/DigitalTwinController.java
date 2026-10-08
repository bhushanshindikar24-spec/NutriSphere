package com.nutrisphere.intelligence.digitaltwin;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.nutrisphere.exception.ForbiddenException;
@RestController @RequestMapping("/api/digital-twin") @RequiredArgsConstructor
public class DigitalTwinController {
    private final DigitalTwinService digitalTwinService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ApiResponse<DigitalTwinData> getMyTwin() {
        return ApiResponse.success(digitalTwinService.buildDigitalTwin(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/patient/{patientUserId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'DIETITIAN', 'ADMIN', 'PATIENT')")
    public ApiResponse<DigitalTwinData> getForPatient(@PathVariable Long patientUserId) {
        if (securityUtils.hasRole("PATIENT") && !patientUserId.equals(securityUtils.getCurrentUserId())) {
            throw new ForbiddenException("Cannot access another patient's Digital Twin");
        }
        return ApiResponse.success(digitalTwinService.buildDigitalTwin(patientUserId));
    }

    @PostMapping("/recalculate")
    public ApiResponse<DigitalTwinData> recalculate() {
        return ApiResponse.success(digitalTwinService.buildDigitalTwin(securityUtils.getCurrentUserId()));
    }
}
