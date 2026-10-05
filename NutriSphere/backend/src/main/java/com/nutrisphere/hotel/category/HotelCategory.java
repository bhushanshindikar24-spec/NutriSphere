package com.nutrisphere.hotel.category;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "hotel_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelCategory extends BaseEntity {
    @Column(name = "hotel_user_id", nullable = false) private Long hotelUserId;
    @Column(name = "name", nullable = false) private String name;
    @Column(name = "description") private String description;
    @Column(name = "sort_order") private Integer sortOrder;
    @Column(name = "is_active") @Builder.Default private boolean active = true;
}
