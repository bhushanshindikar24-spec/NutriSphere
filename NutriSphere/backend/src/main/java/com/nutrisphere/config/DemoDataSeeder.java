package com.nutrisphere.config;

import com.nutrisphere.user.*;
import com.nutrisphere.common.enums.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DemoDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.demo-data.enabled:false}")
    private boolean demoDataEnabled;

    @Override
    public void run(String... args) {
        if (!demoDataEnabled) {
            System.out.println("Demo data seeding is disabled. Set DEMO_DATA_ENABLED=true to enable it explicitly.");
            return;
        }

        if (userRepository.count() > 0) {
            System.out.println("Demo data already seeded.");
            return;
        }

        System.out.println("Seeding demo users...");
        
        // 1. Doctor
        User doctor = new User();
        doctor.setFirstName("Dr. Sarah");
        doctor.setLastName("Chen");
        doctor.setEmail("doctor@nutrisphere.com");
        doctor.setPasswordHash(passwordEncoder.encode("password"));
        doctor.setRole(Role.DOCTOR);
        doctor.setEmailVerified(true);
        userRepository.save(doctor);

        // 2. Dietitian
        User dietitian = new User();
        dietitian.setFirstName("Mike");
        dietitian.setLastName("Dietitian");
        dietitian.setEmail("dietitian@nutrisphere.com");
        dietitian.setPasswordHash(passwordEncoder.encode("password"));
        dietitian.setRole(Role.DIETITIAN);
        dietitian.setEmailVerified(true);
        userRepository.save(dietitian);

        // 3. Patient 1
        User patient1 = new User();
        patient1.setFirstName("John");
        patient1.setLastName("Doe");
        patient1.setEmail("patient@nutrisphere.com");
        patient1.setPasswordHash(passwordEncoder.encode("password"));
        patient1.setRole(Role.PATIENT);
        patient1.setEmailVerified(true);
        userRepository.save(patient1);
        
        // 4. Hotel
        User hotel = new User();
        hotel.setFirstName("Grand");
        hotel.setLastName("Kitchen");
        hotel.setEmail("hotel@nutrisphere.com");
        hotel.setPasswordHash(passwordEncoder.encode("password"));
        hotel.setRole(Role.HOTEL);
        hotel.setEmailVerified(true);
        userRepository.save(hotel);

        System.out.println("Demo users seeded successfully.");
    }
}
