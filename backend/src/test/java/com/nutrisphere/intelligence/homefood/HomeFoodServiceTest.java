package com.nutrisphere.intelligence.homefood;

import com.nutrisphere.nutrition.assessment.AssessmentRepository;
import com.nutrisphere.nutrition.dietplan.DietPlan;
import com.nutrisphere.nutrition.dietplan.DietPlanMealRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanRepository;
import com.nutrisphere.nutrition.dietplan.DietPlanStatus;
import com.nutrisphere.nutrition.dietplan.MealItemRepository;
import com.nutrisphere.nutrition.food.FoodRepository;
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
class HomeFoodServiceTest {

    @Mock
    private HomeFoodInventoryRepository inventoryRepo;
    @Mock
    private FoodRepository foodRepo;
    @Mock
    private DietPlanRepository planRepo;
    @Mock
    private PatientRepository patientRepo;
    @Mock
    private AssessmentRepository assessmentRepo;
    @Mock
    private DietPlanMealRepository dietPlanMealRepo;
    @Mock
    private MealItemRepository mealItemRepo;

    private HomeFoodService service;

    @BeforeEach
    void setUp() {
        service = new HomeFoodService(
            inventoryRepo,
            foodRepo,
            planRepo,
            patientRepo,
            assessmentRepo,
            dietPlanMealRepo,
            mealItemRepo
        );
    }

    @Test
    void addToInventory_SavesItem() {
        HomeFoodInventory item = HomeFoodInventory.builder()
            .patientUserId(10L)
            .foodName("Eggs")
            .quantityG(120.0)
            .build();
        item.setId(1L);

        when(inventoryRepo.save(any(HomeFoodInventory.class))).thenReturn(item);

        HomeFoodInventory saved = service.addToInventory(10L, "Eggs", 120.0, "g", null, "Protein");
        assertNotNull(saved);
        assertEquals(1L, saved.getId());
        assertEquals("Eggs", saved.getFoodName());
    }

    @Test
    void removeFromInventory_SetsAvailableFalse() {
        HomeFoodInventory item = HomeFoodInventory.builder()
            .patientUserId(10L)
            .available(true)
            .build();
        item.setId(5L);

        when(inventoryRepo.findById(5L)).thenReturn(Optional.of(item));

        service.removeFromInventory(5L, 10L);
        assertFalse(item.isAvailable());
        verify(inventoryRepo).save(item);
    }

    @Test
    void generateSuggestions_CombinesIngredientsAndFiltersAllergies() {
        Long patientId = 10L;

        HomeFoodInventory egg = HomeFoodInventory.builder().foodName("Boiled Eggs").available(true).build();
        egg.setId(1L);
        HomeFoodInventory bread = HomeFoodInventory.builder().foodName("Whole Wheat Toast").available(true).build();
        bread.setId(2L);
        when(inventoryRepo.findByPatientUserIdAndAvailableTrue(patientId)).thenReturn(List.of(egg, bread));

        when(planRepo.findByPatientUserIdAndStatus(patientId, DietPlanStatus.APPROVED)).thenReturn(Optional.empty());
        when(assessmentRepo.findByPatientUserIdOrderByAssessmentDateDesc(patientId)).thenReturn(List.of());

        // Case 1: No allergies -> suggestions include "Eggs on Toast"
        when(patientRepo.findByUserId(patientId)).thenReturn(Optional.empty());

        List<HomeFoodSuggestion> suggestions = service.generateSuggestions(patientId);
        assertFalse(suggestions.isEmpty());
        assertTrue(suggestions.stream().anyMatch(s -> s.getMealName().contains("Eggs on Toast")));

        // Case 2: Patient allergic to egg -> filtered out!
        PatientProfile profile = PatientProfile.builder().allergies("egg").build();
        when(patientRepo.findByUserId(patientId)).thenReturn(Optional.of(profile));

        List<HomeFoodSuggestion> allergicSuggestions = service.generateSuggestions(patientId);
        assertTrue(allergicSuggestions.stream().noneMatch(s -> s.getMealName().toLowerCase().contains("egg")));
    }
}
