package com.nutrisphere.hotel.order;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "hotel_order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelOrderItem extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private HotelOrder order;
    @Column(name = "meal_id") private Long mealId;
    @Column(name = "meal_name", nullable = false) private String mealName;
    @Column(name = "quantity", nullable = false) private Integer quantity;
    @Column(name = "unit_price", nullable = false) private Double unitPrice;
    @Column(name = "total_price") private Double totalPrice;
}
