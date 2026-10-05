package com.nutrisphere.ai;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class AIResponseValidator {

    public AIResponse validateAndSanitize(String rawContent) {
        List<String> warnings = new ArrayList<>();
        String content = rawContent != null ? rawContent.trim() : "";

        if (content.toLowerCase().contains("cure") || content.toLowerCase().contains("stop taking medication")) {
            warnings.add("Potential clinical claim detected; dietary advice is supportive, not medicinal.");
        }

        String disclaimer = "Disclaimer: AI-generated nutritional suggestions are for clinical decision support and educational reference only. All diet plans must be reviewed and approved by a qualified dietitian or physician.";

        return AIResponse.builder()
                .content(content)
                .disclaimer(disclaimer)
                .validated(true)
                .warnings(warnings)
                .generatedAt(LocalDateTime.now())
                .build();
    }
}
