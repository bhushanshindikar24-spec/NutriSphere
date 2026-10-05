package com.nutrisphere.intelligence.reality;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "reality_scores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RealityScore extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "diet_plan_id") private Long dietPlanId;
    @Column(name = "overall_score") private Double overallScore;
    @Column(name = "food_availability_score") private Double foodAvailabilityScore;
    @Column(name = "affordability_score") private Double affordabilityScore;
    @Column(name = "cooking_complexity_score") private Double cookingComplexityScore;
    @Column(name = "preference_score") private Double preferenceScore;
    @Column(name = "schedule_score") private Double scheduleScore;
    @Column(name = "accessibility_score") private Double accessibilityScore;
    @Column(name = "historical_adherence_score") private Double historicalAdherenceScore;
    @Column(name = "explanation", length = 1000) private String explanation;
}
