package com.nutrisphere.hotel.menu;

import com.nutrisphere.exception.ForbiddenException;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.hotel.menu.dto.MealRequest;
import com.nutrisphere.hotel.menu.dto.MealResponse;
import com.nutrisphere.hotel.menu.dto.MealUpdateRequest;
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
class MenuServiceTest {

    @Mock
    private HotelMealRepository mealRepo;

    private MenuService service;

    @BeforeEach
    void setUp() {
        service = new MenuService(mealRepo);
    }

    @Test
    void addMeal_Success() {
        MealRequest req = new MealRequest();
        req.setName("Steamed Fish");
        req.setPrice(15.0);
        req.setCalories(350.0);
        req.setAvailable(true);

        HotelMeal saved = HotelMeal.builder()
            .hotelUserId(10L)
            .name("Steamed Fish")
            .price(15.0)
            .calories(350.0)
            .available(true)
            .build();
        saved.setId(1L);

        when(mealRepo.save(any(HotelMeal.class))).thenReturn(saved);

        MealResponse res = service.addMeal(10L, req);
        assertNotNull(res);
        assertEquals(1L, res.getId());
        assertEquals("Steamed Fish", res.getName());
    }

    @Test
    void getById_FoundAndNotFound() {
        HotelMeal meal = HotelMeal.builder().name("Salad").build();
        meal.setId(5L);

        when(mealRepo.findById(5L)).thenReturn(Optional.of(meal));
        when(mealRepo.findById(404L)).thenReturn(Optional.empty());

        MealResponse res = service.getById(5L);
        assertEquals(5L, res.getId());

        assertThrows(ResourceNotFoundException.class, () -> service.getById(404L));
    }

    @Test
    void updateMeal_OwnershipCheck() {
        HotelMeal meal = HotelMeal.builder().hotelUserId(10L).name("Old Name").build();
        meal.setId(5L);

        when(mealRepo.findById(5L)).thenReturn(Optional.of(meal));

        MealUpdateRequest updateReq = new MealUpdateRequest();
        updateReq.setName("New Name");

        // Forbidden when different hotel
        assertThrows(ForbiddenException.class, () -> service.updateMeal(5L, 999L, updateReq));

        when(mealRepo.save(any(HotelMeal.class))).thenReturn(meal);
        MealResponse res = service.updateMeal(5L, 10L, updateReq);
        assertEquals("New Name", res.getName());
    }

    @Test
    void updateAvailability_TogglesAndExplicit() {
        HotelMeal meal = HotelMeal.builder().hotelUserId(10L).available(true).build();
        meal.setId(5L);

        when(mealRepo.findById(5L)).thenReturn(Optional.of(meal));
        when(mealRepo.save(any(HotelMeal.class))).thenAnswer(i -> i.getArgument(0));

        // Explicit set false
        MealResponse res1 = service.updateAvailability(5L, 10L, false);
        assertFalse(res1.isAvailable());

        // Toggle (available null) -> flips false to true
        MealResponse res2 = service.updateAvailability(5L, 10L, null);
        assertTrue(res2.isAvailable());
    }

    @Test
    void deleteMeal_OwnershipCheck() {
        HotelMeal meal = HotelMeal.builder().hotelUserId(10L).build();
        meal.setId(5L);

        when(mealRepo.findById(5L)).thenReturn(Optional.of(meal));

        assertThrows(ForbiddenException.class, () -> service.deleteMeal(5L, 999L));

        service.deleteMeal(5L, 10L);
        verify(mealRepo).delete(meal);
    }
}
