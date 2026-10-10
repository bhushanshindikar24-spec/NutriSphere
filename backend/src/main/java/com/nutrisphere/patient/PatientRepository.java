package com.nutrisphere.patient;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<PatientProfile, Long> {
    @EntityGraph(attributePaths = {"user"})
    Optional<PatientProfile> findByUserId(Long userId);

    @EntityGraph(attributePaths = {"user"})
    Optional<PatientProfile> findById(Long id);

    boolean existsByUserId(Long userId);
}
