package com.nutrisphere.doctor.dto;

import lombok.Data;

@Data
public class DoctorDashboardResponse {
    private Long doctorId;
    private String doctorName;
    private int totalPatients;
    private int consultationsToday;
    private int pendingReports;
    private int unreadNotifications;
}
