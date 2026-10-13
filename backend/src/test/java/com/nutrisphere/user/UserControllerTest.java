package com.nutrisphere.user;

import com.nutrisphere.common.ApiResponse;
import com.nutrisphere.exception.BadRequestException;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.security.SecurityUtils;
import com.nutrisphere.user.dto.ChangePasswordRequest;
import com.nutrisphere.user.dto.UpdateUserRequest;
import com.nutrisphere.user.dto.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private SecurityUtils securityUtils;

    private UserController controller;

    @BeforeEach
    void setUp() {
        controller = new UserController(userRepository, userMapper, passwordEncoder, securityUtils);
    }

    @Test
    void getProfile_ReturnsResponse() {
        when(securityUtils.getCurrentUserId()).thenReturn(10L);
        User user = User.builder().email("user@example.com").build();
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));

        UserResponse userResponse = new UserResponse();
        userResponse.setEmail("user@example.com");
        when(userMapper.toResponse(user)).thenReturn(userResponse);

        ApiResponse<UserResponse> res = controller.getProfile();
        assertTrue(res.isSuccess());
        assertEquals("user@example.com", res.getData().getEmail());
    }

    @Test
    void updateProfile_UpdatesFieldsAndSaves() {
        when(securityUtils.getCurrentUserId()).thenReturn(10L);
        User user = User.builder().firstName("Old").build();
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        UpdateUserRequest req = new UpdateUserRequest();
        req.setFirstName("New");
        req.setLastName("Name");
        req.setPhoneNumber("1234567890");

        UserResponse mapped = new UserResponse();
        mapped.setFirstName("New");
        when(userMapper.toResponse(any(User.class))).thenReturn(mapped);

        ApiResponse<UserResponse> res = controller.updateProfile(req);
        assertTrue(res.isSuccess());
        assertEquals("New", res.getData().getFirstName());
        assertEquals("New", user.getFirstName());
        assertEquals("Name", user.getLastName());
        assertEquals("1234567890", user.getPhoneNumber());
    }

    @Test
    void changePassword_Success() {
        when(securityUtils.getCurrentUserId()).thenReturn(10L);
        User user = User.builder().passwordHash("oldHashed").refreshToken("active-refresh").build();
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("OldPass@123", "oldHashed")).thenReturn(true);
        when(passwordEncoder.encode("NewPass@123")).thenReturn("newHashed");

        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("OldPass@123");
        req.setNewPassword("NewPass@123");

        ApiResponse<Void> res = controller.changePassword(req);
        assertTrue(res.isSuccess());
        assertEquals("newHashed", user.getPasswordHash());
        assertNull(user.getRefreshToken()); // active sessions revoked
        verify(userRepository).save(user);
    }

    @Test
    void changePassword_IncorrectCurrentPassword_ThrowsBadRequest() {
        when(securityUtils.getCurrentUserId()).thenReturn(10L);
        User user = User.builder().passwordHash("oldHashed").build();
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPass", "oldHashed")).thenReturn(false);

        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("WrongPass");
        req.setNewPassword("NewPass@123");

        assertThrows(BadRequestException.class, () -> controller.changePassword(req));
    }
}
