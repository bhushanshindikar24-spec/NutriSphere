package com.nutrisphere.nutrition.hydration;

import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.hydration.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service 
@RequiredArgsConstructor
public class HydrationService {
    private final WaterLogRepository waterLogRepo;
    private final DietPlanRepository planRepo;

    @Transactional
    public WaterLog logWater(Long patientUserId, WaterLogRequest req) {
        LocalDate date = req.getLogDate();
        LocalTime time = req.getLogTime() != null ? req.getLogTime() : LocalTime.now();
        Double amount = req.getAmountMl() != null ? req.getAmountMl() : req.getAmount();
        if (amount == null || amount <= 0) {
            throw new com.nutrisphere.exception.BadRequestException("Water amount must be greater than zero");
        }
        
        WaterLog log = WaterLog.builder()
            .patientUserId(patientUserId)
            .logDate(date)
            .logTime(time)
            .amountMl(amount)
            .notes(req.getNotes())
            .build();
        return waterLogRepo.save(log);
    }

    public List<WaterLog> getTodayLogs(Long patientUserId) {
        return waterLogRepo.findByPatientUserIdAndLogDateOrderByLogTime(patientUserId, LocalDate.now());
    }

    public HydrationSummaryResponse getSummary(Long patientUserId, LocalDate date) {
        HydrationSummaryResponse r = new HydrationSummaryResponse();
        r.setDate(date);
        double total = waterLogRepo.sumAmountForDate(patientUserId, date);
        r.setTotalMl(total);
        double target = planRepo.findByPatientUserIdAndStatus(patientUserId, DietPlanStatus.APPROVED)
            .map(p -> p.getTargetWaterMl() != null ? p.getTargetWaterMl() : 0.0)
            .orElse(0.0);
        r.setTargetMl(target);
        r.setPercentComplete(target > 0 ? Math.min(100, (total / target) * 100) : 0);
        r.setLogCount(waterLogRepo.findByPatientUserIdAndLogDateOrderByLogTime(patientUserId, date).size());
        return r;
    }
}
