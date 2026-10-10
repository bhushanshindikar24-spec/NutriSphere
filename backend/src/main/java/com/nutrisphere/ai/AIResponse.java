package com.nutrisphere.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIResponse {
    private String content;
    private String disclaimer;
    private boolean validated;
    private List<String> warnings;
    private LocalDateTime generatedAt;
}
