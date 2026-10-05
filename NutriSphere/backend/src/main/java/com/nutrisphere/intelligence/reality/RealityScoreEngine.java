package com.nutrisphere.intelligence.reality;

import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class RealityScoreEngine {

    public double calculateOverallScore(Map<String, Double> dimensions) {
        if (dimensions == null || dimensions.isEmpty()) return 50.0;
        double sum = 0.0;
        for (double v : dimensions.values()) {
            sum += v;
        }
        return Math.round((sum / dimensions.size()) * 10.0) / 10.0;
    }

    public String interpretScore(double score) {
        if (score >= 80) return "High Feasibility - Highly Sustainable";
        if (score >= 60) return "Moderate Feasibility - Minor Adjustments Advised";
        if (score >= 40) return "Challenging - Barrier Mitigation Needed";
        return "Critical Barrier Risk - Revise Recommendations";
    }
}
