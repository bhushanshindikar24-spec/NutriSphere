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

        // 2. 10 Board-Certified Clinical Doctors
        User doc1 = ensureUser("doctor@nutrisphere.com", "Marcus", "Sterling", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc1, "MD-MA-481920", "MBBS, MD (Internal Medicine), FACC", "Preventive Cardiology & Cardiometabolic Health",
            "Former Clinical Trials Director at Mass General • Author of 40+ publications on Arterial Health & Dietary Lipids • AHA Fellow",
            "Boston Cardiovascular Center & Brigham Annex", "75 Francis St, Boston, MA", 16, 175.0);

        User doc2 = ensureUser("dr.eleanor.chen@nutrisphere.com", "Eleanor", "Chen", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc2, "MD-MA-512034", "MD (Harvard Medical), PhD in Molecular Metabolism, FACE", "Endocrinology, Diabetes & Glycemic Telemetry",
            "Pioneer in Continuous Glucose Monitoring (CGM) guided glycemic control • ADA Outstanding Clinician Award Recipient",
            "New England Endocrine & Diabetes Institute", "100 Longwood Ave, Boston, MA", 14, 160.0);

        User doc3 = ensureUser("dr.tariq.almansoor@nutrisphere.com", "Tariq", "Al-Mansoor", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc3, "MD-MA-639102", "MBBS, MD (Gastroenterology), FACG", "Gastroenterology & Gut Microbiome Therapeutics",
            "Key investigator in IBD dietary microbiome protocols • Chair of Clinical GI Nutrition at Tufts Medical",
            "Tufts Digestive Disease & Microbiome Center", "800 Washington St, Boston, MA", 15, 165.0);

        User doc4 = ensureUser("dr.sarah.jenkins@nutrisphere.com", "Sarah", "Jenkins", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc4, "MD-MA-720491", "MD (Johns Hopkins), Fellowship in Clinical Nephrology, FASN", "Nephrology & Renal Nutrition Therapy",
            "Lead author of KDOQI Guidelines for Dietary Protein Modulation in CKD Stages 3-5 • National Kidney Foundation Medal",
            "Harvard Beth Israel Kidney Center", "330 Brookline Ave, Boston, MA", 18, 180.0);

        User doc5 = ensureUser("dr.julian.vance@nutrisphere.com", "Julian", "Vance", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc5, "MD-MA-883012", "MD, FACS, Fellowship in Minimally Invasive Bariatric Surgery", "Bariatric & Metabolic Surgery Consultation",
            "Over 1,500 successful metabolic interventions • Pioneer of Multidisciplinary Pre- & Post-op Nutrition Optimization",
            "Massachusetts Center for Bariatric Medicine", "15 Parkman St, Boston, MA", 17, 190.0);

        User doc6 = ensureUser("dr.priya.ramanathan@nutrisphere.com", "Priya", "Ramanathan", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc6, "MD-MA-940128", "MBBS, MD (Preventive Medicine), MPH (Columbia University)", "Functional & Integrative Preventive Medicine",
            "Founder of Cambridge Lifestyle & Longevity Program • Published author on Systemic Inflammation Reversal",
            "Cambridge Integrative Health & Wellness Pavilion", "1493 Cambridge St, Cambridge, MA", 12, 145.0);

        User doc7 = ensureUser("dr.david.miller@nutrisphere.com", "David", "Miller", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc7, "MD-MA-319405", "MD (University of Pennsylvania), Board Certified in Pediatrics, FAAP", "Pediatric Nutrition & Metabolic Genetics",
            "Chief of Pediatric Metabolism at Boston Children's • Developer of therapeutic formulas for inborn errors",
            "Boston Children's Specialized Pediatric Wing", "300 Longwood Ave, Boston, MA", 20, 170.0);

        User doc8 = ensureUser("dr.catherine.dubois@nutrisphere.com", "Catherine", "Dubois", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc8, "MD-MA-451982", "MD (McGill University), Board Certified in Medical Oncology, FASCO", "Medical Oncology & Cancer Nutritional Support",
            "Director of Cachexia & Supportive Oncology Nutrition at Dana-Farber • Recipient of ASCO Clinical Care Innovation Grant",
            "Dana-Farber Oncology Supportive Center", "450 Brookline Ave, Boston, MA", 13, 160.0);

        User doc9 = ensureUser("dr.robert.oconnor@nutrisphere.com", "Robert", "O'Connor", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc9, "MD-MA-672109", "MD (Georgetown), CAQSM Sports Medicine", "Sports Medicine & Orthopedic Bioenergetics",
            "Division 1 Team Physician • Clinical researcher in mitochondrial biogenesis, recovery nutrition, and lean tissue preservation",
            "New England Sports Medicine & Performance Pavilion", "50 Staniford St, Boston, MA", 11, 150.0);

        User doc10 = ensureUser("dr.ananya.sen@nutrisphere.com", "Ananya", "Sen", Role.DOCTOR, Status.ACTIVE);
        ensureDoctorProfile(doc10, "MD-MA-829143", "MBBS, MD (Hepatology), FACP", "Hepatology & Fatty Liver (NAFLD/NASH) Reversal",
            "Lead Investigator on Mediterranean-Ketogenic Dietary Trial for NASH Reversal • AASLD Fellow",
            "Mass General Liver Disease & Metabolic Clinic", "55 Fruit St, Boston, MA", 15, 165.0);

        // 3. 20 Licensed Clinical Dietitians (2 to 3 under each doctor)

        // Under Dr. Marcus Sterling (Cardiometabolic)
        User diet1 = ensureUser("dietitian@nutrisphere.com", "Rachel", "Adams", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet1, "RD-MA-10291", "M.S. Clinical Nutrition, RD, CDN", "Atherosclerosis & Lipid Modification",
            "Supervising Physician: Dr. Marcus Sterling, MD • Supervised 400+ LDL-reduction and coronary calcium stabilization protocols",
            "Boston Cardiovascular Center — Preventive Nutrition Dept", "75 Francis St, Boston, MA", 9, 90.0);

        User diet2 = ensureUser("rd.liam.thorne@nutrisphere.com", "Liam", "Thorne", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet2, "RD-MA-10292", "B.S. Dietetics, RD, LDN, CDE", "Hypertension & DASH Therapeutic Diets",
            "Supervising Physician: Dr. Marcus Sterling, MD • Co-authored clinical salt-sensitivity dietary guidelines",
            "Boston Cardiovascular Center — Cardiometabolic Wing", "75 Francis St, Boston, MA", 7, 85.0);

        // Under Dr. Eleanor Chen (Endocrinology)
        User diet3 = ensureUser("rd.hannah.goldberg@nutrisphere.com", "Hannah", "Goldberg", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet3, "RD-MA-20381", "M.S. Nutritional Biochemistry (Tufts), RD, CDCES", "Type 1 & Type 2 Diabetes Glycemic Stabilization",
            "Supervising Physician: Dr. Eleanor Chen, MD • Insulin-to-carb ratio optimization lead; CGM telemetry specialist",
            "New England Endocrine Institute — Glycemic Clinic", "100 Longwood Ave, Boston, MA", 10, 95.0);

        User diet4 = ensureUser("rd.kavita.nair@nutrisphere.com", "Kavita", "Nair", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet4, "RD-MA-20382", "M.S. Dietetics, RD, LDN, CDE", "PCOS & Insulin Resistance Reversal",
            "Supervising Physician: Dr. Eleanor Chen, MD • Established the 16-week Low-GI ovarian metabolic restoration protocol",
            "New England Endocrine Institute — Reproductive Metabolic Clinic", "100 Longwood Ave, Boston, MA", 8, 90.0);

        User diet5 = ensureUser("rd.benjamin.hayes@nutrisphere.com", "Benjamin", "Hayes", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet5, "RD-MA-20383", "M.S. Clinical Nutrition, RD", "Metabolic Syndrome & Hyperinsulinemia",
            "Supervising Physician: Dr. Eleanor Chen, MD • Published on macronutrient partitioning in prediabetic cohorts",
            "New England Endocrine Institute — Prevention Unit", "100 Longwood Ave, Boston, MA", 6, 80.0);

        // Under Dr. Tariq Al-Mansoor (Gastroenterology)
        User diet6 = ensureUser("rd.camilla.rossi@nutrisphere.com", "Camilla", "Rossi", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet6, "RD-MA-30471", "M.S. Gastroenterology Nutrition, RD, LDN", "Low-FODMAP & Irritable Bowel Syndrome (IBS)",
            "Supervising Physician: Dr. Tariq Al-Mansoor, MD • Monash University Certified Low-FODMAP Specialist",
            "Tufts Digestive Disease Center — Gut Health Clinic", "800 Washington St, Boston, MA", 8, 85.0);

        User diet7 = ensureUser("rd.devin.patel@nutrisphere.com", "Devin", "Patel", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet7, "RD-MA-30472", "B.S. Dietetics, Certified Nutrition Support Clinician (CNSC)", "Crohn's Disease, Ulcerative Colitis & SIBO",
            "Supervising Physician: Dr. Tariq Al-Mansoor, MD • Lead designer of elemental & specific carbohydrate diet transitions",
            "Tufts Digestive Disease Center — IBD Nutrition Service", "800 Washington St, Boston, MA", 11, 100.0);

        // Under Dr. Sarah Jenkins (Nephrology)
        User diet8 = ensureUser("rd.megan.gallagher@nutrisphere.com", "Megan", "Gallagher", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet8, "RD-MA-40561", "M.S. Renal Nutrition, Board Certified in Renal Nutrition (CSR)", "CKD Stages 3-5 & Potassium/Phosphorus Balancing",
            "Supervising Physician: Dr. Sarah Jenkins, MD • Supervised 500+ pre-dialysis delay protocols; NKF Speaker",
            "Harvard Beth Israel Kidney Center — Nephrology Nutrition Unit", "330 Brookline Ave, Boston, MA", 12, 105.0);

        User diet9 = ensureUser("rd.owen.vance@nutrisphere.com", "Owen", "Vance", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet9, "RD-MA-40562", "B.S. Clinical Dietetics, CSR, LDN", "Diabetic Nephropathy & Dialysis Macronutrients",
            "Supervising Physician: Dr. Sarah Jenkins, MD • Formulator of individualized high-biological-value protein plans",
            "Harvard Beth Israel Kidney Center — Renal Replacement Unit", "330 Brookline Ave, Boston, MA", 7, 85.0);

        // Under Dr. Julian Vance (Bariatrics)
        User diet10 = ensureUser("rd.zoe.martinez@nutrisphere.com", "Zoe", "Martinez", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet10, "RD-MA-50651", "M.S. Nutrition, Certified Specialist in Obesity & Weight Management (CSOWM)", "Pre-Bariatric Liver Shrinkage & VLCD Protocols",
            "Supervising Physician: Dr. Julian Vance, MD • 98% compliance rate on 4-week pre-op liver reduction regimens",
            "Mass Center for Bariatric Medicine — Pre-Surgical Unit", "15 Parkman St, Boston, MA", 9, 90.0);

        User diet11 = ensureUser("rd.lucas.wright@nutrisphere.com", "Lucas", "Wright", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet11, "RD-MA-50652", "B.S. Human Nutrition, RD, LDN", "Post-Bariatric Micronutrient Absorption & Lean Mass",
            "Supervising Physician: Dr. Julian Vance, MD • Designed rapid sleeve-gastrectomy post-op hydration & protein pacing",
            "Mass Center for Bariatric Medicine — Long-term Recovery Unit", "15 Parkman St, Boston, MA", 6, 80.0);

        // Under Dr. Priya Ramanathan (Functional Medicine)
        User diet12 = ensureUser("rd.maya.lin@nutrisphere.com", "Maya", "Lin", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet12, "RD-MA-60741", "M.S. Integrative Nutrition, IFNCP", "Anti-Inflammatory Diets & Autoimmune Protocol (AIP)",
            "Supervising Physician: Dr. Priya Ramanathan, MD • Co-director of the Hashimoto's dietary elimination trial",
            "Cambridge Integrative Health — Functional Medicine Clinic", "1493 Cambridge St, Cambridge, MA", 10, 95.0);

        User diet13 = ensureUser("rd.carlos.mendez@nutrisphere.com", "Carlos", "Mendez", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet13, "RD-MA-60742", "B.S. Dietetics, RD, LDN", "Plant-Based Clinical Nutrition & Longevity Fasting",
            "Supervising Physician: Dr. Priya Ramanathan, MD • Certified intermittent fasting and longevity nutrition specialist",
            "Cambridge Integrative Health — Longevity Center", "1493 Cambridge St, Cambridge, MA", 8, 85.0);

        // Under Dr. David K. Miller (Pediatrics)
        User diet14 = ensureUser("rd.chloe.campbell@nutrisphere.com", "Chloe", "Campbell", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet14, "RD-MA-70831", "M.S. Pediatric Nutrition, Certified in Pediatric Nutrition (CSP)", "Pediatric Food Allergies & Elimination Diets",
            "Supervising Physician: Dr. David Miller, MD • Formulator of elemental & amino-acid-based diets for eosinophilic esophagitis",
            "Boston Children's Wing — Pediatric Allergy Clinic", "300 Longwood Ave, Boston, MA", 11, 100.0);

        User diet15 = ensureUser("rd.jordan.bell@nutrisphere.com", "Jordan", "Bell", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet15, "RD-MA-70832", "B.S. Dietetics, CSP, LDN", "Pediatric Type 1 Diabetes & Failure to Thrive",
            "Supervising Physician: Dr. David Miller, MD • Lead clinical dietitian for growth percentile recovery protocols",
            "Boston Children's Wing — Metabolic Growth Center", "300 Longwood Ave, Boston, MA", 7, 85.0);

        // Under Dr. Catherine Dubois (Oncology)
        User diet16 = ensureUser("rd.sophie.laurent@nutrisphere.com", "Sophie", "Laurent", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet16, "RD-MA-80921", "M.S. Clinical Nutrition, Certified Specialist in Oncology Nutrition (CSO)", "Chemo-induced Dysgeusia, Nausea & Cancer Cachexia",
            "Supervising Physician: Dr. Catherine Dubois, MD • Designer of nutrient-dense micro-meals for bone marrow recipients",
            "Dana-Farber Supportive Care — Oncology Nutrition Dept", "450 Brookline Ave, Boston, MA", 13, 110.0);

        User diet17 = ensureUser("rd.ethan.brooks@nutrisphere.com", "Ethan", "Brooks", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet17, "RD-MA-80922", "B.S. Clinical Dietetics, CSO", "Radiation Enteritis & Head/Neck Enteral Feeding",
            "Supervising Physician: Dr. Catherine Dubois, MD • Supervised 300+ home enteral feeding plans",
            "Dana-Farber Supportive Care — Enteral Nutrition Team", "450 Brookline Ave, Boston, MA", 8, 90.0);

        // Under Dr. Robert O'Connor (Sports Medicine)
        User diet18 = ensureUser("rd.morgan.foster@nutrisphere.com", "Morgan", "Foster", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet18, "RD-MA-90011", "M.S. Exercise Physiology, Board Certified in Sports Dietetics (CSSD)", "Muscle Protein Synthesis & Glycogen Supercompensation",
            "Supervising Physician: Dr. Robert O'Connor, MD • Olympic Trials nutritional consultant; VO2 max fuel oxidation lead",
            "New England Sports Medicine — Performance Recovery Unit", "50 Staniford St, Boston, MA", 10, 95.0);

        User diet19 = ensureUser("rd.nathaniel.cole@nutrisphere.com", "Nathaniel", "Cole", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet19, "RD-MA-90012", "B.S. Kinesiology & Dietetics, CSSD, CSCS", "Orthopedic Injury Rehabilitation & Collagen Protocols",
            "Supervising Physician: Dr. Robert O'Connor, MD • Accelerated ACL surgical rehabilitation high-leucine protocol lead",
            "New England Sports Medicine — Orthopedic Recovery Lab", "50 Staniford St, Boston, MA", 6, 80.0);

        // Under Dr. Ananya Sen (Hepatology)
        User diet20 = ensureUser("rd.kimberly.shaw@nutrisphere.com", "Kimberly", "Shaw", Role.DIETITIAN, Status.ACTIVE);
        ensureDietitianProfile(diet20, "RD-MA-99120", "Ph.D. Nutritional Sciences, RD", "Non-Alcoholic Fatty Liver Disease (NAFLD) & Choline Metabolism",
            "Supervising Physician: Dr. Ananya Sen, MD • Published on hepatic steatosis ultrasound score improvements",
            "Mass General Liver Clinic — Hepatobiliary Nutrition Division", "55 Fruit St, Boston, MA", 14, 115.0);

        // 4. Hotel / Culinary Kitchen Partner
        User hotelUser = ensureUser("hotel@nutrisphere.com", "Grand", "Kitchen", Role.HOTEL, Status.ACTIVE);
        ensureHotelProfile(hotelUser, "Grand Culinary Health Kitchen", "FSSAI-CUL-2024-9981",
            "Clinical, Mediterranean & Therapeutic", "100 Innovation Way, Cambridge, MA", "+1 (555) 789-9900");

        // 5. Patient Account
        User patient = ensureUser("patient@nutrisphere.com", "John", "Doe", Role.PATIENT, Status.ACTIVE);
        ensurePatientProfile(patient);

        // 6. Clinical Assignments
        ensureDoctorPatientAssignment(doc1.getId(), patient.getId(), "Primary supervising cardiometabolic physician");
        ensureDietitianPatientAssignment(diet1.getId(), patient.getId(), "Primary assigned clinical dietitian");

        // 7. Active Approved Diet Plan
        DietPlan plan = ensureDietPlan(patient.getId(), diet1.getId());

        // 8. Food & Water Logs for Patient
        seedLogs(patient.getId(), plan);

        // 9. Culinary Kitchen Menu Items
        seedHotelMenu(hotelUser.getId());

        log.info("Comprehensive clinical dataset successfully loaded! 10 Doctors and 20 Dietitians are active and linked.");
    }

    private User ensureUser(String email, String firstName, String lastName, Role role, Status status) {
        return userRepository.findByEmail(email).map(existing -> {
            existing.setFirstName(firstName);
            existing.setLastName(lastName);
            existing.setRole(role);
            existing.setStatus(status);
            existing.setPasswordHash(passwordEncoder.encode("Password123!"));
            existing.setEmailVerified(true);
            return userRepository.save(existing);
        }).orElseGet(() -> {
            User u = User.builder()
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .role(role)
                .status(status)
                .passwordHash(passwordEncoder.encode("Password123!"))
                .emailVerified(true)
                .build();
            return userRepository.save(u);
        });
    }

    private void ensureDoctorProfile(User user, String license, String degree, String spec, String ach, String hosp, String addr, int exp, double fee) {
        ensureDoctorProfile(user, license, degree, spec, ach, hosp, addr, exp, fee, "APPROVED");
    }

    private void ensureDoctorProfile(User user, String license, String degree, String spec, String ach, String hosp, String addr, int exp, double fee, String verStatus) {
        DoctorProfile p = doctorRepository.findByUserId(user.getId()).orElse(null);
        if (p == null) {
            p = DoctorProfile.builder()
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
        } else {
            p.setLicenseNumber(license);
            p.setDegree(degree);
            p.setSpecialization(spec);
            p.setAchievements(ach);
            p.setHospitalName(hosp);
            p.setHospitalAddress(addr);
            p.setYearsExperience(exp);
            p.setConsultationFee(fee);
            p.setVerificationStatus(verStatus);
        }
        doctorRepository.save(p);
    }

    private void ensureDietitianProfile(User user, String license, String degree, String spec, String ach, String clinic, String addr, int exp, double fee) {
        DietitianProfile p = dietitianRepository.findByUserId(user.getId()).orElse(null);
        if (p == null) {
            p = DietitianProfile.builder()
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
        } else {
            p.setLicenseNumber(license);
            p.setDegree(degree);
            p.setSpecialization(spec);
            p.setAchievements(ach);
            p.setClinicName(clinic);
            p.setClinicAddress(addr);
            p.setYearsExperience(exp);
            p.setConsultationFee(fee);
            p.setVerificationStatus("APPROVED");
        }
        dietitianRepository.save(p);
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
