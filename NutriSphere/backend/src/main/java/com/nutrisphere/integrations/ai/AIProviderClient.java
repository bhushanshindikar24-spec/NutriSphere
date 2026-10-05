package com.nutrisphere.integrations.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AIProviderClient {

    private final AIProviderConfig config;
    private final WebClient.Builder webClientBuilder;

    public String generateCompletion(String systemPrompt, String userPrompt) {
        if (config.getApiKey() == null || config.getApiKey().isBlank() || "mock".equalsIgnoreCase(config.getProvider())) {
            log.info("AI provider is in mock/fallback mode. Returning rule-based clinical response.");
            return generateLocalFallback(systemPrompt, userPrompt);
        }

        try {
            WebClient webClient = webClientBuilder.baseUrl(config.getBaseUrl()).build();

            Map<String, Object> body = Map.of(
                    "model", config.getModel(),
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt != null ? systemPrompt : ""),
                            Map.of("role", "user", "content", userPrompt != null ? userPrompt : "")
                    ),
                    "temperature", config.getTemperature(),
                    "max_tokens", config.getMaxTokens()
            );

            Map response = webClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + config.getApiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(15))
                    .block();

            if (response != null && response.containsKey("choices")) {
                List choices = (List) response.get("choices");
                if (!choices.isEmpty()) {
                    Map firstChoice = (Map) choices.get(0);
                    Map message = (Map) firstChoice.get("message");
                    if (message != null && message.containsKey("content")) {
                        return (String) message.get("content");
                    }
                }
            }
            return generateLocalFallback(systemPrompt, userPrompt);
        } catch (Exception e) {
            log.warn("AI provider API call failed: {}. Falling back to clinical rule-based generation.", e.getMessage());
            return generateLocalFallback(systemPrompt, userPrompt);
        }
    }

    private String generateLocalFallback(String systemPrompt, String userPrompt) {
        String query = userPrompt != null ? userPrompt.toLowerCase() : "";
        if (query.contains("diabetic") || query.contains("diabetes") || query.contains("glucose")) {
            return "Recommendation: Focus on low glycemic index complex carbohydrates, maintain consistent meal timing, ensure at least 30g dietary fiber daily, and monitor post-prandial response.";
        } else if (query.contains("hypertension") || query.contains("blood pressure") || query.contains("sodium")) {
            return "Recommendation: Adhere to DASH dietary pattern, limit dietary sodium to < 1500mg/day, increase dietary potassium (leafy greens, bananas) and ensure adequate hydration.";
        } else if (query.contains("renal") || query.contains("kidney") || query.contains("creatinine")) {
            return "Recommendation: Moderate protein intake to 0.8g/kg/day, monitor phosphorus and potassium intake based on laboratory stages, and maintain regulated fluid intake.";
        } else if (query.contains("weight loss") || query.contains("obesity")) {
            return "Recommendation: Implement a 500 kcal daily deficit with 1.6-2.0g/kg protein preservation, focus on whole unprocessed foods, and establish sustainable meal preparation routines.";
        } else {
            return "Recommendation: Balanced macronutrient distribution (50% carbohydrates, 25% lean protein, 25% healthy fats), prioritize adequate micronutrient density, and maintain consistent meal pacing.";
        }
    }
}
