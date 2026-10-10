package com.nutrisphere.user;

import com.nutrisphere.user.dto.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        UserResponse r = new UserResponse();
        r.setId(user.getId());
        r.setEmail(user.getEmail());
        r.setFirstName(user.getFirstName());
        r.setLastName(user.getLastName());
        r.setFullName(user.getFullName());
        r.setPhoneNumber(user.getPhoneNumber());
        r.setRole(user.getRole());
        r.setStatus(user.getStatus().name());
        r.setEmailVerified(user.isEmailVerified());
        r.setProfileImageUrl(user.getProfileImageUrl());
        r.setCreatedAt(user.getCreatedAt());
        r.setLastLoginAt(user.getLastLoginAt());
        return r;
    }
}
