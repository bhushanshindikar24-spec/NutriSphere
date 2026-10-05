package com.nutrisphere.intelligence.digitaltwin;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/digital-twin") @RequiredArgsConstructor
public class DigitalTwinController {
    private final DigitalTwinService digitalTwinService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ApiResponse<DigitalTwinData> getMyTwin() {
        return ApiResponse.success(digitalTwinService.buildDigitalTwin(securityUtils.getCurrentUserId()));
    }

    @GetMapping("/patient/{patientUserId}")
    public ApiResponse<DigitalTwinData> getForPatient(@PathVariable Long patientUserId) {
        return ApiResponse.success(digitalTwinService.buildDigitalTwin(patientUserId));
    }

    @PostMapping("/recalculate")
    public ApiResponse<DigitalTwinData> recalculate() {
        return ApiResponse.success(digitalTwinService.buildDigitalTwin(securityUtils.getCurrentUserId()));
    }
}
