package com.nutrisphere.user;
import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.security.SecurityUtils;
import com.nutrisphere.user.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/users") @RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final SecurityUtils securityUtils;

    @GetMapping("/profile")
    public ApiResponse<UserResponse> getProfile() {
        var user = userRepository.findById(securityUtils.getCurrentUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User", securityUtils.getCurrentUserId()));
        return ApiResponse.success(userMapper.toResponse(user));
    }

    @PutMapping("/profile")
    public ApiResponse<UserResponse> updateProfile(@RequestBody UpdateUserRequest req) {
        var user = userRepository.findById(securityUtils.getCurrentUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User", securityUtils.getCurrentUserId()));
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setPhoneNumber(req.getPhoneNumber());
        return ApiResponse.success(userMapper.toResponse(userRepository.save(user)));
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@RequestBody ChangePasswordRequest req) {
        var user = userRepository.findById(securityUtils.getCurrentUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User", securityUtils.getCurrentUserId()));
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
            throw new com.nutrisphere.exception.BadRequestException("Current password incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        user.setRefreshToken(null); // Force re-authentication on other devices
        userRepository.save(user);
        return ApiResponse.success("Password changed", null);
    }
}
