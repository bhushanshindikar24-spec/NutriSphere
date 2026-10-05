package com.nutrisphere.integrations.ai;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "nutrisphere.ai")
@Data
public class AIProviderConfig {
    private String provider = "mock";
    private String apiKey = "";
    private String model = "gpt-4o-mini";
    private String baseUrl = "https://api.openai.com/v1";
    private double temperature = 0.3;
    private int maxTokens = 1000;
}
