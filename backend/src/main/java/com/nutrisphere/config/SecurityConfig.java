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
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/files/upload-license", "/api/files/download/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/doctors/directory", "/api/doctors/*").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/dietitians/directory", "/api/dietitians/*").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/hotel/menu/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/hotel/meals/public", "/api/hotel/meals/available", "/api/hotel/meals/*").authenticated()
                .requestMatchers("/api/hotel/categories/**").hasAnyRole("HOTEL", "PATIENT", "ADMIN")
                .requestMatchers("/api/hotel/meals/**").hasRole("HOTEL")
                .requestMatchers("/api/hotel/availability/**").hasRole("HOTEL")
                .requestMatchers("/api/hotel/profile/**").hasRole("HOTEL")
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/assignments/**").authenticated()
                .requestMatchers("/api/doctors/**").hasAnyRole("DOCTOR", "ADMIN")
                .requestMatchers("/api/dietitians/**").hasAnyRole("DIETITIAN", "ADMIN")
                .requestMatchers("/api/patients/**").authenticated()
                .requestMatchers("/api/medical/**").hasAnyRole("DOCTOR", "DIETITIAN", "PATIENT", "ADMIN")
                .requestMatchers("/api/nutrition/**").hasAnyRole("DIETITIAN", "PATIENT", "ADMIN")
                .requestMatchers("/api/food-logs/**").hasAnyRole("PATIENT", "DIETITIAN", "ADMIN")
                .requestMatchers("/api/water-logs/**").hasAnyRole("PATIENT", "DIETITIAN", "ADMIN")
                .requestMatchers("/api/adherence/**").hasAnyRole("DIETITIAN", "PATIENT", "ADMIN")
                .requestMatchers("/api/barriers/**").hasAnyRole("DIETITIAN", "PATIENT", "ADMIN")
                .requestMatchers("/api/reality-score/**").hasAnyRole("DIETITIAN", "PATIENT", "ADMIN")
                .requestMatchers("/api/adaptive/**").hasAnyRole("DIETITIAN", "PATIENT", "ADMIN")
                .requestMatchers("/api/home-food/**").hasAnyRole("PATIENT", "DIETITIAN", "ADMIN")
                .requestMatchers("/api/digital-twin/**").hasAnyRole("DIETITIAN", "PATIENT", "DOCTOR", "ADMIN")
                .requestMatchers("/api/ai/**").hasAnyRole("DIETITIAN", "DOCTOR", "ADMIN")
                .requestMatchers("/api/notifications/**").authenticated()
                .requestMatchers("/api/files/**").authenticated()
                .requestMatchers("/api/audit/**").hasAnyRole("DOCTOR", "DIETITIAN", "ADMIN")
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
