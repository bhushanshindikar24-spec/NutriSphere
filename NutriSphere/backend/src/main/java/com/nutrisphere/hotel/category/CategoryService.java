package com.nutrisphere.hotel.category;
import com.nutrisphere.hotel.category.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service @RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repo;
    @Transactional
    public CategoryResponse create(Long hotelUserId, CategoryRequest req) {
        HotelCategory c = HotelCategory.builder()
            .hotelUserId(hotelUserId).name(req.getName())
            .description(req.getDescription()).sortOrder(req.getSortOrder()).build();
        return toResponse(repo.save(c));
    }
    public List<CategoryResponse> getAll(Long hotelUserId) {
        return repo.findByHotelUserIdAndActiveTrue(hotelUserId).stream().map(this::toResponse).collect(Collectors.toList());
    }
    private CategoryResponse toResponse(HotelCategory c) {
        CategoryResponse r = new CategoryResponse();
        r.setId(c.getId()); r.setHotelUserId(c.getHotelUserId());
        r.setName(c.getName()); r.setDescription(c.getDescription());
        r.setSortOrder(c.getSortOrder()); r.setActive(c.isActive());
        return r;
    }
}
