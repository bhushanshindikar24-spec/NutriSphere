package com.nutrisphere.intelligence.adaptive;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "adaptive_recommendations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdaptiveRecommendation extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "diet_plan_id") private Long dietPlanId;
    @Column(name = "recommendation_type", nullable = false) private String recommendationType;
    @Column(name = "title", nullable = false) private String title;
    @Column(name = "description", length = 2000, nullable = false) private String description;
    @Column(name = "detected_issues", length = 1000) private String detectedIssues;
    @Column(name = "suggested_changes", length = 2000) private String suggestedChanges;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false) @Builder.Default
    private AdaptiveRecommendationStatus status = AdaptiveRecommendationStatus.PENDING_REVIEW;
    @Column(name = "reviewed_by_user_id") private Long reviewedByUserId;
    @Column(name = "review_notes", length = 500) private String reviewNotes;
    @Column(name = "reviewed_at") private java.time.LocalDateTime reviewedAt;
    @Column(name = "priority") private String priority;
}
