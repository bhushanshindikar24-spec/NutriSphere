package com.nutrisphere.intelligence.reality.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RealityScoreBreakdownResponse {
    private String dimensionName;
    private Double score;
    private String status;
    private String feedback;
}
