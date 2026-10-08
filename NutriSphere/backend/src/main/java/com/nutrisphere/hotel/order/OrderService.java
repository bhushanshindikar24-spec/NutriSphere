package com.nutrisphere.hotel.order;

import com.nutrisphere.exception.*;
import com.nutrisphere.hotel.menu.HotelMeal;
import com.nutrisphere.hotel.order.dto.*;
import com.nutrisphere.notification.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final HotelOrderRepository orderRepo;
    private final HotelOrderItemRepository itemRepo;
    private final OrderStatusHistoryRepository historyRepo;
    private final NotificationService notifService;
    private final com.nutrisphere.hotel.menu.HotelMealRepository mealRepo;

    @Transactional
    public OrderResponse placeOrder(Long patientUserId, OrderRequest req) {
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }
        if (req.getDeliveryAddress() == null || req.getDeliveryAddress().isBlank()) {
            throw new BadRequestException("Delivery address is required");
        }

        Long hotelUid = null;
        double total = 0.0;

        for (var ir : req.getItems()) {
            if (ir.getMealId() == null) {
                throw new BadRequestException("Every order item must contain a mealId");
            }
            if (ir.getQuantity() == null || ir.getQuantity() <= 0) {
                throw new BadRequestException("Quantity must be greater than zero");
            }

            HotelMeal meal = mealRepo.findById(ir.getMealId())
                .orElseThrow(() -> new ResourceNotFoundException("Meal", ir.getMealId()));

            if (!meal.isAvailable()) {
                throw new BadRequestException("Meal is currently unavailable: " + meal.getName());
            }

            if (hotelUid == null) {
                hotelUid = meal.getHotelUserId();
            } else if (!hotelUid.equals(meal.getHotelUserId())) {
                throw new BadRequestException("All order items must belong to the same hotel");
            }

            // Never trust client-supplied name or price.
            ir.setMealName(meal.getName());
            ir.setUnitPrice(meal.getPrice() != null ? meal.getPrice() : 0.0);
            total += ir.getQuantity() * ir.getUnitPrice();
        }

        if (hotelUid == null) {
            throw new BadRequestException("Hotel could not be determined from the selected meals");
        }

        HotelOrder order = HotelOrder.builder()
            .patientUserId(patientUserId)
            .hotelUserId(hotelUid)
            .totalAmount(total)
            .deliveryAddress(req.getDeliveryAddress().trim())
            .specialInstructions(req.getSpecialInstructions())
            .build();
        order = orderRepo.save(order);

        for (var ir : req.getItems()) {
            HotelOrderItem item = HotelOrderItem.builder()
                .order(order)
                .mealId(ir.getMealId())
                .mealName(ir.getMealName())
                .quantity(ir.getQuantity())
                .unitPrice(ir.getUnitPrice())
                .totalPrice(ir.getQuantity() * ir.getUnitPrice())
                .build();
            itemRepo.save(item);
        }

        historyRepo.save(OrderStatusHistory.builder()
            .orderId(order.getId())
            .status(OrderStatus.PENDING)
            .notes("Order placed")
            .changedByUserId(patientUserId)
            .build());

        notifService.send(hotelUid, NotificationType.ORDER_UPDATE, "New Order",
            "New order #" + order.getId() + " received", "ORDER", order.getId());

        return toResponse(order);
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, Long hotelUserId, OrderStatusRequest req) {
        if (req.getStatus() == null) {
            throw new BadRequestException("Order status is required");
        }

        HotelOrder order = orderRepo.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        if (!order.getHotelUserId().equals(hotelUserId)) {
            throw new ForbiddenException("Not your order");
        }

        order.setStatus(req.getStatus());
        orderRepo.save(order);

        historyRepo.save(OrderStatusHistory.builder()
            .orderId(orderId)
            .status(req.getStatus())
            .notes(req.getNotes())
            .changedByUserId(hotelUserId)
            .build());

        notifService.send(order.getPatientUserId(), NotificationType.ORDER_UPDATE,
            "Order Update", "Your order #" + orderId + " is now: " + req.getStatus().name(),
            "ORDER", orderId);

        return toResponse(order);
    }

    public List<OrderResponse> getPatientOrders(Long patientUserId) {
        return orderRepo.findByPatientUserIdOrderByCreatedAtDesc(patientUserId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<OrderResponse> getHotelOrders(Long hotelUserId) {
        return orderRepo.findByHotelUserIdOrderByCreatedAtDesc(hotelUserId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public OrderResponse getById(Long id, Long userId) {
        HotelOrder order = orderRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order", id));

        if (!order.getPatientUserId().equals(userId) && !order.getHotelUserId().equals(userId)) {
            throw new ForbiddenException("Not your order");
        }
        return toResponse(order);
    }

    private OrderResponse toResponse(HotelOrder o) {
        OrderResponse r = new OrderResponse();
        r.setId(o.getId());
        r.setPatientUserId(o.getPatientUserId());
        r.setHotelUserId(o.getHotelUserId());
        r.setStatus(o.getStatus());
        r.setTotalAmount(o.getTotalAmount());
        r.setDeliveryAddress(o.getDeliveryAddress());
        r.setSpecialInstructions(o.getSpecialInstructions());
        r.setCreatedAt(o.getCreatedAt());
        r.setItems(itemRepo.findByOrderId(o.getId()).stream().map(i -> {
            OrderResponse.OrderItemResponse ir = new OrderResponse.OrderItemResponse();
            ir.setId(i.getId());
            ir.setMealId(i.getMealId());
            ir.setMealName(i.getMealName());
            ir.setQuantity(i.getQuantity());
            ir.setUnitPrice(i.getUnitPrice());
            ir.setTotalPrice(i.getTotalPrice());
            return ir;
        }).collect(Collectors.toList()));
        return r;
    }
}
