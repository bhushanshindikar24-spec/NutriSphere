package com.nutrisphere.hotel.menu;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "hotel_meals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelMeal extends BaseEntity {
    @Column(name = "hotel_user_id", nullable = false) private Long hotelUserId;
    @Column(name = "category_id") private Long categoryId;
    @Column(name = "name", nullable = false) private String name;
    @Column(name = "description", length = 500) private String description;
    @Column(name = "price", nullable = false) private Double price;
    @Column(name = "calories") private Double calories;
    @Column(name = "protein_g") private Double proteinG;
    @Column(name = "carbs_g") private Double carbsG;
    @Column(name = "fat_g") private Double fatG;
    @Column(name = "allergens", length = 500) private String allergens;
    @Column(name = "is_vegetarian") private Boolean vegetarian;
    @Column(name = "is_vegan") private Boolean vegan;
    @Column(name = "preparation_time_min") private Integer preparationTimeMin;
    @Column(name = "image_url") private String imageUrl;
    @Column(name = "is_available") @Builder.Default private boolean available = true;
}
