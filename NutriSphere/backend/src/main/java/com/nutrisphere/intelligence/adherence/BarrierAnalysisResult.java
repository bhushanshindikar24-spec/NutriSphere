package com.nutrisphere.intelligence.adherence;
import lombok.Data;
import java.util.List;
import java.util.Map;
@Data
public class BarrierAnalysisResult {
    private Long patientUserId;
    private int totalBarriers;
    private Map<String, Long> countByType;
    private Map<String, Double> percentByType;
    private String dominantBarrier;
    private List<String> recurringBarriers;
    private List<BarrierTrend> trends;

    @Data
    public static class BarrierTrend {
        private String barrierType;
        private String period;
        private long count;
    }
}
