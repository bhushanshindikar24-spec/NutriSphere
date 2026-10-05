package com.nutrisphere.user;

public enum Role {
    DOCTOR, DIETITIAN, PATIENT, HOTEL;

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
