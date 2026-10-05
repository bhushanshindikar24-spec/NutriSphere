package com.nutrisphere.auth;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @NotBlank @Email
    private String email;
}
