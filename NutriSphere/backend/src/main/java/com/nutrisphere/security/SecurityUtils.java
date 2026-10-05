package com.nutrisphere.security;

import com.nutrisphere.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails ud) {
            return ud.getUser();
        }
        throw new com.nutrisphere.exception.UnauthorizedException("Not authenticated");
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public boolean isCurrentUser(Long userId) {
        return getCurrentUserId().equals(userId);
    }

    public boolean hasRole(String roleName) {
        return getCurrentUser().getRole().name().equals(roleName);
    }
}
