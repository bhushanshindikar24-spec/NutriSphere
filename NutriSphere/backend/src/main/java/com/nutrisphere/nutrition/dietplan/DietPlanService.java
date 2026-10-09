package com.nutrisphere.nutrition.dietplan;

import com.nutrisphere.exception.*;
import com.nutrisphere.notification.*;
import com.nutrisphere.nutrition.dietplan.dto.*;
import com.nutrisphere.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class DietPlanService {
    private final DietPlanRepository planRepo;
    private final DietPlanMealRepository mealRepo;
    private final MealItemRepository itemRepo;
    private final UserRepository userRepo;
    private final NotificationService notifService;

    @Transactional
    public DietPlanResponse createPlan(Long dietitianUserId, DietPlanRequest req) {
        DietPlanStatus initialStatus = ("APPROVED".equalsIgnoreCase(req.getStatus()) || "ACTIVE".equalsIgnoreCase(req.getStatus()))
            ? DietPlanStatus.APPROVED : DietPlanStatus.SUBMITTED;

        DietPlan plan = DietPlan.builder()
            .patientUserId(req.getPatientUserId())
            .dietitianUserId(dietitianUserId)
            .title(req.getTitle() != null && !req.getTitle().isBlank() ? req.getTitle() : "Personalized Clinical Diet Plan")
            .description(req.getDescription())
            .startDate(req.getStartDate() != null ? req.getStartDate() : java.time.LocalDate.now())
            .endDate(req.getEndDate() != null ? req.getEndDate() : java.time.LocalDate.now().plusDays(30))
            .targetCalories(req.getTargetCalories() != null ? req.getTargetCalories() : 2000.0)
            .targetProteinG(req.getTargetProteinG() != null ? req.getTargetProteinG() : 120.0)
            .targetCarbsG(req.getTargetCarbsG() != null ? req.getTargetCarbsG() : 200.0)
            .targetFatG(req.getTargetFatG() != null ? req.getTargetFatG() : 65.0)
            .targetFiberG(req.getTargetFiberG() != null ? req.getTargetFiberG() : 28.0)
            .targetWaterMl(req.getTargetWaterMl() != null ? req.getTargetWaterMl() : 2500.0)
            .notes(req.getNotes())
            .status(initialStatus)
            .approvedAt(initialStatus == DietPlanStatus.APPROVED ? LocalDateTime.now() : null)
            .build();
        plan = planRepo.save(plan);

        if (req.getMeals() != null && !req.getMeals().isEmpty()) {
            int order = 1;
            for (DietPlanRequest.MealItemDto m : req.getMeals()) {
                DietPlanMeal meal = DietPlanMeal.builder()
                    .dietPlan(plan)
                    .mealType(m.getMealType() != null ? m.getMealType() : "MEAL")
                    .mealName(m.getMealType())
                    .scheduledTime(m.getTime())
                    .sortOrder(order++)
                    .notes(m.getDescription())
                    .dayOfWeek(m.getDayOfWeek() != null ? m.getDayOfWeek() : "DAILY")
                    .build();
                meal = mealRepo.save(meal);

                MealItem item = MealItem.builder()
                    .dietPlanMeal(meal)
                    .foodName(m.getDescription() != null ? m.getDescription() : m.getMealType() + " nutrition portion")
                    .calories(m.getTargetCalories() != null ? m.getTargetCalories() : 400.0)
                    .quantityG(150.0)
                    .servingDescription("1 serving")
                    .build();
                itemRepo.save(item);
            }
        }

        return toResponse(plan);
    }

    @Transactional
    public DietPlanResponse approvePlan(Long planId, Long dietitianUserId, PlanApprovalRequest req) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        if (!plan.getDietitianUserId().equals(dietitianUserId)) {
            throw new ForbiddenException("Not your diet plan");
        }
        if (req == null || req.isApproved()) {
            plan.setStatus(DietPlanStatus.APPROVED);
            plan.setApprovedAt(LocalDateTime.now());
            notifService.send(plan.getPatientUserId(), NotificationType.DIET_PLAN_APPROVED,
                "Diet Plan Approved", "Your diet plan '" + plan.getTitle() + "' has been approved.");
        } else {
            plan.setStatus(DietPlanStatus.REJECTED);
        }
        if (req != null && req.getNotes() != null) plan.setNotes(req.getNotes());
        return toResponse(planRepo.save(plan));
    }

    @Transactional
    public DietPlanResponse rejectPlan(Long planId, Long dietitianUserId, String notes) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        if (!plan.getDietitianUserId().equals(dietitianUserId)) {
            throw new ForbiddenException("Not your diet plan");
        }
        plan.setStatus(DietPlanStatus.REJECTED);
        if (notes != null) plan.setNotes(notes);
        return toResponse(planRepo.save(plan));
    }

    public List<DietPlanResponse> getPendingPlansForDietitian(Long dietitianUserId) {
        return planRepo.findAll().stream()
            .filter(p -> p.getDietitianUserId().equals(dietitianUserId) && p.getStatus() == DietPlanStatus.SUBMITTED)
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public DietPlanResponse getPlanById(Long planId) {
        return toResponse(planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId)));
    }

    public List<DietPlanResponse> getPlansForPatient(Long patientUserId) {
        return planRepo.findByPatientUserIdOrderByCreatedAtDesc(patientUserId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<DietPlanResponse> getApprovedPlanForPatient(Long patientUserId) {
        return planRepo.findByPatientUserIdAndStatusIn(patientUserId,
            List.of(DietPlanStatus.APPROVED)).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<DietPlanResponse> getPlansForDietitian(Long dietitianUserId) {
        return planRepo.findByDietitianUserIdOrderByCreatedAtDesc(dietitianUserId)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public DietPlanMealResponse addMeal(Long planId, Long dietitianUserId, DietPlanMealRequest req) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        if (!plan.getDietitianUserId().equals(dietitianUserId)) {
            throw new ForbiddenException("Not your diet plan");
        }
        DietPlanMeal meal = DietPlanMeal.builder()
            .dietPlan(plan).mealType(req.getMealType()).mealName(req.getMealName())
            .scheduledTime(req.getScheduledTime()).dayOfWeek(req.getDayOfWeek())
            .notes(req.getNotes()).sortOrder(req.getSortOrder())
            .build();
        meal = mealRepo.save(meal);
        if (req.getItems() != null) {
            for (var ir : req.getItems()) {
                MealItem item = MealItem.builder()
                    .dietPlanMeal(meal).foodItemId(ir.getFoodItemId())
                    .foodName(ir.getFoodName()).quantityG(ir.getQuantityG())
                    .servingDescription(ir.getServingDescription())
                    .calories(ir.getCalories()).proteinG(ir.getProteinG())
                    .carbsG(ir.getCarbsG()).fatG(ir.getFatG()).notes(ir.getNotes())
                    .build();
                itemRepo.save(item);
            }
        }
        return toMealResponse(meal);
    }

    @Transactional
    public DietPlanResponse updatePlan(Long planId, Long dietitianUserId, DietPlanRequest req) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        if (!plan.getDietitianUserId().equals(dietitianUserId)) {
            throw new ForbiddenException("Not your diet plan");
        }
        if (plan.getStatus() == DietPlanStatus.APPROVED) {
            throw new BadRequestException("Approved diet plans are immutable. Create a new plan version instead.");
        }
        if (req.getTitle() != null) plan.setTitle(req.getTitle());
        if (req.getDescription() != null) plan.setDescription(req.getDescription());
        if (req.getStartDate() != null) plan.setStartDate(req.getStartDate());
        if (req.getEndDate() != null) plan.setEndDate(req.getEndDate());
        if (req.getTargetCalories() != null) plan.setTargetCalories(req.getTargetCalories());
        if (req.getTargetProteinG() != null) plan.setTargetProteinG(req.getTargetProteinG());
        if (req.getTargetCarbsG() != null) plan.setTargetCarbsG(req.getTargetCarbsG());
        if (req.getTargetFatG() != null) plan.setTargetFatG(req.getTargetFatG());
        if (req.getTargetFiberG() != null) plan.setTargetFiberG(req.getTargetFiberG());
        if (req.getTargetWaterMl() != null) plan.setTargetWaterMl(req.getTargetWaterMl());
        if (req.getNotes() != null) plan.setNotes(req.getNotes());
        return toResponse(planRepo.save(plan));
    }

    @Transactional
    public DietPlanMealResponse updateMeal(Long planId, Long mealId, Long dietitianUserId, DietPlanMealRequest req) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        if (!plan.getDietitianUserId().equals(dietitianUserId)) {
            throw new ForbiddenException("Not your diet plan");
        }
        DietPlanMeal meal = mealRepo.findById(mealId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlanMeal", mealId));
        if (!meal.getDietPlan().getId().equals(planId)) {
            throw new ForbiddenException("Meal does not belong to this plan");
        }
        if (req.getMealType() != null) meal.setMealType(req.getMealType());
        if (req.getMealName() != null) meal.setMealName(req.getMealName());
        if (req.getScheduledTime() != null) meal.setScheduledTime(req.getScheduledTime());
        if (req.getDayOfWeek() != null) meal.setDayOfWeek(req.getDayOfWeek());
        if (req.getNotes() != null) meal.setNotes(req.getNotes());
        if (req.getSortOrder() != null) meal.setSortOrder(req.getSortOrder());
        meal = mealRepo.save(meal);
        // Replace items if provided
        if (req.getItems() != null) {
            itemRepo.deleteByDietPlanMealId(mealId);
            for (var ir : req.getItems()) {
                MealItem item = MealItem.builder()
                    .dietPlanMeal(meal).foodItemId(ir.getFoodItemId())
                    .foodName(ir.getFoodName()).quantityG(ir.getQuantityG())
                    .servingDescription(ir.getServingDescription())
                    .calories(ir.getCalories()).proteinG(ir.getProteinG())
                    .carbsG(ir.getCarbsG()).fatG(ir.getFatG()).notes(ir.getNotes())
                    .build();
                itemRepo.save(item);
            }
        }
        return toMealResponse(meal);
    }

    @Transactional
    public void deleteMeal(Long planId, Long mealId, Long dietitianUserId) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        if (!plan.getDietitianUserId().equals(dietitianUserId)) {
            throw new ForbiddenException("Not your diet plan");
        }
        DietPlanMeal meal = mealRepo.findById(mealId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlanMeal", mealId));
        if (!meal.getDietPlan().getId().equals(planId)) {
            throw new ForbiddenException("Meal does not belong to this plan");
        }
        itemRepo.deleteByDietPlanMealId(mealId);
        mealRepo.delete(meal);
    }

    @Transactional
    public void deleteMealItem(Long planId, Long mealId, Long itemId, Long dietitianUserId) {
        DietPlan plan = planRepo.findById(planId)
            .orElseThrow(() -> new ResourceNotFoundException("DietPlan", planId));
        if (!plan.getDietitianUserId().equals(dietitianUserId)) {
            throw new ForbiddenException("Not your diet plan");
        }
        MealItem item = itemRepo.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("MealItem", itemId));
        if (!item.getDietPlanMeal().getId().equals(mealId)) {
            throw new ForbiddenException("Item does not belong to this meal");
        }
        itemRepo.delete(item);
    }

    private DietPlanResponse toResponse(DietPlan p) {
        DietPlanResponse r = new DietPlanResponse();
        r.setId(p.getId()); r.setPatientUserId(p.getPatientUserId());
        r.setDietitianUserId(p.getDietitianUserId()); r.setTitle(p.getTitle());
        r.setDescription(p.getDescription()); r.setStartDate(p.getStartDate());
        r.setEndDate(p.getEndDate()); r.setStatus(p.getStatus());
        r.setTargetCalories(p.getTargetCalories()); r.setTargetProteinG(p.getTargetProteinG());
        r.setTargetCarbsG(p.getTargetCarbsG()); r.setTargetFatG(p.getTargetFatG());
        r.setTargetFiberG(p.getTargetFiberG()); r.setTargetWaterMl(p.getTargetWaterMl());
        r.setNotes(p.getNotes()); r.setApprovedAt(p.getApprovedAt()); r.setCreatedAt(p.getCreatedAt());
        userRepo.findById(p.getPatientUserId()).ifPresent(u -> r.setPatientName(u.getFullName()));
        userRepo.findById(p.getDietitianUserId()).ifPresent(u -> r.setDietitianName(u.getFullName()));
        r.setMeals(mealRepo.findByDietPlanIdOrderBySortOrder(p.getId())
            .stream().map(this::toMealResponse).collect(Collectors.toList()));
        return r;
    }

    private DietPlanMealResponse toMealResponse(DietPlanMeal m) {
        DietPlanMealResponse r = new DietPlanMealResponse();
        r.setId(m.getId()); r.setMealType(m.getMealType()); r.setMealName(m.getMealName());
        r.setScheduledTime(m.getScheduledTime()); r.setDayOfWeek(m.getDayOfWeek());
        r.setNotes(m.getNotes()); r.setSortOrder(m.getSortOrder());
        var items = itemRepo.findByDietPlanMealId(m.getId()).stream().map(i -> {
            MealItemResponse ir = new MealItemResponse();
            ir.setId(i.getId()); ir.setFoodItemId(i.getFoodItemId());
            ir.setFoodName(i.getFoodName()); ir.setQuantityG(i.getQuantityG());
            ir.setServingDescription(i.getServingDescription()); ir.setCalories(i.getCalories());
            ir.setProteinG(i.getProteinG()); ir.setCarbsG(i.getCarbsG());
            ir.setFatG(i.getFatG()); ir.setNotes(i.getNotes());
            return ir;
        }).collect(Collectors.toList());
        r.setItems(items);
        r.setTotalCalories(items.stream().mapToDouble(i -> i.getCalories() != null ? i.getCalories() : 0).sum());
        r.setTotalProteinG(items.stream().mapToDouble(i -> i.getProteinG() != null ? i.getProteinG() : 0).sum());
        return r;
    }
}
