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

    /**
     * Substitutes from the food database: same category, ranked by how close their
     * per-100g calories are to the original, preferring more protein/fiber.
     */
    public java.util.List<java.util.Map<String, Object>> findAlternatives(Long id, int limit) {
        FoodItem base = foodRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food item", id));
        if (base.getCategory() == null) return java.util.List.of();
        double baseCal = nz(base.getCaloriesPer100g());
        return foodRepository.findByActiveTrueAndCategory(base.getCategory(), PageRequest.of(0, 200)).getContent().stream()
            .filter(f -> !f.getId().equals(base.getId()) && f.getCaloriesPer100g() != null)
            .sorted(java.util.Comparator.comparingDouble((FoodItem f) -> Math.abs(nz(f.getCaloriesPer100g()) - baseCal))
                .thenComparing(f -> -(nz(f.getProteinG()) + nz(f.getFiberG()))))
            .limit(limit)
            .map(f -> {
                java.util.Map<String, Object> m = new java.util.LinkedHashMap<>();
                m.put("id", f.getId());
                m.put("name", f.getName());
                m.put("category", f.getCategory());
                m.put("calories", f.getCaloriesPer100g());
                m.put("proteinG", f.getProteinG());
                m.put("carbsG", f.getCarbsG());
                m.put("fatG", f.getFatG());
                m.put("fiberG", f.getFiberG());
                m.put("reason", describeDifference(base, f));
                return m;
            })
            .collect(java.util.stream.Collectors.toList());
    }

    private static double nz(Double v) { return v != null ? v : 0.0; }

    private static String describeDifference(FoodItem base, FoodItem alt) {
        java.util.List<String> parts = new java.util.ArrayList<>();
        parts.add("Same category (" + base.getCategory() + ")");
        double dCal = nz(alt.getCaloriesPer100g()) - nz(base.getCaloriesPer100g());
        parts.add(Math.abs(dCal) < 1 ? "similar calories" : String.format("%+.0f kcal", dCal));
        double dP = nz(alt.getProteinG()) - nz(base.getProteinG());
        if (Math.abs(dP) >= 0.5) parts.add(String.format("%+.1f g protein", dP));
        double dF = nz(alt.getFiberG()) - nz(base.getFiberG());
        if (Math.abs(dF) >= 0.5) parts.add(String.format("%+.1f g fiber", dF));
        return String.join(", ", parts) + " per 100 g vs " + base.getName() + ".";
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

        if (item == null) {
            throw new com.nutrisphere.exception.ResourceNotFoundException(
                "Food '" + (req.getFoodName() != null ? req.getFoodName() : req.getFoodItemId()) + "' was not found in the food database");
        }

        double qty = req.getQuantity() != null && req.getQuantity() > 0 ? req.getQuantity() : 1.0;
        String unit = req.getUnit() != null ? req.getUnit().toLowerCase().trim() : "g";
        String foodName = item.getName();

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
            } else if (item.getServingSizeG() != null && item.getServingSizeG() > 0) {
                calculatedGrams = qty * item.getServingSizeG();
            } else {
                throw new com.nutrisphere.exception.BadRequestException(
                    "No serving size is recorded for '" + foodName + "'. Please enter the quantity in grams.");
            }
        }

        double factor = calculatedGrams / 100.0;
        double cal100 = item.getCaloriesPer100g() != null ? item.getCaloriesPer100g() : 0.0;
        double p100 = item.getProteinG() != null ? item.getProteinG() : 0.0;
        double c100 = item.getCarbsG() != null ? item.getCarbsG() : 0.0;
        double f100 = item.getFatG() != null ? item.getFatG() : 0.0;
        double fb100 = item.getFiberG() != null ? item.getFiberG() : 0.0;
        double s100 = item.getSugarG() != null ? item.getSugarG() : 0.0;
        double na100 = item.getSodiumMg() != null ? item.getSodiumMg() : 0.0;

        return FoodCalculateResponse.builder()
            .foodItemId(item.getId())
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
            .servingDescription(item.getServingDescription())
            .category(item.getCategory())
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
