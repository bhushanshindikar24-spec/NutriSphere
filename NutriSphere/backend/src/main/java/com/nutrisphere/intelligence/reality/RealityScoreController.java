package com.nutrisphere.intelligence.reality;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/reality-score") @RequiredArgsConstructor
public class RealityScoreController {
    private final RealityScoreService realityScoreService;
    private final SecurityUtils securityUtils;
    @PostMapping("/calculate")
    public ApiResponse<RealityScoreResult> calculate(
            @RequestParam(required = false) Long patientUserId,
            @RequestParam(required = false) Long dietPlanId) {
        Long uid = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        securityUtils.assertPatientAccess(uid);
        realityScoreService.assertDietPlanBelongsToPatient(dietPlanId, uid);
        return ApiResponse.success(realityScoreService.calculateAndSave(uid, dietPlanId));
    }
    @GetMapping("/history")
    public ApiResponse<List<RealityScoreResult>> history(
            @RequestParam(required = false) Long patientUserId) {
        Long uid = patientUserId != null ? patientUserId : securityUtils.getCurrentUserId();
        assertPatientOwnsTarget(uid);
        return ApiResponse.success(realityScoreService.getHistory(uid));
    }
}
