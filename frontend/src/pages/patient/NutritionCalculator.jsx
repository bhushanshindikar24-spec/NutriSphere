import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calculator, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Utensils, 
  Layers, 
  PieChart,
  Target,
  Activity,
  HeartPulse,
  Droplet,
  ShieldAlert,
  Sparkles,
  Save,
  ArrowRight,
  Info
} from "lucide-react";
import api from "../../services/api";

const COMMON_QUICK_FOODS = [
  { name: "Multigrain Phulka", defaultQty: 2, defaultUnit: "pieces" },
  { name: "Paneer", defaultQty: 60, defaultUnit: "g" },
  { name: "Yellow Moong Dal", defaultQty: 1, defaultUnit: "bowls" },
  { name: "Moong Dal Khichdi", defaultQty: 1, defaultUnit: "bowls" },
  { name: "Vegetable Poha", defaultQty: 1, defaultUnit: "bowls" },
  { name: "Roasted Makhana", defaultQty: 30, defaultUnit: "g" },
  { name: "Fresh Dahi", defaultQty: 1, defaultUnit: "cups" },
  { name: "Spiced Chaas", defaultQty: 1, defaultUnit: "cups" },
  { name: "Jowar Bhakri", defaultQty: 1, defaultUnit: "pieces" },
  { name: "Desi Egg Bhurji", defaultQty: 1, defaultUnit: "servings" }
];

export default function NutritionCalculator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("requirements"); // 'requirements', 'single', or 'builder'

  // Profile and Clinical Data
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Personalized Requirement Calculator Inputs
  const [age, setAge] = useState(26);
  const [gender, setGender] = useState("FEMALE");
  const [heightCm, setHeightCm] = useState(165);
  const [weightKg, setWeightKg] = useState(60);
  const [activityLevel, setActivityLevel] = useState("MODERATELY_ACTIVE");
  const [healthGoal, setHealthGoal] = useState("FAT_LOSS");
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [selectedDeficiencies, setSelectedDeficiencies] = useState([]);
  const [applyingTargets, setApplyingTargets] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState("");

  // Single Item Calculator State
  const [foodQuery, setFoodQuery] = useState("");
  const [calcQuantity, setCalcQuantity] = useState("100");
  const [calcUnit, setCalcUnit] = useState("g");
  const [calculating, setCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState(null);
  const [calcError, setCalcError] = useState("");

  // Meal Builder State
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("BREAKFAST");
  const [mealDate, setMealDate] = useState(new Date().toISOString().split("T")[0]);
  const [mealNotes, setMealNotes] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [savingMeal, setSavingMeal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Load patient clinical profile and bloodwork on mount
  useEffect(() => {
    const fetchPatientContext = async () => {
      try {
        setLoadingProfile(true);
        const [profRes, labRes] = await Promise.allSettled([
          api.get("/patients/profile"),
          api.get("/medical/laboratory/my")
        ]);

        if (profRes.status === "fulfilled") {
          const p = profRes.value.data?.data || profRes.value.data;
          if (p) {
            setProfileData(p);
            if (p.heightCm) setHeightCm(p.heightCm);
            if (p.weightKg) setWeightKg(p.weightKg);
            if (p.gender) setGender(p.gender);
            if (p.activityLevel) setActivityLevel(p.activityLevel);

            if (p.dateOfBirth) {
              const dob = new Date(p.dateOfBirth);
              const diffMs = Date.now() - dob.getTime();
              const calculatedAge = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
              if (calculatedAge > 0 && calculatedAge < 120) setAge(calculatedAge);
            }

            // Detect conditions from profile
            const conds = [];
            const condStr = (p.diagnosedConditions || "").toLowerCase();
            if (condStr.includes("diabetes") || condStr.includes("glucose")) conds.push("Type 2 Diabetes / Prediabetes");
            if (condStr.includes("pcos") || condStr.includes("pcod")) conds.push("PCOS / Insulin Resistance");
            if (condStr.includes("hypertension") || condStr.includes("blood pressure")) conds.push("Hypertension / Cardiovascular");
            if (condStr.includes("kidney") || condStr.includes("ckd")) conds.push("Chronic Kidney Disease (CKD)");
            if (condStr.includes("thyroid") || condStr.includes("hypothyroid")) conds.push("Hypothyroidism");
            if (condStr.includes("cholesterol") || condStr.includes("lipid")) conds.push("Hyperlipidemia / Elevated LDL");
            if (conds.length > 0) setSelectedConditions(conds);
          }
        }

        if (labRes.status === "fulfilled") {
          const labs = labRes.value.data?.data || labRes.value.data || [];
          const defs = new Set();
          labs.forEach(lab => {
            const summary = (lab.aiSummary || "").toLowerCase();
            const defStr = (lab.identifiedDeficiencies || "").toLowerCase();
            const combined = summary + " " + defStr;
            if (combined.includes("vitamin d") || combined.includes("25-oh")) defs.add("Vitamin D3 Deficiency (<30 ng/mL)");
            if (combined.includes("b12") || combined.includes("cobalamin")) defs.add("Vitamin B12 Deficiency (<250 pg/mL)");
            if (combined.includes("iron") || combined.includes("ferritin") || combined.includes("anemia")) defs.add("Iron / Serum Ferritin Deficiency");
            if (combined.includes("glucose") || combined.includes("hba1c")) defs.add("Elevated Fasting Glucose (>100 mg/dL)");
            if (combined.includes("cholesterol") || combined.includes("ldl")) defs.add("Elevated LDL Cholesterol (>100 mg/dL)");
          });
          if (defs.size > 0) setSelectedDeficiencies(Array.from(defs));
        }
      } catch (err) {
        console.error("Failed to load patient clinical context", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchPatientContext();
  }, []);

  // Scientific Nutrition Calculations (Mifflin-St Jeor & Clinical Adjustments)
  const calculationResults = useMemo(() => {
    const h = Number(heightCm) || 165;
    const w = Number(weightKg) || 60;
    const a = Number(age) || 26;

    // 1. BMI
    const heightM = h / 100.0;
    const bmi = Math.round((w / (heightM * heightM)) * 10) / 10;
    let bmiCategory = "Normal Weight";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi >= 25.0 && bmi < 29.9) bmiCategory = "Overweight";
    else if (bmi >= 30.0) bmiCategory = "Obese";

    // 2. Basal Metabolic Rate (BMR) - Mifflin-St Jeor
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    if (gender === "MALE") {
      bmr += 5;
    } else {
      bmr -= 161;
    }
    bmr = Math.round(bmr);

    // 3. Physical Activity Multiplier -> TDEE
    let actMultiplier = 1.375;
    if (activityLevel === "SEDENTARY") actMultiplier = 1.2;
    else if (activityLevel === "LIGHTLY_ACTIVE") actMultiplier = 1.375;
    else if (activityLevel === "MODERATELY_ACTIVE") actMultiplier = 1.55;
    else if (activityLevel === "VERY_ACTIVE") actMultiplier = 1.725;
    else if (activityLevel === "EXTREMELY_ACTIVE") actMultiplier = 1.9;

    const tdee = Math.round(bmr * actMultiplier);

    // 4. Target Calories based on Goal
    let goalOffset = 0;
    if (healthGoal === "FAT_LOSS") goalOffset = -500;
    else if (healthGoal === "MILD_LOSS") goalOffset = -250;
    else if (healthGoal === "MAINTENANCE") goalOffset = 0;
    else if (healthGoal === "MUSCLE_BUILD") goalOffset = 300;
    else if (healthGoal === "WEIGHT_GAIN") goalOffset = 500;

    const targetCalories = Math.max(1200, Math.round(tdee + goalOffset));

    // 5. Clinical Macronutrient Breakdown
    const hasDiabetes = selectedConditions.some(c => c.toLowerCase().includes("diabetes"));
    const hasPcos = selectedConditions.some(c => c.toLowerCase().includes("pcos"));
    const hasHypertension = selectedConditions.some(c => c.toLowerCase().includes("hypertension"));
    const hasCkd = selectedConditions.some(c => c.toLowerCase().includes("ckd") || c.toLowerCase().includes("kidney"));
    const hasHighCholesterol = selectedConditions.some(c => c.toLowerCase().includes("cholesterol"));

    // Protein Target
    let proteinPerKg = 1.3;
    if (hasCkd) proteinPerKg = 0.8;
    else if (healthGoal === "MUSCLE_BUILD") proteinPerKg = 2.0;
    else if (hasPcos || healthGoal === "FAT_LOSS") proteinPerKg = 1.6;
    const targetProteinG = Math.round(w * proteinPerKg);
    const proteinCalories = targetProteinG * 4;
    const proteinPercent = Math.round((proteinCalories / targetCalories) * 100);

    // Fat Target
    let fatPercent = 25;
    if (hasHighCholesterol) fatPercent = 22;
    else if (hasPcos) fatPercent = 30;
    const fatCalories = targetCalories * (fatPercent / 100);
    const targetFatG = Math.round(fatCalories / 9);

    // Carbohydrates Target
    const carbCalories = Math.max(200, targetCalories - proteinCalories - fatCalories);
    const targetCarbsG = Math.round(carbCalories / 4);
    const carbPercent = Math.round((carbCalories / targetCalories) * 100);

    // Dietary Fiber
    let targetFiberG = 28;
    if (hasDiabetes || hasHighCholesterol) targetFiberG = 38;
    else if (hasPcos) targetFiberG = 32;

    // Hydration Target
    let targetWaterMl = Math.round((w * 35 + (activityLevel === "VERY_ACTIVE" || activityLevel === "EXTREMELY_ACTIVE" ? 600 : 300)) / 100) * 100;
    const targetWaterL = (targetWaterMl / 1000).toFixed(1);

    // Clinical Micronutrient Targets
    const hasVitD = selectedDeficiencies.some(d => d.toLowerCase().includes("vitamin d"));
    const hasB12 = selectedDeficiencies.some(d => d.toLowerCase().includes("b12"));
    const hasIron = selectedDeficiencies.some(d => d.toLowerCase().includes("iron") || d.toLowerCase().includes("ferritin"));

    const micronutrients = [
      {
        name: "Vitamin D3",
        target: hasVitD ? "2,000 – 4,000 IU / day" : "1,000 IU / day",
        status: hasVitD ? "DEFICIENCY PROTOCOL" : "MAINTENANCE",
        clinicalNote: hasVitD ? "Therapeutic repletion protocol. Prioritize fortified dairy/plant milks, egg yolks, UV mushrooms, and morning sunlight." : "General immune and bone mineral homeostasis."
      },
      {
        name: "Vitamin B12",
        target: hasB12 ? "500 – 1,000 mcg / day" : "2.4 mcg / day",
        status: hasB12 ? "DEFICIENCY PROTOCOL" : "OPTIMAL",
        clinicalNote: hasB12 ? "Neurological & red cell synthesis restoration. Emphasize fortified nutritional yeast, dairy, legumes, and sublingual support." : "Standard cellular methylation requirement."
      },
      {
        name: "Iron & Ferritin",
        target: hasIron ? "27 mg / day" : (gender === "FEMALE" ? "18 mg / day" : "10 mg / day"),
        status: hasIron ? "ANEMIA SUPPORT" : "NORMAL",
        clinicalNote: hasIron ? "Enhance non-heme iron absorption by pairing with Vitamin C (citrus, bell peppers). Avoid tea/coffee within 90 minutes of meals." : "Oxygen transport and metabolic enzyme cofactor."
      },
      {
        name: "Calcium",
        target: "1,000 – 1,200 mg / day",
        status: "TARGET",
        clinicalNote: "Essential for bone density, neuromuscular transmission, and cardiac muscle contraction."
      },
      {
        name: "Sodium Threshold",
        target: hasHypertension ? "< 1,500 mg / day" : "< 2,000 mg / day",
        status: hasHypertension ? "RESTRICTED (DASH)" : "STANDARD",
        clinicalNote: hasHypertension ? "Strict DASH restriction to manage vascular resistance and maintain physiological blood pressure." : "Electrolyte and fluid balance ceiling."
      },
      {
        name: "Potassium",
        target: hasHypertension ? "3,500 – 4,700 mg / day" : "2,600 – 3,400 mg / day",
        status: hasHypertension ? "ELEVATED" : "STANDARD",
        clinicalNote: hasHypertension ? "Counterbalances sodium and relaxes arterial wall tension (avocados, leafy greens, bananas, sweet potatoes)." : "Intracellular electrolyte balance."
      }
    ];

    return {
      bmi,
      bmiCategory,
      bmr,
      tdee,
      targetCalories,
      targetProteinG,
      proteinPercent,
      targetCarbsG,
      carbPercent,
      targetFatG,
      fatPercent,
      targetFiberG,
      targetWaterMl,
      targetWaterL,
      micronutrients,
      hasDiabetes,
      hasPcos,
      hasHypertension,
      hasHighCholesterol,
      hasVitD,
      hasB12,
      hasIron
    };
  }, [age, gender, heightCm, weightKg, activityLevel, healthGoal, selectedConditions, selectedDeficiencies]);

  // Apply Calculated Targets to Patient Profile
  const handleApplyTargetsToProfile = async () => {
    try {
      setApplyingTargets(true);
      setApplySuccessMsg("");

      const payload = {
        ...(profileData || {}),
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        activityLevel: activityLevel,
        targetDailyCalories: Number(calculationResults.targetCalories),
        targetDailyWaterMl: Number(calculationResults.targetWaterMl),
        nutritionalRequirements: `Calculated Targets: ${calculationResults.targetCalories} kcal (Protein: ${calculationResults.targetProteinG}g, Carbs: ${calculationResults.targetCarbsG}g, Fat: ${calculationResults.targetFatG}g, Fiber: ${calculationResults.targetFiberG}g, Water: ${calculationResults.targetWaterL}L)`
      };

      await api.put("/patients/profile", payload);
      setApplySuccessMsg(`✅ Successfully updated your daily nutritional targets to ${calculationResults.targetCalories} kcal & ${calculationResults.targetWaterL}L water!`);
    } catch (err) {
      console.error("Failed to apply targets", err);
      alert(err.response?.data?.message || "Failed to update daily targets in your profile.");
    } finally {
      setApplyingTargets(false);
    }
  };

  // Single Item Nutrition Calculation
  const handleCalculateSingle = async (e) => {
    if (e) e.preventDefault();
    if (!foodQuery.trim() || !calcQuantity) return;

    try {
      setCalculating(true);
      setCalcError("");
      const res = await api.post("/food/calculate", {
        foodName: foodQuery.trim(),
        quantity: parseFloat(calcQuantity),
        unit: calcUnit
      });
      setCalcResult(res.data?.data || res.data);
    } catch (err) {
      console.error("Calculation failed", err);
      setCalcError(err.response?.data?.message || "Failed to calculate nutrient values. Please check food name.");
    } finally {
      setCalculating(false);
    }
  };

  // Add Calculated Result directly into Meal Builder
  const handleAddCalculatedToMeal = () => {
    if (!calcResult) return;
    const newIngredient = {
      id: Date.now(),
      foodName: calcResult.foodName,
      quantity: calcResult.quantity,
      unit: calcResult.unit,
      grams: calcResult.calculatedGrams || 100,
      calories: calcResult.calories || 0,
      proteinG: calcResult.proteinG || 0,
      carbsG: calcResult.carbsG || 0,
      fatG: calcResult.fatG || 0,
    };
    setIngredients([...ingredients, newIngredient]);
    setActiveTab("builder");
  };

  const removeIngredient = (id) => {
    setIngredients(ingredients.filter(it => it.id !== id));
  };

  // Totals in Meal Builder
  const totalCalories = ingredients.reduce((s, it) => s + (Number(it.calories) || 0), 0);
  const totalProtein = ingredients.reduce((s, it) => s + (Number(it.proteinG) || 0), 0);
  const totalCarbs = ingredients.reduce((s, it) => s + (Number(it.carbsG) || 0), 0);
  const totalFat = ingredients.reduce((s, it) => s + (Number(it.fatG) || 0), 0);

  // Save built meal to food diary
  const handleSaveMealToDiary = async () => {
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient to your meal.");
      return;
    }
    try {
      setSavingMeal(true);
      setSaveSuccessMsg("");

      const payload = {
        mealType: mealType,
        mealName: mealName.trim() || "Custom Assembled Meal",
        logDate: mealDate,
        notes: mealNotes.trim() || "Assembled via Food Nutrition Calculator",
        ingredients: ingredients.map(it => ({
          foodName: it.foodName,
          quantityG: it.grams || (it.quantity * 10),
          servingDescription: `${it.quantity} ${it.unit}`,
          calories: it.calories,
          proteinG: it.proteinG,
          carbsG: it.carbsG,
          fatG: it.fatG
        }))
      };

      await api.post("/food-logs/meal-builder", payload);
      setSaveSuccessMsg(`Success! "${mealName}" has been logged to your food diary for ${mealDate}.`);
    } catch (err) {
      console.error("Failed to save custom meal", err);
      alert(err.response?.data?.message || "Failed to log meal to food diary.");
    } finally {
      setSavingMeal(false);
    }
  };

  const toggleCondition = (cond) => {
    setSelectedConditions(prev => 
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const toggleDeficiency = (def) => {
    setSelectedDeficiencies(prev => 
      prev.includes(def) ? prev.filter(d => d !== def) : [...prev, def]
    );
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Header */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1.25rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
            <div style={{ background: "#ecfdf5", padding: "0.5rem", borderRadius: "10px", color: "#059669" }}>
              <Calculator size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>
              Nutrition Requirement & Meal Calculator
            </h2>
          </div>
          <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
            Scientific estimation of basal metabolic rate (BMR), total daily energy expenditure (TDEE), macronutrient balance, hydration, and condition-specific micronutrient targets.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/patient/diet-plan" className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>
            <Utensils size={16} /> View Current Diet Plan
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.75rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.25rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setActiveTab("requirements")}
          style={{
            background: activeTab === "requirements" ? "#0284c7" : "transparent",
            color: activeTab === "requirements" ? "#ffffff" : "#475569",
            border: "none",
            padding: "0.75rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.92rem",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.15s ease"
          }}
        >
          <Target size={18} /> 1. Daily Nutrition Requirement Calculator
        </button>

        <button
          onClick={() => setActiveTab("single")}
          style={{
            background: activeTab === "single" ? "#0284c7" : "transparent",
            color: activeTab === "single" ? "#ffffff" : "#475569",
            border: "none",
            padding: "0.75rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.92rem",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.15s ease"
          }}
        >
          <Search size={18} /> 2. Single Food Item Estimator
        </button>

        <button
          onClick={() => setActiveTab("builder")}
          style={{
            background: activeTab === "builder" ? "#0284c7" : "transparent",
            color: activeTab === "builder" ? "#ffffff" : "#475569",
            border: "none",
            padding: "0.75rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.92rem",
            cursor: "pointer",
            borderRadius: "10px 10px 0 0",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.15s ease"
          }}
        >
          <Layers size={18} /> 3. Ingredient Meal Builder ({ingredients.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PERSONALIZED DAILY NUTRITION REQUIREMENT CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === "requirements" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1.35fr", gap: "1.75rem", alignItems: "start" }}>
          
          {/* Left Column: Interactive Inputs */}
          <div style={{ display: "grid", gap: "1.25rem" }}>
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", color: "#0f172a" }}>
                <Activity size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                  Personal Biometrics & Activity
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "0.35rem" }}>
                    Age (Years):
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="form-control"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "0.35rem" }}>
                    Biological Sex:
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-control"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "0.35rem" }}>
                    Height (cm):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="80"
                    max="240"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="form-control"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "0.35rem" }}>
                    Weight (kg):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="250"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="form-control"
                    style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "0.35rem" }}>
                  Physical Activity Level:
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="form-control"
                  style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  <option value="SEDENTARY">Sedentary (Desk work, minimal exercise • 1.2x)</option>
                  <option value="LIGHTLY_ACTIVE">Lightly Active (1–3 days/week exercise • 1.375x)</option>
                  <option value="MODERATELY_ACTIVE">Moderately Active (3–5 days/week exercise • 1.55x)</option>
                  <option value="VERY_ACTIVE">Very Active (6–7 days/week hard exercise • 1.725x)</option>
                  <option value="EXTREMELY_ACTIVE">Extremely Active (Athletic training / physical labor • 1.9x)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "0.35rem" }}>
                  Health & Fitness Goal:
                </label>
                <select
                  value={healthGoal}
                  onChange={(e) => setHealthGoal(e.target.value)}
                  className="form-control"
                  style={{ width: "100%", padding: "0.6rem 0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                >
                  <option value="FAT_LOSS">Fat Loss (-500 kcal daily deficit)</option>
                  <option value="MILD_LOSS">Gradual Weight Loss (-250 kcal daily deficit)</option>
                  <option value="MAINTENANCE">Maintenance & Metabolic Health (0 kcal balance)</option>
                  <option value="MUSCLE_BUILD">Lean Muscle Building (+300 kcal surplus)</option>
                  <option value="WEIGHT_GAIN">Weight Gain & Nutritional Recovery (+500 kcal surplus)</option>
                </select>
              </div>
            </div>

            {/* Conditions & Blood Report Biomarkers Card */}
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem", color: "#0f172a" }}>
                <HeartPulse size={20} color="#e11d48" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                  Medical Conditions & Deficiencies
                </h3>
              </div>
              <p style={{ margin: "0 0 1rem 0", fontSize: "0.82rem", color: "#64748b" }}>
                Select diagnosed conditions and deficiencies identified in your bloodwork to dynamically adapt clinical macronutrient ratios and micronutrient targets.
              </p>

              {/* Conditions */}
              <div style={{ marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.45rem" }}>
                  Diagnosed Conditions:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {[
                    "Type 2 Diabetes / Prediabetes",
                    "PCOS / Insulin Resistance",
                    "Hypertension / Cardiovascular",
                    "Chronic Kidney Disease (CKD)",
                    "Hypothyroidism",
                    "Hyperlipidemia / Elevated LDL"
                  ].map(c => {
                    const isSelected = selectedConditions.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCondition(c)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: isSelected ? "1.5px solid #0284c7" : "1px solid #cbd5e1",
                          background: isSelected ? "#f0f9ff" : "#f8fafc",
                          color: isSelected ? "#0284c7" : "#475569"
                        }}
                      >
                        {isSelected ? "✓ " : "+ "}{c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Biomarker Deficiencies */}
              <div>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.45rem" }}>
                  Clinical Biomarker Deficiencies (from Blood Reports):
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {[
                    "Vitamin D3 Deficiency (<30 ng/mL)",
                    "Vitamin B12 Deficiency (<250 pg/mL)",
                    "Iron / Serum Ferritin Deficiency",
                    "Elevated Fasting Glucose (>100 mg/dL)",
                    "Elevated LDL Cholesterol (>100 mg/dL)"
                  ].map(d => {
                    const isSelected = selectedDeficiencies.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDeficiency(d)}
                        style={{
                          padding: "0.35rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: isSelected ? "1.5px solid #e11d48" : "1px solid #cbd5e1",
                          background: isSelected ? "#fff1f2" : "#f8fafc",
                          color: isSelected ? "#e11d48" : "#475569"
                        }}
                      >
                        {isSelected ? "⚠️ " : "+ "}{d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Nutrition Requirements */}
          <div style={{ display: "grid", gap: "1.25rem" }}>
            
            {/* Caloric & Metabolic Summary Card */}
            <div style={{
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
              color: "#ffffff",
              borderRadius: "16px",
              padding: "1.75rem",
              boxShadow: "0 10px 15px -3px rgba(2, 132, 199, 0.3)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#e0f2fe", fontWeight: 700 }}>
                    Personalized Daily Target Intake
                  </span>
                  <div style={{ fontSize: "2.75rem", fontWeight: 900, lineHeight: 1.1, margin: "0.25rem 0" }}>
                    {calculationResults.targetCalories}{" "}
                    <span style={{ fontSize: "1.25rem", fontWeight: 500, color: "#e0f2fe" }}>kcal / day</span>
                  </div>
                </div>

                <div style={{ textAlign: "right", background: "rgba(255, 255, 255, 0.15)", padding: "0.6rem 1rem", borderRadius: "12px" }}>
                  <div style={{ fontSize: "0.75rem", color: "#e0f2fe" }}>Body Mass Index (BMI)</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800 }}>{calculationResults.bmi}</div>
                  <div style={{ fontSize: "0.72rem", color: "#bae6fd", fontWeight: 600 }}>{calculationResults.bmiCategory}</div>
                </div>
              </div>

              {/* Sub-metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", background: "rgba(0, 0, 0, 0.15)", padding: "0.85rem 1rem", borderRadius: "12px" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#bae6fd" }}>BMR (Basal):</div>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{calculationResults.bmr} kcal</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#bae6fd" }}>TDEE (Maintenance):</div>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{calculationResults.tdee} kcal</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#bae6fd" }}>Daily Hydration:</div>
                  <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>{calculationResults.targetWaterL} L ({calculationResults.targetWaterMl} ml)</div>
                </div>
              </div>
            </div>

            {/* Macronutrient Distribution Card */}
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <PieChart size={20} color="#059669" />
                  <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                    Calculated Macronutrient Distribution
                  </h3>
                </div>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Fiber Target: <strong style={{ color: "#059669" }}>{calculationResults.targetFiberG}g / day</strong>
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                {/* Protein */}
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1rem", borderRadius: "12px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>
                    Protein
                  </div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#15803d", margin: "0.2rem 0" }}>
                    {calculationResults.targetProteinG}g
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#475569" }}>
                    {calculationResults.proteinPercent}% of daily energy • {(calculationResults.targetProteinG / (Number(weightKg) || 60)).toFixed(1)}g/kg
                  </div>
                </div>

                {/* Carbohydrates */}
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "1rem", borderRadius: "12px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1e40af", textTransform: "uppercase" }}>
                    Carbohydrates
                  </div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1d4ed8", margin: "0.2rem 0" }}>
                    {calculationResults.targetCarbsG}g
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#475569" }}>
                    {calculationResults.carbPercent}% of daily energy • {calculationResults.hasDiabetes ? "Low-GI Complex" : "Balanced"}
                  </div>
                </div>

                {/* Healthy Fats */}
                <div style={{ background: "#fefce8", border: "1px solid #fef08a", padding: "1rem", borderRadius: "12px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#854d0e", textTransform: "uppercase" }}>
                    Healthy Fats
                  </div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#a16207", margin: "0.2rem 0" }}>
                    {calculationResults.targetFatG}g
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#475569" }}>
                    {calculationResults.fatPercent}% of daily energy • {calculationResults.hasHighCholesterol ? "Sat Fat <7%" : "MUFA/PUFA"}
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Micronutrient Targets Card */}
            <div className="glass-panel" style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <ShieldAlert size={20} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                  Clinical Micronutrient & Electrolyte Targets
                </h3>
              </div>

              <div style={{ display: "grid", gap: "0.65rem" }}>
                {calculationResults.micronutrients.map((m, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "0.75rem 0.9rem",
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: "10px",
                    fontSize: "0.85rem"
                  }}>
                    <div style={{ maxWidth: "65%" }}>
                      <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.15rem" }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.35 }}>
                        {m.clinicalNote}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, color: "#0284c7", fontSize: "0.95rem" }}>
                        {m.target}
                      </div>
                      <span style={{
                        display: "inline-block",
                        marginTop: "0.2rem",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        padding: "0.1rem 0.4rem",
                        borderRadius: "9999px",
                        background: m.status.includes("DEFICIENCY") || m.status.includes("RESTRICTED") ? "#fee2e2" : "#e0f2fe",
                        color: m.status.includes("DEFICIENCY") || m.status.includes("RESTRICTED") ? "#dc2626" : "#0369a1"
                      }}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.25rem 1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <div>
                <button
                  onClick={handleApplyTargetsToProfile}
                  disabled={applyingTargets}
                  className="btn btn-primary"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.65rem 1.25rem",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    background: "#059669",
                    borderColor: "#059669"
                  }}
                >
                  <Save size={16} />
                  {applyingTargets ? "Saving Targets..." : "Apply & Save to My Daily Targets"}
                </button>
                {applySuccessMsg && (
                  <div style={{ fontSize: "0.82rem", color: "#059669", marginTop: "0.45rem", fontWeight: 600 }}>
                    {applySuccessMsg}
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/patient/diet-plan")}
                style={{
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.65rem 1.25rem",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Sparkles size={16} /> Generate AI Diet Plan from Targets <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SINGLE FOOD CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === "single" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Input Panel */}
          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem" }}>Estimate Food Nutrients</h3>

            <form onSubmit={handleCalculateSingle} style={{ display: "grid", gap: "1.25rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  Food Item Name:
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={foodQuery}
                    onChange={(e) => setFoodQuery(e.target.value)}
                    placeholder="e.g. Paneer, Multigrain Phulka, Moong Dal Khichdi, Poha, Makhana..."
                    className="form-control"
                    required
                  />
                  <Search size={18} style={{ position: "absolute", right: "12px", top: "12px", color: "var(--text-muted)" }} />
                </div>
              </div>

              {/* Quick Suggestion Pills */}
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.4rem" }}>
                  Quick Suggestions:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {COMMON_QUICK_FOODS.map((cf) => (
                    <button
                      key={cf.name}
                      type="button"
                      onClick={() => {
                        setFoodQuery(cf.name);
                        setCalcQuantity(String(cf.defaultQty));
                        setCalcUnit(cf.defaultUnit);
                      }}
                      style={{
                        background: foodQuery.toLowerCase() === cf.name.toLowerCase() ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "20px",
                        padding: "0.25rem 0.65rem",
                        fontSize: "0.75rem",
                        color: "inherit",
                        cursor: "pointer"
                      }}
                    >
                      {cf.name} ({cf.defaultQty} {cf.defaultUnit})
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Unit Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                    Quantity:
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    value={calcQuantity}
                    onChange={(e) => setCalcQuantity(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                    Serving Unit:
                  </label>
                  <select
                    value={calcUnit}
                    onChange={(e) => setCalcUnit(e.target.value)}
                    className="form-control"
                  >
                    <option value="pieces">Pieces / Units</option>
                    <option value="slices">Slices</option>
                    <option value="g">Grams (g)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="tbsp">Tablespoons (tbsp)</option>
                    <option value="cups">Cups</option>
                    <option value="handful">Handful</option>
                  </select>
                </div>
              </div>

              {calcError && (
                <div style={{ color: "#ef4444", fontSize: "0.85rem" }}>
                  {calcError}
                </div>
              )}

              <button
                type="submit"
                disabled={calculating || !foodQuery.trim()}
                className="btn btn-primary"
                style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
              >
                <Calculator size={18} />
                {calculating ? "Calculating..." : "Calculate Nutrition"}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem" }}>Nutritional Breakdown</h3>

            {!calcResult ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                <Search size={40} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
                <p>Enter a food item and quantity to see its calories, protein, carbohydrates, and fats.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "0.75rem" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.2rem", textTransform: "capitalize" }}>{calcResult.foodName}</h4>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      Portion: {calcResult.quantity} {calcResult.unit} ({calcResult.calculatedGrams || 100}g)
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>
                      {calcResult.calories}
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>CALORIES (kcal)</span>
                  </div>
                </div>

                {/* Macro Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "0.75rem", borderRadius: "8px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Protein</span>
                    <strong style={{ fontSize: "1.1rem", color: "#10B981" }}>{calcResult.proteinG}g</strong>
                  </div>

                  <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "0.75rem", borderRadius: "8px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Carbs</span>
                    <strong style={{ fontSize: "1.1rem", color: "#3B82F6" }}>{calcResult.carbsG}g</strong>
                  </div>

                  <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "0.75rem", borderRadius: "8px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Fats</span>
                    <strong style={{ fontSize: "1.1rem", color: "#F59E0B" }}>{calcResult.fatG}g</strong>
                  </div>
                </div>

                {/* Action: Add to Meal Builder */}
                <button
                  type="button"
                  onClick={handleAddCalculatedToMeal}
                  className="btn btn-outline"
                  style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}
                >
                  <Plus size={16} /> Add to Meal Builder
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: INGREDIENT-BASED MEAL BUILDER */}
      {/* ========================================================================= */}
      {activeTab === "builder" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
          {/* Ingredients list */}
          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.15rem" }}>Assembled Ingredients</h3>
              <button
                type="button"
                onClick={() => setActiveTab("single")}
                className="btn btn-outline"
                style={{ fontSize: "0.8rem", padding: "0.35rem 0.65rem" }}
              >
                <Plus size={14} /> Add Ingredient
              </button>
            </div>

            {ingredients.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                <Layers size={40} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
                <p>No ingredients added yet. Use the Single Food Calculator to search items and click "Add to Meal Builder".</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("single")}
                  className="btn btn-primary"
                  style={{ marginTop: "1rem" }}
                >
                  Find Ingredients
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem"
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.95rem", textTransform: "capitalize", display: "block" }}>
                        {ing.foodName}
                      </strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {ing.quantity} {ing.unit} ({ing.grams}g) • P: {ing.proteinG}g | C: {ing.carbsG}g | F: {ing.fatG}g
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontWeight: 700, color: "var(--primary)" }}>{ing.calories} kcal</span>
                      <button
                        type="button"
                        onClick={() => removeIngredient(ing.id)}
                        style={{ background: "transparent", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}
                        title="Remove ingredient"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meal Details & Submission */}
          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem" }}>Meal Summary & Diary Log</h3>

            {/* Total Macros Display */}
            <div style={{ background: "rgba(255, 255, 255, 0.04)", borderRadius: "10px", padding: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Calories:</span>
                <strong style={{ fontSize: "1.4rem", color: "var(--primary)" }}>{totalCalories} kcal</strong>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", fontSize: "0.8rem", textAlign: "center" }}>
                <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "0.4rem", borderRadius: "6px" }}>
                  Protein: <strong>{totalProtein.toFixed(1)}g</strong>
                </div>
                <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "0.4rem", borderRadius: "6px" }}>
                  Carbs: <strong>{totalCarbs.toFixed(1)}g</strong>
                </div>
                <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "0.4rem", borderRadius: "6px" }}>
                  Fats: <strong>{totalFat.toFixed(1)}g</strong>
                </div>
              </div>
            </div>

            {/* Meal Metadata Form */}
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>
                  Custom Meal Name:
                </label>
                <input
                  type="text"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="e.g. High-Protein Moong Chilla, Desi Thali, Khichdi with Dahi"
                  className="form-control"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>
                    Meal Type:
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="form-control"
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                    <option value="SNACK">Snack</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>
                    Diary Date:
                  </label>
                  <input
                    type="date"
                    value={mealDate}
                    onChange={(e) => setMealDate(e.target.value)}
                    className="form-control"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.35rem" }}>
                  Preparation Notes / Instructions:
                </label>
                <textarea
                  value={mealNotes}
                  onChange={(e) => setMealNotes(e.target.value)}
                  placeholder="Optional recipe notes or ingredient proportions..."
                  className="form-control"
                  rows={2}
                />
              </div>

              {saveSuccessMsg && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10B981", fontSize: "0.85rem" }}>
                  <CheckCircle size={16} />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveMealToDiary}
                disabled={savingMeal || ingredients.length === 0}
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.75rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
              >
                <Utensils size={18} />
                {savingMeal ? "Logging to Food Diary..." : "Save Meal to Food Diary"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
