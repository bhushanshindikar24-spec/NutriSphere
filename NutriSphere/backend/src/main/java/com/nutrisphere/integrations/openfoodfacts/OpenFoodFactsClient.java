package com.nutrisphere.integrations.openfoodfacts;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Collections;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OpenFoodFactsClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${nutrisphere.integrations.openfoodfacts.base-url:https://world.openfoodfacts.org}")
    private String baseUrl;

    public Map<String, Object> getProductByBarcode(String barcode) {
        try {
            WebClient client = webClientBuilder.baseUrl(baseUrl).build();
            return client.get()
                    .uri("/api/v2/product/{barcode}.json", barcode)
                    .header("User-Agent", "NutriSphere-NutritionApp - Version 1.0")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (Exception e) {
            log.warn("OpenFoodFacts product barcode lookup failed: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }

    public Map<String, Object> searchProducts(String query, int pageSize) {
        try {
            WebClient client = webClientBuilder.baseUrl(baseUrl).build();
            return client.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/cgi/search.pl")
                            .queryParam("search_terms", query)
                            .queryParam("search_simple", "1")
                            .queryParam("action", "process")
                            .queryParam("json", "1")
                            .queryParam("page_size", pageSize)
                            .build())
                    .header("User-Agent", "NutriSphere-NutritionApp - Version 1.0")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();
        } catch (Exception e) {
            log.warn("OpenFoodFacts product search failed: {}", e.getMessage());
            return Collections.emptyMap();
        }
    }
}
