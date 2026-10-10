package com.nutrisphere.dietitian;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DietitianRepository extends JpaRepository<DietitianProfile, Long> {
    @EntityGraph(attributePaths = {"user"})
    Optional<DietitianProfile> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user"})
    List<DietitianProfile> findAll();

    boolean existsByUserId(Long userId);
    List<DietitianProfile> findByVerificationStatus(String verificationStatus);
}
