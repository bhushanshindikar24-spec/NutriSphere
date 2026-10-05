package com.nutrisphere.intelligence.adherence.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AdherenceSummaryResponse {
    private Long patientUserId;
    private int totalBarriers;
    private String dominantBarrier;
    private Map<String, Long> countByType;
    private Map<String, Double> percentByType;
    private List<String> recurringBarriers;
    private Double adherencePercent;
}
