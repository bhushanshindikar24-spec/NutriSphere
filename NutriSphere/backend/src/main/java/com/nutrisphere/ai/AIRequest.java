package com.nutrisphere.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIRequest {
    private Long patientUserId;
    private String prompt;
    private String requestType;
    private Map<String, Object> context;
}
