package com.nutrisphere.auth;

import lombok.Data;

@Data
public class AuthResponse {
    private boolean success;
    private String message;
    private TokenResponse token;
}
