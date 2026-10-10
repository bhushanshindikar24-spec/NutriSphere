package com.nutrisphere.hotel.order;
import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "order_status_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderStatusHistory extends BaseEntity {
    @Column(name = "order_id", nullable = false) private Long orderId;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false) private OrderStatus status;
    @Column(name = "notes") private String notes;
    @Column(name = "changed_by_user_id") private Long changedByUserId;
}
