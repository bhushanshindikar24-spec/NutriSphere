package com.nutrisphere.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.file")
@Data
public class FileStorageConfig {
    private String uploadDir = "./uploads";
    private long maxSize = 10485760;
    private String[] allowedTypes;
}
