package com.nutrisphere.config;

import com.nutrisphere.assignment.*;
import com.nutrisphere.common.enums.*;
import com.nutrisphere.doctor.*;
import com.nutrisphere.dietitian.*;
import com.nutrisphere.hotel.category.*;
import com.nutrisphere.hotel.menu.*;
import com.nutrisphere.hotel.profile.*;
import com.nutrisphere.nutrition.dietplan.*;
import com.nutrisphere.nutrition.hydration.*;
import com.nutrisphere.nutrition.logging.*;
import com.nutrisphere.patient.*;
import com.nutrisphere.user.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DemoDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final DoctorRepository doctorRepository;
    private final DietitianRepository dietitianRepository;
    private final PatientRepository patientRepository;
    private final HotelRepository hotelRepository;
    private final DoctorPatientRepository doctorPatientRepository;
    private final DietitianPatientRepository dietitianPatientRepository;
    private final DietPlanRepository dietPlanRepository;
    private final DietPlanMealRepository dietPlanMealRepository;
    private final MealItemRepository mealItemRepository;
    private final FoodLogRepository foodLogRepository;
    private final WaterLogRepository waterLogRepository;
    private final HotelMealRepository hotelMealRepository;
    private final CategoryRepository categoryRepository;

    @Value("${app.demo-data.enabled:true}")
    private boolean demoDataEnabled;

    @Override
    public void run(String... args) {
        if (!demoDataEnabled) {
            log.info("Demo account seeding is disabled.");
            return;
        }

        log.info("Initializing comprehensive HealthyOne clinical demo dataset...");

        // 1. Admin Account
        User admin = ensureUser("admin@nutrisphere.com", "System", "Administrator", Role.ADMIN, Status.ACTIVE);

        // 2. Verified Doctors
        User doc1 = ensureUser("doctor@nutrisphere.com", "Sarah", "Chen", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc1, "MD-CLIN-88912", "MBBS, MD (Endocrinology)", "Cardiometabolic & Clinical Nutrition",
            "American Diabetes Association Fellow • 14+ Years Clinical Practice • 30+ Research Publications",
            "Metropolitan Academic Medical Center", "Cambridge, MA", 14, 150.0);

        User doc2 = ensureUser("doctor2@nutrisphere.com", "Marcus", "Thorne", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc2, "MD-CLIN-67201", "MD, FACP (Internal Medicine)", "Endocrinology & Diabetology",
            "Chief of Metabolic Medicine • Clinical Investigator on Glycemic Protocols",
            "Boston University Medical Campus", "Boston, MA", 18, 175.0);

        User doc3 = ensureUser("doctor3@nutrisphere.com", "Aisha", "Patel", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc3, "MD-CLIN-94115", "MBBS, MS (Gastroenterology)", "Gastroenterology & Clinical Nutrition",
            "Specialist in Gut Microbiome and Functional Gastrointestinal Nutrition",
            "New England Health Institute", "Newton, MA", 11, 140.0);

        // 3. Pending Doctor (for Admin License Verification Testing)
        User pendingDoc = ensureUser("pending.doctor@nutrisphere.com", "Arthur", "Vance", Role.DOCTOR, Status.PENDING);
        ensureDoctorProfile(pendingDoc, "MD-PENDING-4412", "MBBS, MD (Cardiology)", "Preventive Cardiology & Lipidology",
            "Cardiovascular Disease Prevention Specialist • Pending Board Renewal",
            "Saint Jude Heart Center", "Boston, MA", 9, 130.0, "PENDING");

        // 4. Verified Dietitians
        User diet1 = ensureUser("dietitian@nutrisphere.com", "Michael", "Vance", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet1, "RD-88412-CLIN", "M.Sc. Clinical Nutrition, RD, CDE", "Renal Nutrition & Diabetic Care",
            "Certified Diabetes Educator • Lead Clinical Dietitian for Therapeutic Interventions",
            "Metabolic Health & Nutrition Clinic", "Cambridge, MA", 10, 85.0);

        User diet2 = ensureUser("dietitian2@nutrisphere.com", "Elena", "Rostova", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet2, "RD-77319-SPT", "M.S. Dietetics, RD, CSSD", "Sports & Weight Management Specialist",
            "Certified Specialist in Sports Dietetics • Bioenergetic Modeling Researcher",
            "Olympic & Clinical Wellness Center", "Boston, MA", 8, 90.0);

        // 5. Hotel / Culinary Kitchen Partner
        User hotelUser = ensureUser("hotel@nutrisphere.com", "Grand", "Kitchen", Role.HOTEL, Status.ACTIVE);
        ensureHotelProfile(hotelUser, "Grand Culinary Health Kitchen", "FSSAI-CUL-2024-9981",
            "Clinical, Mediterranean & Therapeutic", "100 Innovation Way, Cambridge, MA", "+1 (555) 789-9900");

        // 6. Patient Account
        User patient = ensureUser("patient@nutrisphere.com", "John", "Doe", Role.PATIENT, Status.ACTIVE);
        ensurePatientProfile(patient);

        // 7. Clinical Assignments
        ensureDoctorPatientAssignment(doc1.getId(), patient.getId(), "Primary supervising cardiometabolic physician");
        ensureDietitianPatientAssignment(diet1.getId(), patient.getId(), "Primary assigned clinical dietitian");

        // 8. Active Approved Diet Plan
        DietPlan plan = ensureDietPlan(patient.getId(), diet1.getId());

        // 9. Food & Water Logs for Patient
        seedLogs(patient.getId(), plan);

        // 10. Culinary Kitchen Menu Items
        seedHotelMenu(hotelUser.getId());

        log.info("Comprehensive demo dataset successfully loaded! Admin, Doctors, Dietitians, Patient, and Kitchen are active.");
    }

    private User ensureUser(String email, String firstName, String lastName, Role role, Status status) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = User.builder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .role(role)
                .status(status)
                .passwordHash(passwordEncoder.encode("password"))
                .emailVerified(true)
                .build();
            return userRepository.save(u);
        });
    }

    private void ensureDoctorProfile(User user, String license, String degree, String spec, String ach, String hosp, String addr, int exp, double fee) {
        ensureDoctorProfile(user, license, degree, spec, ach, hosp, addr, exp, fee, "APPROVED");
    }

    private void ensureDoctorProfile(User user, String license, String degree, String spec, String ach, String hosp, String addr, int exp, double fee, String verStatus) {
        if (!doctorRepository.existsByUserId(user.getId())) {
            DoctorProfile p = DoctorProfile.builder()
                .user(user)
                .licenseNumber(license)
                .degree(degree)
                .specialization(spec)
                .achievements(ach)
                .hospitalName(hosp)
                .hospitalAddress(addr)
                .yearsExperience(exp)
                .consultationFee(fee)
                .verificationStatus(verStatus)
                .bio("Board certified specialist dedicated to evidence-based clinical nutrition protocols.")
                .build();
            doctorRepository.save(p);
        }
    }

    private void ensureDietitianProfile(User user, String license, String degree, String spec, String ach, String clinic, String addr, int exp, double fee) {
        if (!dietitianRepository.existsByUserId(user.getId())) {
            DietitianProfile p = DietitianProfile.builder()
                .user(user)
                .licenseNumber(license)
                .degree(degree)
                .specialization(spec)
                .achievements(ach)
                .clinicName(clinic)
                .clinicAddress(addr)
                .yearsExperience(exp)
                .consultationFee(fee)
                .verificationStatus("APPROVED")
                .bio("Registered Dietitian dedicated to personalized nutrition prescription and barrier adaptation.")
                .build();
            dietitianRepository.save(p);
        }
    }

    private void ensureHotelProfile(User user, String name, String license, String cuisine, String addr, String phone) {
        if (hotelRepository.findByUserId(user.getId()).isEmpty()) {
            HotelProfile p = HotelProfile.builder()
                .user(user)
                .hotelName(name)
                .licenseNumber(license)
                .cuisineType(cuisine)
                .hotelAddress(addr)
                .phoneNumber(phone)
                .verificationStatus("APPROVED")
                .active(true)
                .description("Specialized hospital and hotel partner kitchen preparing clinically aligned therapeutic meals.")
                .build();
            hotelRepository.save(p);
        }
    }

    private void ensurePatientProfile(User user) {
        if (!patientRepository.existsByUserId(user.getId())) {
            PatientProfile p = PatientProfile.builder()
                .user(user)
                .gender(Gender.MALE)
                .dateOfBirth(LocalDate.of(1988, 5, 14))
                .heightCm(178.0)
                .weightKg(81.5)
                .bloodType("O+")
                .activityLevel(ActivityLevel.MODERATELY_ACTIVE)
                .allergies("Peanuts")
                .dietaryRestrictions("Low Sodium, High Protein")
                .foodPreferences("Mediterranean, Whole grains, Lean poultry")
                .build();
            patientRepository.save(p);
        }
    }

    private void ensureDoctorPatientAssignment(Long docId, Long patId, String notes) {
        if (!doctorPatientRepository.existsByDoctorUserIdAndPatientUserId(docId, patId)) {
            DoctorPatient dp = DoctorPatient.builder()
                .doctorUserId(docId)
                .patientUserId(patId)
                .assignedDate(LocalDate.now().minusDays(14))
                .notes(notes)
                .active(true)
                .build();
            doctorPatientRepository.save(dp);
        }
    }

    private void ensureDietitianPatientAssignment(Long dietId, Long patId, String notes) {
        if (!dietitianPatientRepository.existsByDietitianUserIdAndPatientUserId(dietId, patId)) {
            DietitianPatient dp = DietitianPatient.builder()
                .dietitianUserId(dietId)
                .patientUserId(patId)
                .assignedDate(LocalDate.now().minusDays(14))
                .notes(notes)
                .active(true)
                .build();
            dietitianPatientRepository.save(dp);
        }
    }

    private DietPlan ensureDietPlan(Long patId, Long dietId) {
        var existing = dietPlanRepository.findByPatientUserIdAndStatus(patId, DietPlanStatus.APPROVED);
        if (existing.isPresent()) return existing.get();

        DietPlan plan = DietPlan.builder()
            .patientUserId(patId)
            .dietitianUserId(dietId)
            .title("Cardiometabolic & Lean Muscle Plan")
            .description("High-protein, low glycemic load nutritional protocol designed for metabolic recovery.")
            .startDate(LocalDate.now().minusDays(7))
            .endDate(LocalDate.now().plusDays(23))
            .targetCalories(2100.0)
            .targetProteinG(135.0)
            .targetCarbsG(210.0)
            .targetFatG(65.0)
            .targetFiberG(30.0)
            .targetWaterMl(2600.0)
            .status(DietPlanStatus.APPROVED)
            .approvedAt(LocalDateTime.now().minusDays(7))
            .notes("Prescribed by Michael Vance, RD with clinical oversight by Dr. Sarah Chen, MD.")
            .build();
        plan = dietPlanRepository.save(plan);

        // Meals
        createMeal(plan, "BREAKFAST", "08:00 AM", 1, "Steel Cut Oats with Berries & Whey Protein", 480.0);
        createMeal(plan, "LUNCH", "01:00 PM", 2, "Grilled Herb Chicken Breast with Quinoa & Steamed Greens", 680.0);
        createMeal(plan, "SNACK", "04:30 PM", 3, "Greek Yogurt Parfait with Walnuts & Chia", 320.0);
        createMeal(plan, "DINNER", "07:30 PM", 4, "Baked Atlantic Salmon with Sweet Potato & Broccoli", 620.0);

        return plan;
    }

    private void createMeal(DietPlan plan, String type, String time, int order, String desc, double cal) {
        DietPlanMeal meal = DietPlanMeal.builder()
            .dietPlan(plan)
            .mealType(type)
            .mealName(type)
            .scheduledTime(time)
            .sortOrder(order)
            .notes(desc)
            .dayOfWeek("DAILY")
            .build();
        meal = dietPlanMealRepository.save(meal);

        MealItem item = MealItem.builder()
            .dietPlanMeal(meal)
            .foodName(desc)
            .calories(cal)
            .quantityG(200.0)
            .servingDescription("1 serving")
            .build();
        mealItemRepository.save(item);
    }

    private void seedLogs(Long patId, DietPlan plan) {
        LocalDate today = LocalDate.now();
        if (foodLogRepository.findByPatientUserIdAndLogDateOrderByLogTime(patId, today).isEmpty()) {
            foodLogRepository.save(FoodLog.builder()
                .patientUserId(patId)
                .foodName("Steel Cut Oats with Whey Protein")
                .mealType("BREAKFAST")
                .logDate(today)
                .logTime(LocalTime.of(8, 15))
                .calories(480.0)
                .proteinG(34.0)
                .carbsG(62.0)
                .fatG(10.0)
                .fiberG(8.0)
                .quantityG(250.0)
                .build());

            foodLogRepository.save(FoodLog.builder()
                .patientUserId(patId)
                .foodName("Grilled Chicken Breast with Quinoa")
                .mealType("LUNCH")
                .logDate(today)
                .logTime(LocalTime.of(13, 0))
                .calories(640.0)
                .proteinG(48.0)
                .carbsG(58.0)
                .fatG(16.0)
                .fiberG(7.0)
                .quantityG(300.0)
                .build());
        }

        if (waterLogRepository.findByPatientUserIdAndLogDateOrderByLogTime(patId, today).isEmpty()) {
            waterLogRepository.save(WaterLog.builder()
                .patientUserId(patId)
                .amountMl(500.0)
                .logDate(today)
                .logTime(LocalTime.of(8, 30))
                .notes("Morning hydration")
                .build());
            waterLogRepository.save(WaterLog.builder()
                .patientUserId(patId)
                .amountMl(750.0)
                .logDate(today)
                .logTime(LocalTime.of(12, 45))
                .notes("Midday water")
                .build());
            waterLogRepository.save(WaterLog.builder()
                .patientUserId(patId)
                .amountMl(500.0)
                .logDate(today)
                .logTime(LocalTime.of(15, 30))
                .notes("Afternoon water")
                .build());
        }
    }

    private void seedHotelMenu(Long hotelUserId) {
        if (hotelMealRepository.findByHotelUserId(hotelUserId).isEmpty()) {
            HotelCategory catBowls = categoryRepository.findByHotelUserIdAndActiveTrue(hotelUserId).stream()
                .findFirst().orElseGet(() -> categoryRepository.save(HotelCategory.builder()
                    .hotelUserId(hotelUserId)
                    .name("Clinical Signature Bowls")
                    .description("Nutritionally balanced high-protein clinical bowls")
                    .build()));

            hotelMealRepository.save(HotelMeal.builder()
                .hotelUserId(hotelUserId)
                .categoryId(catBowls.getId())
                .name("Grilled Herb Chicken Bowl")
                .description("Sous-vide rosemary chicken, organic quinoa, steamed kale, and avocado tahini drizzle.")
                .price(16.50)
                .calories(520.0)
                .proteinG(44.0)
                .carbsG(48.0)
                .fatG(16.0)
                .vegetarian(false)
                .vegan(false)
                .allergens("None")
                .available(true)
                .build());

            hotelMealRepository.save(HotelMeal.builder()
                .hotelUserId(hotelUserId)
                .categoryId(catBowls.getId())
                .name("Pan-Seared Atlantic Salmon")
                .description("Wild-caught salmon fillet with roasted asparagus, sweet potato mash, and lemon zest.")
                .price(19.75)
                .calories(580.0)
                .proteinG(42.0)
                .carbsG(36.0)
                .fatG(24.0)
                .vegetarian(false)
                .vegan(false)
                .allergens("Fish")
                .available(true)
                .build());

            hotelMealRepository.save(HotelMeal.builder()
                .hotelUserId(hotelUserId)
                .categoryId(catBowls.getId())
                .name("High-Protein Quinoa & Edamame Bowl")
                .description("Organic edamame, tri-color quinoa, pickled cabbage, roasted pumpkin seeds, citrus ginger glaze.")
                .price(14.50)
                .calories(440.0)
                .proteinG(26.0)
                .carbsG(52.0)
                .fatG(14.0)
                .vegetarian(true)
                .vegan(true)
                .allergens("Soy")
                .available(true)
                .build());
        }
    }
}
