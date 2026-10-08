package com.nutrisphere.auth;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class RegistrationResponse {
    String email;
    boolean verificationRequired;
}
