package com.nutrisphere.dietitian;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DietitianRepository extends JpaRepository<DietitianProfile, Long> {
    Optional<DietitianProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    java.util.List<DietitianProfile> findByVerificationStatus(String verificationStatus);
}
