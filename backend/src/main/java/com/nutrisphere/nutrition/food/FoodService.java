package com.nutrisphere.nutrition.food;

import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.nutrition.food.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class FoodService {
    private final FoodRepository foodRepository;

    public Page<FoodResponse> search(String query, String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        Page<FoodItem> items;
        if (query != null && !query.isBlank()) {
            items = foodRepository.searchActive(query, pageable);
        } else if (category != null && !category.isBlank()) {
            items = foodRepository.findByActiveTrueAndCategory(category, pageable);
        } else {
            items = foodRepository.findByActiveTrue(pageable);
        }
        return items.map(this::toResponse);
    }

    public FoodResponse getById(Long id) {
        return toResponse(foodRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food item", id)));
    }

    @Transactional
    public FoodResponse create(FoodRequest req) {
        FoodItem item = FoodItem.builder()
            .name(req.getName()).brand(req.getBrand()).category(req.getCategory())
            .servingSizeG(req.getServingSizeG()).servingDescription(req.getServingDescription())
            .caloriesPer100g(req.getCaloriesPer100g()).proteinG(req.getProteinG())
            .carbsG(req.getCarbsG()).fatG(req.getFatG()).fiberG(req.getFiberG())
            .sugarG(req.getSugarG()).sodiumMg(req.getSodiumMg())
            .build();
        return toResponse(foodRepository.save(item));
    }

    public FoodCalculateResponse calculateNutrition(FoodCalculateRequest req) {
        FoodItem item = null;
        if (req.getFoodItemId() != null) {
            item = foodRepository.findById(req.getFoodItemId()).orElse(null);
        }
        if (item == null && req.getFoodName() != null && !req.getFoodName().isBlank()) {
            var found = foodRepository.searchActive(req.getFoodName(), PageRequest.of(0, 1));
            if (!found.isEmpty()) {
                item = found.getContent().get(0);
            }
        }

        double qty = req.getQuantity() != null && req.getQuantity() > 0 ? req.getQuantity() : 1.0;
        String unit = req.getUnit() != null ? req.getUnit().toLowerCase().trim() : "g";
        String foodName = item != null ? item.getName() : (req.getFoodName() != null ? req.getFoodName() : "Food Item");

        // Calculate grams
        double calculatedGrams = qty;
        if (unit.contains("piece") || unit.contains("nut") || unit.contains("slice") || unit.contains("handful") || unit.contains("tbsp") || unit.contains("tsp") || unit.contains("cup")) {
            String lower = foodName.toLowerCase();
            if (lower.contains("almond")) {
                calculatedGrams = qty * 1.25; // 1 almond ~ 1.25g (7-8 almonds ~ 10g)
            } else if (lower.contains("walnut")) {
                calculatedGrams = qty * 3.5; // 1 walnut half ~ 3.5g
            } else if (lower.contains("bread")) {
                calculatedGrams = qty * 35.0; // 1 slice ~ 35g
            } else if (lower.contains("egg")) {
                calculatedGrams = qty * 50.0; // 1 egg ~ 50g
            } else if (lower.contains("apple")) {
                calculatedGrams = qty * 150.0;
            } else if (lower.contains("banana")) {
                calculatedGrams = qty * 120.0;
            } else if (unit.contains("tbsp")) {
                calculatedGrams = qty * 15.0;
            } else if (unit.contains("tsp")) {
                calculatedGrams = qty * 5.0;
            } else if (unit.contains("cup")) {
                calculatedGrams = qty * 240.0;
            } else if (unit.contains("handful")) {
                calculatedGrams = qty * 28.0;
            } else if (item != null && item.getServingSizeG() != null && item.getServingSizeG() > 0) {
                calculatedGrams = qty * item.getServingSizeG();
            } else {
                calculatedGrams = qty * 50.0;
            }
        }

        double factor = calculatedGrams / 100.0;
        double cal100 = item != null && item.getCaloriesPer100g() != null ? item.getCaloriesPer100g() : 250.0;
        double p100 = item != null && item.getProteinG() != null ? item.getProteinG() : 10.0;
        double c100 = item != null && item.getCarbsG() != null ? item.getCarbsG() : 30.0;
        double f100 = item != null && item.getFatG() != null ? item.getFatG() : 8.0;
        double fb100 = item != null && item.getFiberG() != null ? item.getFiberG() : 2.0;
        double s100 = item != null && item.getSugarG() != null ? item.getSugarG() : 2.0;
        double na100 = item != null && item.getSodiumMg() != null ? item.getSodiumMg() : 50.0;

        return FoodCalculateResponse.builder()
            .foodItemId(item != null ? item.getId() : null)
            .foodName(foodName)
            .quantity(qty)
            .unit(req.getUnit() != null ? req.getUnit() : "g")
            .calculatedGrams(Math.round(calculatedGrams * 10.0) / 10.0)
            .calories(Math.round((cal100 * factor) * 10.0) / 10.0)
            .proteinG(Math.round((p100 * factor) * 10.0) / 10.0)
            .carbsG(Math.round((c100 * factor) * 10.0) / 10.0)
            .fatG(Math.round((f100 * factor) * 10.0) / 10.0)
            .fiberG(Math.round((fb100 * factor) * 10.0) / 10.0)
            .sugarG(Math.round((s100 * factor) * 10.0) / 10.0)
            .sodiumMg(Math.round((na100 * factor) * 10.0) / 10.0)
            .servingDescription(item != null ? item.getServingDescription() : "Standard serving")
            .category(item != null ? item.getCategory() : "General Food")
            .build();
    }

    public FoodResponse toResponse(FoodItem f) {
        FoodResponse r = new FoodResponse();
        r.setId(f.getId()); r.setName(f.getName()); r.setBrand(f.getBrand());
        r.setCategory(f.getCategory()); r.setServingSizeG(f.getServingSizeG());
        r.setServingDescription(f.getServingDescription()); r.setCaloriesPer100g(f.getCaloriesPer100g());
        r.setProteinG(f.getProteinG()); r.setCarbsG(f.getCarbsG()); r.setFatG(f.getFatG());
        r.setFiberG(f.getFiberG()); r.setSugarG(f.getSugarG()); r.setSodiumMg(f.getSodiumMg());
        r.setSource(f.getSource()); r.setExternalId(f.getExternalId()); r.setImageUrl(f.getImageUrl());
        return r;
    }
}
