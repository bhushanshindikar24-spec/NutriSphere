package com.nutrisphere.hotel.order;
import com.nutrisphere.hotel.order.dto.OrderHistoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class OrderStatusService {
    private final OrderStatusHistoryRepository repo;
    public List<OrderHistoryResponse> getHistory(Long orderId) {
        return repo.findByOrderIdOrderByCreatedAtAsc(orderId).stream().map(h -> {
            OrderHistoryResponse r = new OrderHistoryResponse();
            r.setOrderId(h.getOrderId()); r.setStatus(h.getStatus());
            r.setNotes(h.getNotes()); r.setChangedAt(h.getCreatedAt());
            return r;
        }).collect(Collectors.toList());
    }
}
