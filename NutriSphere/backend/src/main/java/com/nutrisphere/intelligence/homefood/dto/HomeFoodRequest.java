package com.nutrisphere.intelligence.homefood.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeFoodRequest {
    private Long foodItemId;
    private String foodName;
    private Double quantityG;
    private String unit;
    private String category;
}
