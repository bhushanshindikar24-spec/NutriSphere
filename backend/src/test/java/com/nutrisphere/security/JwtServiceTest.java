package com.nutrisphere.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret", secret);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L); // 1 day
        ReflectionTestUtils.setField(jwtService, "refreshExpiration", 604800000L); // 7 days
    }

    @Test
    void generateToken_ExtractsUsernameAndClaims() {
        String email = "doctor@nutrisphere.com";
        Map<String, Object> claims = Map.of("role", "DOCTOR", "userId", 10L);

        String token = jwtService.generateToken(email, claims);
        assertNotNull(token);

        String extracted = jwtService.extractUsername(token);
        assertEquals(email, extracted);

        assertTrue(jwtService.isTokenValid(token, email));
        assertFalse(jwtService.isTokenValid(token, "other@nutrisphere.com"));
    }

    @Test
    void generateRefreshToken_ValidForEmail() {
        String email = "patient@nutrisphere.com";
        String refreshToken = jwtService.generateRefreshToken(email);

        assertNotNull(refreshToken);
        assertEquals(email, jwtService.extractUsername(refreshToken));
        assertTrue(jwtService.isTokenValid(refreshToken, email));
    }

    @Test
    void isTokenValid_TamperedToken_ReturnsFalse() {
        String email = "dietitian@nutrisphere.com";
        String token = jwtService.generateToken(email, Map.of("role", "DIETITIAN"));

        String tampered = token + "corrupted";
        assertFalse(jwtService.isTokenValid(tampered, email));
    }

    @Test
    void isTokenValid_ExpiredToken_ReturnsFalse() {
        JwtService shortLivedService = new JwtService();
        ReflectionTestUtils.setField(shortLivedService, "jwtSecret", secret);
        ReflectionTestUtils.setField(shortLivedService, "jwtExpiration", -1000L); // Expired 1 sec ago
        ReflectionTestUtils.setField(shortLivedService, "refreshExpiration", -1000L);

        String email = "expired@nutrisphere.com";
        String token = shortLivedService.generateToken(email, Map.of());

        assertFalse(shortLivedService.isTokenValid(token, email));
    }
}
