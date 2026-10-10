package com.nutrisphere.intelligence.homefood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeFoodResponse {
    private Long id;
    private Long patientUserId;
    private Long foodItemId;
    private String foodName;
    private Double quantityG;
    private String unit;
    private String category;
    private boolean available;
    private LocalDateTime createdAt;
}
