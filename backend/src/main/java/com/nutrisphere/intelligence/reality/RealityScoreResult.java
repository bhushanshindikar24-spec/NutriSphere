package com.nutrisphere.intelligence.reality;
import lombok.Data;
import java.util.List;
import java.util.Map;
@Data
public class RealityScoreResult {
    private Long patientUserId;
    private Long dietPlanId;
    private double overallScore;
    private Map<String, Double> dimensionScores;
    private String explanation;
    private String interpretation;
    private List<String> recommendations;
}
