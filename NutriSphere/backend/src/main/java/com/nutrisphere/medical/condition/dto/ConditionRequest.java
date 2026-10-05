package com.nutrisphere.medical.condition.dto;

import lombok.Data;

@Data
public class ConditionRequest {
    private String name;
    private String description;
    private String category;
    private String icdCode;
}
