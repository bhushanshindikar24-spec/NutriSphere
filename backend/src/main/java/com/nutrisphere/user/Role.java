package com.nutrisphere.user;

public enum Role {
    DOCTOR, DIETITIAN, PATIENT, HOTEL, ADMIN;

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
