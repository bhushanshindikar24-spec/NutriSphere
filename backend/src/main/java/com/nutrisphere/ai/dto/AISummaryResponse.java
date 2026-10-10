package com.nutrisphere.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AISummaryResponse {
    private String patientSummary;
    private String keyObservations;
    private String suggestedActions;
    private LocalDateTime generatedAt;
}
