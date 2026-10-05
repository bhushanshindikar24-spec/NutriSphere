package com.nutrisphere.config;

import com.nutrisphere.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;
    private final AuthenticationEntryPoint authEntryPoint;
    private final AccessDeniedHandler accessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(e -> e
                .authenticationEntryPoint(authEntryPoint)
                .accessDeniedHandler(accessDeniedHandler))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/hotel/menu/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/hotel/meals/public", "/api/hotel/meals/available", "/api/hotel/meals/*").authenticated()
                .requestMatchers("/api/hotel/categories/**").hasAnyRole("HOTEL", "PATIENT")
                .requestMatchers("/api/hotel/meals/**").hasRole("HOTEL")
                .requestMatchers("/api/hotel/availability/**").hasRole("HOTEL")
                .requestMatchers("/api/hotel/profile/**").hasRole("HOTEL")
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/doctors/**").hasRole("DOCTOR")
                .requestMatchers("/api/dietitians/**").hasRole("DIETITIAN")
                .requestMatchers("/api/patients/**").authenticated()
                .requestMatchers("/api/medical/**").hasAnyRole("DOCTOR", "DIETITIAN")
                .requestMatchers("/api/nutrition/**").hasAnyRole("DIETITIAN", "PATIENT")
                .requestMatchers("/api/food-logs/**").hasAnyRole("PATIENT", "DIETITIAN")
                .requestMatchers("/api/water-logs/**").hasAnyRole("PATIENT", "DIETITIAN")
                .requestMatchers("/api/adherence/**").hasAnyRole("DIETITIAN", "PATIENT")
                .requestMatchers("/api/barriers/**").hasAnyRole("DIETITIAN", "PATIENT")
                .requestMatchers("/api/reality-score/**").hasAnyRole("DIETITIAN", "PATIENT")
                .requestMatchers("/api/adaptive/**").hasAnyRole("DIETITIAN", "PATIENT")
                .requestMatchers("/api/home-food/**").hasRole("PATIENT")
                .requestMatchers("/api/digital-twin/**").hasAnyRole("DIETITIAN", "PATIENT", "DOCTOR")
                .requestMatchers("/api/ai/**").hasAnyRole("DIETITIAN", "DOCTOR")
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/api/files/**").authenticated()
                .requestMatchers("/api/audit/**").hasAnyRole("DOCTOR", "DIETITIAN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authProvider() {
        var provider = new org.springframework.security.authentication.dao.DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(new com.nutrisphere.security.PasswordEncoderConfig().passwordEncoder());
        return provider;
    }
}
