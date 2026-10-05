package com.nutrisphere.intelligence.adherence;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * AdherenceEngine orchestrates the barrier detection pipeline.
 * Analyzes food logs, water logs, and meal deviations against the approved plan
 * to compute adherence metrics and detect barriers.
 */
@Component
@RequiredArgsConstructor
public class AdherenceEngine {
    private final AdherenceService adherenceService;
    private final BarrierDetectionService barrierDetectionService;

    /**
     * Calculate full adherence summary for a patient.
     */
    public BarrierAnalysisResult analyze(Long patientUserId) {
        return adherenceService.analyzeBarriers(patientUserId);
    }

    /**
     * Detect and categorize barriers for the given patient.
     */
    public BarrierAnalysisResult detectBarriers(Long patientUserId) {
        return barrierDetectionService.detect(patientUserId);
    }
}
