package com.nutrisphere.integrations.openfoodfacts;

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
public class OpenFoodFactsService {

    private final OpenFoodFactsClient client;
    private final OpenFoodFactsMapper mapper;
    private final FoodRepository foodRepository;

    public FoodItem getByBarcode(String barcode) {
        Map<String, Object> response = client.getProductByBarcode(barcode);
        if (response != null && response.containsKey("product")) {
            Object prodObj = response.get("product");
            if (prodObj instanceof Map<?, ?> prodMap) {
                @SuppressWarnings("unchecked")
                FoodItem item = mapper.mapToFoodItem((Map<String, Object>) prodMap);
                if (item != null) {
                    return item;
                }
            }
        }
        return null;
    }

    public List<FoodItem> searchProducts(String query, int pageSize) {
        Map<String, Object> response = client.searchProducts(query, pageSize);
        List<FoodItem> items = new ArrayList<>();

        if (response != null && response.containsKey("products")) {
            Object prodsObj = response.get("products");
            if (prodsObj instanceof List<?> prodList) {
                for (Object p : prodList) {
                    if (p instanceof Map<?, ?> pMap) {
                        @SuppressWarnings("unchecked")
                        FoodItem item = mapper.mapToFoodItem((Map<String, Object>) pMap);
                        if (item != null) {
                            items.add(item);
                        }
                    }
                }
            }
        }

        if (items.isEmpty()) {
            return foodRepository.searchActive(query, org.springframework.data.domain.PageRequest.of(0, pageSize)).getContent();
        }

        return items;
    }

    @Transactional
    public FoodItem importByBarcode(String barcode) {
        FoodItem item = getByBarcode(barcode);
        if (item != null) {
            return foodRepository.save(item);
        }
        throw new IllegalArgumentException("No product found in OpenFoodFacts for barcode: " + barcode);
    }
}
