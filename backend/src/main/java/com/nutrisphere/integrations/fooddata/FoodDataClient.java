package com.nutrisphere.integrations.fooddata;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class FoodDataClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${nutrisphere.integrations.fooddata.api-key:DEMO_KEY}")
    private String apiKey;

    @Value("${nutrisphere.integrations.fooddata.base-url:https://api.nal.usda.gov/fdc/v1}")
    private String baseUrl;

    public Map<String, Object> searchFoods(String query, int pageSize) {
        if (apiKey == null || apiKey.isBlank() || "DEMO_KEY".equalsIgnoreCase(apiKey)) {
            log.info("USDA FoodData Central API key is DEMO_KEY/unconfigured. Returning rich local database records.");
            return Collections.emptyMap();
        }

        try {
            WebClient client = webClientBuilder.baseUrl(baseUrl).build();
            return client.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/foods/search")
                            .queryParam("api_key", apiKey)
                            .queryParam("query", query)
                            .queryParam("pageSize", pageSize)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (Exception e) {
            log.warn("FoodData API request failed: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }

    public Map<String, Object> getFoodDetails(String fdcId) {
        if (apiKey == null || apiKey.isBlank() || "DEMO_KEY".equalsIgnoreCase(apiKey)) {
            return Collections.emptyMap();
        }

        try {
            WebClient client = webClientBuilder.baseUrl(baseUrl).build();
            return client.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/food/" + fdcId)
                            .queryParam("api_key", apiKey)
                            .build())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (Exception e) {
            log.warn("FoodData details request failed: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }
}
