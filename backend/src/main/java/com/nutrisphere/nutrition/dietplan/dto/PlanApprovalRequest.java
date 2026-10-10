package com.nutrisphere.nutrition.dietplan.dto;
import lombok.Data;
@Data
public class PlanApprovalRequest {
    private boolean approved;
    private String notes;
}
