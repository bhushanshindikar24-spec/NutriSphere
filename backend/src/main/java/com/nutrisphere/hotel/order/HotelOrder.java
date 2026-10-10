package com.nutrisphere.hotel.order;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "hotel_orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelOrder extends BaseEntity {
    @Column(name = "patient_user_id", nullable = false) private Long patientUserId;
    @Column(name = "hotel_user_id", nullable = false) private Long hotelUserId;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false) @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;
    @Column(name = "total_amount", nullable = false) private Double totalAmount;
    @Column(name = "delivery_address") private String deliveryAddress;
    @Column(name = "special_instructions", length = 500) private String specialInstructions;
    @Column(name = "notes") private String notes;
}
