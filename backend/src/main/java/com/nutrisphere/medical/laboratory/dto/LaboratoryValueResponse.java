package com.nutrisphere.medical.laboratory.dto;

import lombok.Data;

@Data
public class LaboratoryValueResponse {
    private Long id;
    private Long reportId;
    private String parameterName;
    private String value;
    private String unit;
    private String normalRange;
    private String flag;
}
