package com.nutrisphere.integrations.fooddata;

import com.nutrisphere.nutrition.food.FoodItem;
import com.nutrisphere.nutrition.food.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FoodDataService {

    private final FoodDataClient client;
    private final FoodDataMapper mapper;
    private final FoodRepository foodRepository;

    public List<FoodItem> searchFoods(String query, int pageSize) {
        Map<String, Object> result = client.searchFoods(query, pageSize);
        List<FoodItem> items = new ArrayList<>();

        if (result != null && result.containsKey("foods")) {
            Object foodsObj = result.get("foods");
            if (foodsObj instanceof List<?> foodList) {
                for (Object item : foodList) {
                    if (item instanceof Map<?, ?> foodMap) {
                        @SuppressWarnings("unchecked")
                        FoodItem mapped = mapper.mapToFoodItem((Map<String, Object>) foodMap);
                        if (mapped != null) {
                            items.add(mapped);
                        }
                    }
                }
            }
        }

        // If external API returned nothing or offline, search local active repository
        if (items.isEmpty()) {
            return foodRepository.searchActive(query, org.springframework.data.domain.PageRequest.of(0, pageSize)).getContent();
        }

        return items;
    }

    public FoodItem getFoodDetails(String fdcId) {
        Map<String, Object> result = client.getFoodDetails(fdcId);
        if (result != null && !result.isEmpty()) {
            return mapper.mapToFoodItem(result);
        }
        return null;
    }

    @Transactional
    public FoodItem importFood(String fdcId) {
        FoodItem item = getFoodDetails(fdcId);
        if (item != null) {
            return foodRepository.save(item);
        }
        throw new IllegalArgumentException("Food item could not be retrieved for FDC ID: " + fdcId);
    }
}
