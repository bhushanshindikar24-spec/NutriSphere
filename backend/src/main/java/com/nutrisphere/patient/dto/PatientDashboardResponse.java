package com.nutrisphere.patient.dto;

import lombok.Data;

@Data
public class PatientDashboardResponse {
    private Long patientId;
    private String patientName;
    private String doctorName;
    private String dietitianName;
    private boolean hasDietPlan;
    private int adherenceScore;
    private double todayCalories;
    private double targetCalories;
    private double hydrationLiters;
    private double targetHydrationLiters;
    private int unreadNotifications;
}
