package com.nutrisphere.intelligence.homefood;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "home_food_inventory")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HomeFoodInventory extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "food_item_id") private Long foodItemId;
    @Column(name = "food_name", nullable = false) private String foodName;
    @Column(name = "quantity_g") private Double quantityG;
    @Column(name = "unit") private String unit;
    @Column(name = "is_available") @Builder.Default private boolean available = true;
    @Column(name = "category") private String category;
    @Column(name = "expiry_date") private java.time.LocalDate expiryDate;
}
