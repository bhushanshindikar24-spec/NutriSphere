package com.nutrisphere.auth;

import com.nutrisphere.audit.AuditService;
import com.nutrisphere.common.enums.Status;
import com.nutrisphere.dietitian.DietitianRepository;
import com.nutrisphere.doctor.DoctorRepository;
import com.nutrisphere.exception.*;
import com.nutrisphere.hotel.profile.HotelRepository;
import com.nutrisphere.patient.PatientRepository;
import com.nutrisphere.security.JwtService;
import com.nutrisphere.user.*;
import com.nutrisphere.user.dto.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authManager;
    @Mock
    private UserMapper userMapper;
    @Mock
    private AuditService auditService;
    @Mock
    private PatientRepository patientRepository;
    @Mock
    private DoctorRepository doctorRepository;
    @Mock
    private DietitianRepository dietitianRepository;
    @Mock
    private HotelRepository hotelRepository;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
            userRepository,
            passwordEncoder,
            jwtService,
            authManager,
            userMapper,
            auditService,
            patientRepository,
            doctorRepository,
            dietitianRepository,
            hotelRepository
        );
    }

    @Test
    void registerPatient_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("patient@example.com");
        req.setPassword("Password@123");
        req.setFirstName("John");
        req.setLastName("Doe");
        req.setRole(Role.PATIENT);

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            if (u.getId() == null) u.setId(1L);
            return u;
        });
        when(userRepository.existsByEmail("patient@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedPassword");
        when(jwtService.generateRefreshToken("patient@example.com")).thenReturn("refresh-token");
        when(jwtService.generateToken(eq("patient@example.com"), anyMap())).thenReturn("access-token");

        TokenResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("access-token", response.getAccessToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals(Role.PATIENT, response.getRole());

        verify(userRepository, times(2)).save(any(User.class));
        verify(patientRepository, times(1)).save(any());
        verify(auditService, times(1)).log(any(), eq("REGISTER"), eq("USER"), any(), anyString());
    }

    @Test
    void registerDoctor_PendingVerification() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("doctor@hospital.com");
        req.setPassword("DocPass@123");
        req.setFirstName("Gregory");
        req.setLastName("House");
        req.setRole(Role.DOCTOR);
        req.setLicenseNumber("DOC-12345");

        when(userRepository.existsByEmail("doctor@hospital.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");

        TokenResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("PENDING", response.getStatus());
        assertNull(response.getAccessToken()); // Pending accounts do not get access tokens immediately
        verify(doctorRepository, times(1)).save(any());
        verify(auditService, times(1)).log(any(), eq("REGISTER_PENDING"), eq("DOCTOR"), any(), anyString());
    }

    @Test
    void registerDietitian_PendingVerification() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("diet@clinic.com");
        req.setPassword("DietPass@123");
        req.setFirstName("Sarah");
        req.setLastName("Connor");
        req.setRole(Role.DIETITIAN);
        req.setLicenseNumber("DIET-999");

        when(userRepository.existsByEmail("diet@clinic.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");

        TokenResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("PENDING", response.getStatus());
        verify(dietitianRepository, times(1)).save(any());
        verify(auditService, times(1)).log(any(), eq("REGISTER_PENDING"), eq("DIETITIAN"), any(), anyString());
    }

    @Test
    void registerHotel_PendingVerification() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("kitchen@hotel.com");
        req.setPassword("KitchenPass@123");
        req.setFirstName("Gordon");
        req.setLastName("Ramsay");
        req.setRole(Role.HOTEL);

        when(userRepository.existsByEmail("kitchen@hotel.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPass");

        TokenResponse response = authService.register(req);

        assertNotNull(response);
        assertEquals("PENDING", response.getStatus());
        verify(hotelRepository, times(1)).save(any());
        verify(auditService, times(1)).log(any(), eq("REGISTER_PENDING"), eq("HOTEL"), any(), anyString());
    }

    @Test
    void registerAdmin_ThrowsBadRequestException() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("admin@platform.com");
        req.setPassword("AdminPass@123");
        req.setRole(Role.ADMIN);

        when(userRepository.existsByEmail("admin@platform.com")).thenReturn(false);

        BadRequestException ex = assertThrows(BadRequestException.class, () -> authService.register(req));
        assertTrue(ex.getMessage().contains("Administrator accounts cannot be self-registered"));
    }

    @Test
    void registerDuplicateEmail_ThrowsDuplicateResourceException() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("existing@example.com");
        req.setPassword("Pass@123");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(req));
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("user@example.com");
        req.setPassword("Pass@123");

        User user = User.builder()
            .email("user@example.com")
            .firstName("Test")
            .lastName("User")
            .role(Role.PATIENT)
            .status(Status.ACTIVE)
            .build();
        user.setId(5L);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateRefreshToken("user@example.com")).thenReturn("refresh-tok");
        when(jwtService.generateToken(eq("user@example.com"), anyMap())).thenReturn("access-tok");

        TokenResponse response = authService.login(req);

        assertNotNull(response);
        assertEquals("access-tok", response.getAccessToken());
        assertEquals("refresh-tok", response.getRefreshToken());
        verify(authManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(auditService).log(eq(5L), eq("LOGIN"), eq("USER"), eq(5L), anyString());
    }

    @Test
    void login_PendingUser_ThrowsUnauthorizedException() {
        LoginRequest req = new LoginRequest();
        req.setEmail("pending@example.com");
        req.setPassword("Pass@123");

        User user = User.builder()
            .email("pending@example.com")
            .status(Status.PENDING)
            .build();

        when(userRepository.findByEmail("pending@example.com")).thenReturn(Optional.of(user));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().contains("PENDING administrator verification"));
    }

    @Test
    void login_SuspendedUser_ThrowsUnauthorizedException() {
        LoginRequest req = new LoginRequest();
        req.setEmail("suspended@example.com");
        req.setPassword("Pass@123");

        User user = User.builder()
            .email("suspended@example.com")
            .status(Status.SUSPENDED)
            .build();

        when(userRepository.findByEmail("suspended@example.com")).thenReturn(Optional.of(user));

        UnauthorizedException ex = assertThrows(UnauthorizedException.class, () -> authService.login(req));
        assertTrue(ex.getMessage().contains("suspended or rejected"));
    }

    @Test
    void login_UserNotFound_ThrowsUnauthorizedException() {
        LoginRequest req = new LoginRequest();
        req.setEmail("missing@example.com");
        req.setPassword("Pass@123");

        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(req));
    }

    @Test
    void refreshToken_Success() {
        User user = User.builder()
            .email("user@example.com")
            .firstName("Test")
            .lastName("User")
            .role(Role.PATIENT)
            .build();
        user.setId(7L);

        when(userRepository.findByRefreshToken("valid-refresh")).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid("valid-refresh", "user@example.com")).thenReturn(true);
        when(jwtService.generateRefreshToken("user@example.com")).thenReturn("new-refresh");
        when(jwtService.generateToken(eq("user@example.com"), anyMap())).thenReturn("new-access");

        TokenResponse response = authService.refreshToken("valid-refresh");

        assertNotNull(response);
        assertEquals("new-access", response.getAccessToken());
        assertEquals("new-refresh", response.getRefreshToken());
    }

    @Test
    void refreshToken_ExpiredOrInvalid_ThrowsUnauthorized() {
        User user = User.builder().email("user@example.com").build();
        when(userRepository.findByRefreshToken("expired-refresh")).thenReturn(Optional.of(user));
        when(jwtService.isTokenValid("expired-refresh", "user@example.com")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.refreshToken("expired-refresh"));

        when(userRepository.findByRefreshToken("unknown-refresh")).thenReturn(Optional.empty());
        assertThrows(UnauthorizedException.class, () -> authService.refreshToken("unknown-refresh"));
    }

    @Test
    void logout_ClearsRefreshToken() {
        User user = User.builder().refreshToken("active-token").build();
        user.setId(10L);
        when(userRepository.findById(10L)).thenReturn(Optional.of(user));

        authService.logout(10L);

        assertNull(user.getRefreshToken());
        verify(userRepository).save(user);
    }

    @Test
    void forgotPassword_SetsResetToken() {
        User user = User.builder().email("forgot@example.com").build();
        when(userRepository.findByEmail("forgot@example.com")).thenReturn(Optional.of(user));

        authService.forgotPassword("forgot@example.com");

        assertNotNull(user.getPasswordResetToken());
        assertNotNull(user.getPasswordResetExpires());
        verify(userRepository).save(user);
    }

    @Test
    void resetPassword_Success() {
        User user = User.builder()
            .email("reset@example.com")
            .passwordResetToken("valid-token")
            .passwordResetExpires(LocalDateTime.now().plusMinutes(30))
            .refreshToken("old-refresh")
            .build();
        user.setId(12L);

        when(userRepository.findByPasswordResetToken("valid-token")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("NewPass@123")).thenReturn("newHash");

        authService.resetPassword("valid-token", "NewPass@123");

        assertEquals("newHash", user.getPasswordHash());
        assertNull(user.getPasswordResetToken());
        assertNull(user.getPasswordResetExpires());
        assertNull(user.getRefreshToken());
        verify(userRepository).save(user);
        verify(auditService).log(eq(12L), eq("PASSWORD_RESET"), eq("USER"), eq(12L), anyString());
    }

    @Test
    void resetPassword_ExpiredOrInvalidToken() {
        User expiredUser = User.builder()
            .passwordResetExpires(LocalDateTime.now().minusMinutes(5))
            .build();
        when(userRepository.findByPasswordResetToken("expired-token")).thenReturn(Optional.of(expiredUser));

        BadRequestException ex = assertThrows(BadRequestException.class,
            () -> authService.resetPassword("expired-token", "newPass"));
        assertTrue(ex.getMessage().contains("Reset token expired"));

        when(userRepository.findByPasswordResetToken("non-existent")).thenReturn(Optional.empty());
        assertThrows(BadRequestException.class,
            () -> authService.resetPassword("non-existent", "newPass"));
    }

    @Test
    void verifyEmail_SuccessAndFailure() {
        User user = User.builder().emailVerifyToken("token-123").emailVerified(false).build();
        when(userRepository.findByEmailVerifyToken("token-123")).thenReturn(Optional.of(user));

        authService.verifyEmail("token-123");

        assertTrue(user.isEmailVerified());
        assertNull(user.getEmailVerifyToken());
        verify(userRepository).save(user);

        when(userRepository.findByEmailVerifyToken("bad-token")).thenReturn(Optional.empty());
        assertThrows(BadRequestException.class, () -> authService.verifyEmail("bad-token"));
    }

    @Test
    void getMe_SuccessAndNotFound() {
        User user = User.builder().email("me@example.com").build();
        user.setId(15L);
        UserResponse responseDto = new UserResponse();
        responseDto.setId(15L);

        when(userRepository.findById(15L)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(responseDto);

        UserResponse result = authService.getMe(15L);
        assertEquals(15L, result.getId());

        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> authService.getMe(99L));
    }
}
