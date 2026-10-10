package com.nutrisphere.dietitian.dto;
import lombok.Data;
@Data
public class DietitianDashboardResponse {
    private Long dietitianId;
    private String dietitianName;
    private int totalPatients;
    private int activeDietPlans;
    private int pendingReviews;
    private int unreadNotifications;
}
