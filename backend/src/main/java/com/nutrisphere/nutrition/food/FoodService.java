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
