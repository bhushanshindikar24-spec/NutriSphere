package com.nutrisphere.auth;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final SecurityUtils securityUtils;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RegistrationResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ApiResponse.success(
            "Registration successful. Please verify your email before signing in.",
            authService.register(req)
        );
    }

    @PostMapping("/resend-verification")
    public ApiResponse<Void> resendVerification(@Valid @RequestBody ResendVerificationRequest req) {
        authService.resendVerificationEmail(req.getEmail());
        return ApiResponse.success("If the account exists and is not verified, a verification email has been sent.", null);
    }

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest req) {
        return ApiResponse.success("Login successful", authService.login(req));
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@Valid @RequestBody RefreshTokenRequest req) {
        return ApiResponse.success(authService.refreshToken(req.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        authService.logout(securityUtils.getCurrentUserId());
        return ApiResponse.success("Logged out", null);
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req.getEmail());
        return ApiResponse.success("If account exists, reset email sent", null);
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req.getToken(), req.getNewPassword());
        return ApiResponse.success("Password reset successful", null);
    }

    @PostMapping("/verify-email")
    public ApiResponse<Void> verifyEmail(@Valid @RequestBody VerifyEmailRequest req) {
        authService.verifyEmail(req.getToken());
        return ApiResponse.success("Email verified", null);
    }

    @GetMapping("/me")
    public ApiResponse<?> getMe() {
        return ApiResponse.success(authService.getMe(securityUtils.getCurrentUserId()));
    }
}
