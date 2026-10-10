package com.nutrisphere.medical.condition.dto;

import lombok.Data;

@Data
public class ConditionResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String icdCode;
    private boolean active;
}
