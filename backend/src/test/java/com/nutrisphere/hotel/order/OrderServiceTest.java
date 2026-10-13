package com.nutrisphere.hotel.order;

import com.nutrisphere.exception.BadRequestException;
import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.hotel.menu.HotelMeal;
import com.nutrisphere.hotel.menu.HotelMealRepository;
import com.nutrisphere.hotel.order.dto.OrderItemRequest;
import com.nutrisphere.hotel.order.dto.OrderRequest;
import com.nutrisphere.hotel.order.dto.OrderResponse;
import com.nutrisphere.hotel.order.dto.OrderStatusRequest;
import com.nutrisphere.notification.NotificationService;
import com.nutrisphere.patient.PatientProfile;
import com.nutrisphere.patient.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private HotelOrderRepository orderRepo;
    @Mock
    private HotelOrderItemRepository itemRepo;
    @Mock
    private OrderStatusHistoryRepository historyRepo;
    @Mock
    private NotificationService notifService;
    @Mock
    private HotelMealRepository mealRepo;
    @Mock
    private PatientRepository patientRepository;

    private OrderService service;

    @BeforeEach
    void setUp() {
        service = new OrderService(
            orderRepo,
            itemRepo,
            historyRepo,
            notifService,
            mealRepo,
            patientRepository
        );
    }

    @Test
    void placeOrder_EmptyItemsOrAddress_ThrowsBadRequest() {
        OrderRequest req = new OrderRequest();
        req.setItems(List.of());
        req.setDeliveryAddress("123 Street");

        assertThrows(BadRequestException.class, () -> service.placeOrder(10L, req));

        OrderItemRequest itemReq = new OrderItemRequest();
        itemReq.setMealId(1L);
        itemReq.setQuantity(1);
        req.setItems(List.of(itemReq));
        req.setDeliveryAddress(" ");

        assertThrows(BadRequestException.class, () -> service.placeOrder(10L, req));
    }

    @Test
    void placeOrder_UnavailableMeal_ThrowsBadRequest() {
        OrderItemRequest itemReq = new OrderItemRequest();
        itemReq.setMealId(1L);
        itemReq.setQuantity(2);

        OrderRequest req = new OrderRequest();
        req.setItems(List.of(itemReq));
        req.setDeliveryAddress("123 Street");

        HotelMeal meal = HotelMeal.builder()
            .name("Fish Curry")
            .available(false)
            .build();

        when(mealRepo.findById(1L)).thenReturn(Optional.of(meal));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.placeOrder(10L, req));
        assertTrue(ex.getMessage().contains("currently unavailable"));
    }

    @Test
    void placeOrder_VeganRestrictionViolation_ThrowsBadRequest() {
        OrderItemRequest itemReq = new OrderItemRequest();
        itemReq.setMealId(1L);
        itemReq.setQuantity(1);

        OrderRequest req = new OrderRequest();
        req.setItems(List.of(itemReq));
        req.setDeliveryAddress("123 Street");

        HotelMeal meal = HotelMeal.builder()
            .name("Beef Burger")
            .available(true)
            .vegan(false)
            .hotelUserId(20L)
            .build();

        PatientProfile profile = PatientProfile.builder()
            .dietaryRestrictions("strictly vegan")
            .build();

        when(patientRepository.findByUserId(10L)).thenReturn(Optional.of(profile));
        when(mealRepo.findById(1L)).thenReturn(Optional.of(meal));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.placeOrder(10L, req));
        assertTrue(ex.getMessage().contains("vegan dietary restriction"));
    }

    @Test
    void placeOrder_AllergyConflict_ThrowsBadRequest() {
        OrderItemRequest itemReq = new OrderItemRequest();
        itemReq.setMealId(1L);
        itemReq.setQuantity(1);

        OrderRequest req = new OrderRequest();
        req.setItems(List.of(itemReq));
        req.setDeliveryAddress("123 Street");

        HotelMeal meal = HotelMeal.builder()
            .name("Peanut Butter Toast")
            .allergens("peanuts, gluten")
            .available(true)
            .hotelUserId(20L)
            .build();

        PatientProfile profile = PatientProfile.builder()
            .allergies("peanuts")
            .build();

        when(patientRepository.findByUserId(10L)).thenReturn(Optional.of(profile));
        when(mealRepo.findById(1L)).thenReturn(Optional.of(meal));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.placeOrder(10L, req));
        assertTrue(ex.getMessage().contains("patient allergy: peanuts"));
    }

    @Test
    void placeOrder_DifferentHotels_ThrowsBadRequest() {
        OrderItemRequest i1 = new OrderItemRequest();
        i1.setMealId(1L);
        i1.setQuantity(1);

        OrderItemRequest i2 = new OrderItemRequest();
        i2.setMealId(2L);
        i2.setQuantity(1);

        OrderRequest req = new OrderRequest();
        req.setItems(List.of(i1, i2));
        req.setDeliveryAddress("123 Street");

        HotelMeal m1 = HotelMeal.builder().name("Salad").available(true).hotelUserId(20L).price(10.0).build();
        HotelMeal m2 = HotelMeal.builder().name("Soup").available(true).hotelUserId(30L).price(8.0).build();

        when(mealRepo.findById(1L)).thenReturn(Optional.of(m1));
        when(mealRepo.findById(2L)).thenReturn(Optional.of(m2));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> service.placeOrder(10L, req));
        assertTrue(ex.getMessage().contains("same hotel"));
    }

    @Test
    void placeOrder_Success() {
        OrderItemRequest i1 = new OrderItemRequest();
        i1.setMealId(1L);
        i1.setQuantity(2);

        OrderRequest req = new OrderRequest();
        req.setItems(List.of(i1));
        req.setDeliveryAddress("123 Hospital Ave");

        HotelMeal meal = HotelMeal.builder()
            .name("Grilled Chicken")
            .available(true)
            .hotelUserId(20L)
            .price(12.5)
            .build();

        when(patientRepository.findByUserId(10L)).thenReturn(Optional.empty());
        when(mealRepo.findById(1L)).thenReturn(Optional.of(meal));

        HotelOrder savedOrder = HotelOrder.builder()
            .patientUserId(10L)
            .hotelUserId(20L)
            .totalAmount(25.0)
            .deliveryAddress("123 Hospital Ave")
            .status(OrderStatus.PENDING)
            .build();
        savedOrder.setId(100L);

        when(orderRepo.save(any(HotelOrder.class))).thenReturn(savedOrder);

        OrderResponse res = service.placeOrder(10L, req);

        assertNotNull(res);
        assertEquals(100L, res.getId());
        assertEquals(25.0, res.getTotalAmount());
        verify(itemRepo).save(any(HotelOrderItem.class));
        verify(historyRepo).save(any(OrderStatusHistory.class));
        verify(notifService).send(eq(20L), any(), anyString(), anyString(), eq("ORDER"), eq(100L));
    }

    @Test
    void updateStatus_ForbiddenForWrongHotel() {
        HotelOrder order = HotelOrder.builder().hotelUserId(20L).build();
        order.setId(100L);
        when(orderRepo.findById(100L)).thenReturn(Optional.of(order));

        OrderStatusRequest statusReq = new OrderStatusRequest();
        statusReq.setStatus(OrderStatus.CONFIRMED);

        assertThrows(ForbiddenException.class, () -> service.updateStatus(100L, 999L, statusReq));
    }

    @Test
    void updateStatus_Success() {
        HotelOrder order = HotelOrder.builder().patientUserId(10L).hotelUserId(20L).status(OrderStatus.PENDING).build();
        order.setId(100L);
        when(orderRepo.findById(100L)).thenReturn(Optional.of(order));

        OrderStatusRequest statusReq = new OrderStatusRequest();
        statusReq.setStatus(OrderStatus.PREPARING);
        statusReq.setNotes("Kitchen started cooking");

        OrderResponse res = service.updateStatus(100L, 20L, statusReq);

        assertEquals(OrderStatus.PREPARING, res.getStatus());
        verify(historyRepo).save(any(OrderStatusHistory.class));
        verify(notifService).send(eq(10L), any(), anyString(), anyString(), eq("ORDER"), eq(100L));
    }

    @Test
    void getById_ForbiddenWhenNeitherPatientNorHotel() {
        HotelOrder order = HotelOrder.builder().patientUserId(10L).hotelUserId(20L).build();
        order.setId(100L);
        when(orderRepo.findById(100L)).thenReturn(Optional.of(order));

        assertThrows(ForbiddenException.class, () -> service.getById(100L, 999L));

        assertNotNull(service.getById(100L, 10L));
        assertNotNull(service.getById(100L, 20L));
    }
}
