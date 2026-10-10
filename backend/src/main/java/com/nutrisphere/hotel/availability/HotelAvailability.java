package com.nutrisphere.hotel.availability;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "hotel_availability")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelAvailability extends BaseEntity {
    @Column(name = "meal_id", nullable = false) private Long mealId;
    @Column(name = "hotel_user_id", nullable = false) private Long hotelUserId;
    @Column(name = "day_of_week") private String dayOfWeek;
    @Column(name = "start_time") private String startTime;
    @Column(name = "end_time") private String endTime;
    @Column(name = "is_available") @Builder.Default private boolean available = true;
    @Column(name = "max_orders") private Integer maxOrders;
}
