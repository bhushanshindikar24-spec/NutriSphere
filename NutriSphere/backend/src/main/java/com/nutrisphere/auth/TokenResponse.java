package com.nutrisphere.auth;

import com.nutrisphere.user.Role;
import lombok.*;

@Data @Builder
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}
