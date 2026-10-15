package com.nutrisphere.hotel.menu;
import com.nutrisphere.exception.ResourceNotFoundException;
import com.nutrisphere.hotel.menu.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class MenuService {
    private final HotelMealRepository mealRepo;

    @Transactional
    public MealResponse addMeal(Long hotelUserId, MealRequest req) {
        Long catId = req.getCategoryId();
        if (catId == null && req.getCategory() != null) {
            String cat = req.getCategory().toUpperCase();
            if (cat.contains("BREAKFAST")) catId = 1L;
            else if (cat.contains("LUNCH")) catId = 2L;
            else if (cat.contains("DINNER")) catId = 3L;
            else catId = 4L;
        }

        String img = req.getImageUrl();
        if (img == null || img.isBlank()) {
            if (req.getCategory() != null && req.getCategory().equalsIgnoreCase("BREAKFAST")) {
                img = "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=500";
            } else if (req.getCategory() != null && req.getCategory().equalsIgnoreCase("DINNER")) {
                img = "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500";
            } else {
                img = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
            }
        }

        HotelMeal meal = HotelMeal.builder()
            .hotelUserId(hotelUserId)
            .categoryId(catId)
            .name(req.getName())
            .description(req.getDescription())
            .price(req.getPrice())
            .calories(req.getCalories())
            .proteinG(req.getProteinG())
            .carbsG(req.getCarbsG())
            .fatG(req.getFatG())
            .allergens(req.getAllergens())
            .vegetarian(req.getVegetarian())
            .vegan(req.getVegan())
            .preparationTimeMin(req.getPreparationTimeMin())
            .imageUrl(img)
            .available(req.isAvailable())
            .build();
        return toResponse(mealRepo.save(meal));
    }

    public List<MealResponse> getMenu(Long hotelUserId) {
        List<HotelMeal> meals = mealRepo.findByHotelUserId(hotelUserId);
        if (meals.isEmpty()) {
            meals = mealRepo.findByHotelUserIdAndAvailableTrue(hotelUserId);
        }
        return meals.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<MealResponse> getAllMenus() {
        return mealRepo.findByAvailableTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MealResponse getById(Long id) {
        return toResponse(mealRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal", id)));
    }

    @Transactional
    public MealResponse updateMeal(Long id, Long hotelUserId, MealUpdateRequest req) {
        HotelMeal meal = mealRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal", id));
        if (!meal.getHotelUserId().equals(hotelUserId))
            throw new com.nutrisphere.exception.ForbiddenException("Not your meal");
        meal.setName(req.getName()); meal.setDescription(req.getDescription());
        meal.setPrice(req.getPrice()); meal.setAvailable(req.isAvailable());
        if (req.getCategoryId() != null) meal.setCategoryId(req.getCategoryId());
        return toResponse(mealRepo.save(meal));
    }

    @Transactional
    public MealResponse updateAvailability(Long id, Long hotelUserId, Boolean available) {
        HotelMeal meal = mealRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal", id));
        if (!meal.getHotelUserId().equals(hotelUserId))
            throw new com.nutrisphere.exception.ForbiddenException("Not your meal");
            
        if (available != null) {
            meal.setAvailable(available);
        } else {
            meal.setAvailable(!meal.isAvailable());
        }
        return toResponse(mealRepo.save(meal));
    }

    @Transactional
    public void deleteMeal(Long id, Long hotelUserId) {
        HotelMeal meal = mealRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal", id));
        if (!meal.getHotelUserId().equals(hotelUserId))
            throw new com.nutrisphere.exception.ForbiddenException("Not your meal");
            
        mealRepo.delete(meal);
    }

    private MealResponse toResponse(HotelMeal m) {
        MealResponse r = new MealResponse();
        r.setId(m.getId()); r.setHotelUserId(m.getHotelUserId());
        r.setCategoryId(m.getCategoryId());
        if (m.getCategoryId() != null) {
            if (m.getCategoryId() == 1L) r.setCategory("BREAKFAST");
            else if (m.getCategoryId() == 2L) r.setCategory("LUNCH");
            else if (m.getCategoryId() == 3L) r.setCategory("DINNER");
            else r.setCategory("SNACK");
        } else {
            r.setCategory("LUNCH");
        }
        r.setName(m.getName());
        r.setDescription(m.getDescription()); r.setPrice(m.getPrice());
        r.setCalories(m.getCalories()); r.setProteinG(m.getProteinG());
        r.setCarbsG(m.getCarbsG()); r.setFatG(m.getFatG());
        r.setAllergens(m.getAllergens()); r.setVegetarian(m.getVegetarian());
        r.setVegan(m.getVegan()); r.setPreparationTimeMin(m.getPreparationTimeMin());
        r.setImageUrl(m.getImageUrl() != null && !m.getImageUrl().isBlank()
            ? m.getImageUrl()
            : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500");
        r.setAvailable(m.isAvailable());
        return r;
    }
}
