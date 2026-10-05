package com.nutrisphere.medical.laboratory.dto;

import lombok.Data;

@Data
public class LaboratoryValueRequest {
    private String parameterName;
    private String value;
    private String unit;
    private String normalRange;
    private String flag;
}
