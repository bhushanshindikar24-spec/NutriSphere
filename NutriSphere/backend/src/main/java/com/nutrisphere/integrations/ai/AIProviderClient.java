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
        if (config.getApiKey() == null || config.getApiKey().isBlank()) {
            throw new AIProviderException("AI provider API key is not configured");
        }
        if ("mock".equalsIgnoreCase(config.getProvider())) {
            throw new AIProviderException("Mock AI provider is disabled for clinical decision support");
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

            Map<?, ?> response = webClient.post()
                .uri("/chat/completions")
                .header("Authorization", "Bearer " + config.getApiKey())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(15))
                .block();

            if (response != null && response.containsKey("choices")) {
                List<?> choices = (List<?>) response.get("choices");
                if (!choices.isEmpty() && choices.get(0) instanceof Map<?, ?> firstChoice) {
                    Object messageObject = firstChoice.get("message");
                    if (messageObject instanceof Map<?, ?> message) {
                        Object content = message.get("content");
                        if (content instanceof String text && !text.isBlank()) {
                            return text;
                        }
                    }
                }
            }

            throw new AIProviderException("AI provider returned no usable completion");
        } catch (AIProviderException e) {
            throw e;
        } catch (Exception e) {
            log.warn("AI provider request failed: {}", e.getMessage());
            throw new AIProviderException("AI provider request failed", e);
        }
    }
}
