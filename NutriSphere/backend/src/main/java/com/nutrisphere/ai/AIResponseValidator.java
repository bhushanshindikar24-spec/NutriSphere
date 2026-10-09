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

        String lower = content.toLowerCase();
        if (lower.contains("cure") || lower.contains("stop taking medication") || lower.contains("discontinue insulin")) {
            warnings.add("Potential clinical claim detected; dietary advice is supportive, not medicinal.");
        }
        if (lower.contains("replace prescription") || lower.contains("replace medical advice")) {
            warnings.add("Advisory reminder: Clinical prescription changes must be prescribed directly by attending physician.");
        }

        String disclaimer = "Clinical Safety Disclaimer: AI-generated nutritional suggestions are for clinical decision support and educational reference only. Per HealthyOne Safety Rules (Section 26), adaptive recommendations require human-in-the-loop review by the attending Dietitian or Physician prior to execution.";

        return AIResponse.builder()
                .content(content)
                .disclaimer(disclaimer)
                .validated(true)
                .warnings(warnings)
                .generatedAt(LocalDateTime.now())
                .build();
    }
}
