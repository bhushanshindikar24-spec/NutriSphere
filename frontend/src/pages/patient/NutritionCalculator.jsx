import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Calculator, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Utensils, 
  Layers, 
  PieChart 
} from "lucide-react";
import api from "../../services/api";

const COMMON_QUICK_FOODS = [
  { name: "Almonds", defaultQty: 8, defaultUnit: "pieces" },
  { name: "Brown Bread", defaultQty: 2, defaultUnit: "slices" },
  { name: "Paneer", defaultQty: 60, defaultUnit: "g" },
  { name: "Butter", defaultQty: 1, defaultUnit: "tbsp" },
  { name: "Egg", defaultQty: 2, defaultUnit: "pieces" },
  { name: "Milk", defaultQty: 1, defaultUnit: "cups" },
  { name: "Rolled Oats", defaultQty: 40, defaultUnit: "g" },
  { name: "Cucumber", defaultQty: 50, defaultUnit: "g" },
  { name: "Tomato", defaultQty: 40, defaultUnit: "g" },
  { name: "Walnuts", defaultQty: 1, defaultUnit: "handful" }
];

export default function NutritionCalculator() {
  const [activeTab, setActiveTab] = useState("single"); // 'single' or 'builder'

  // Single Item Calculator State
  const [foodQuery, setFoodQuery] = useState("Almonds");
  const [calcQuantity, setCalcQuantity] = useState("8");
  const [calcUnit, setCalcUnit] = useState("pieces");
  const [calculating, setCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState(null);
  const [calcError, setCalcError] = useState("");

  // Meal Builder State
  const [mealName, setMealName] = useState("Paneer Sandwich");
  const [mealType, setMealType] = useState("BREAKFAST");
  const [mealDate, setMealDate] = useState(new Date().toISOString().split("T")[0]);
  const [mealNotes, setMealNotes] = useState("Freshly prepared home meal");
  const [ingredients, setIngredients] = useState([
    { id: 1, foodName: "Brown Bread", quantity: 2, unit: "slices", grams: 60, calories: 156, proteinG: 6.0, carbsG: 28.0, fatG: 2.2 },
    { id: 2, foodName: "Paneer", quantity: 50, unit: "g", grams: 50, calories: 132, proteinG: 9.0, carbsG: 2.0, fatG: 10.0 },
    { id: 3, foodName: "Butter", quantity: 1, unit: "tbsp", grams: 14, calories: 102, proteinG: 0.1, carbsG: 0.0, fatG: 11.5 },
    { id: 4, foodName: "Cucumber", quantity: 30, unit: "g", grams: 30, calories: 5, proteinG: 0.2, carbsG: 1.1, fatG: 0.0 },
    { id: 5, foodName: "Tomato", quantity: 30, unit: "g", grams: 30, calories: 6, proteinG: 0.3, carbsG: 1.2, fatG: 0.1 }
  ]);
  const [savingMeal, setSavingMeal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

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

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "0.5rem", borderRadius: "10px", color: "var(--primary)" }}>
            <Calculator size={24} />
          </div>
          <h2 style={{ margin: 0 }}>Food Nutrition Calculator & Ingredient Meal Builder</h2>
        </div>
        <p className="text-muted" style={{ margin: 0 }}>
          Search any food item with unit measurements (e.g. 7-8 almonds, 2 slices bread) to calculate detailed nutritional values, or assemble multi-ingredient meals and log them directly to your daily diary.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("single")}
          style={{
            background: activeTab === "single" ? "rgba(16, 185, 129, 0.15)" : "transparent",
            color: activeTab === "single" ? "var(--primary)" : "inherit",
            border: "none",
            borderBottom: activeTab === "single" ? "2px solid var(--primary)" : "2px solid transparent",
            padding: "0.75rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            borderRadius: "6px 6px 0 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Search size={18} /> Single Food Calculator
        </button>

        <button
          onClick={() => setActiveTab("builder")}
          style={{
            background: activeTab === "builder" ? "rgba(16, 185, 129, 0.15)" : "transparent",
            color: activeTab === "builder" ? "var(--primary)" : "inherit",
            border: "none",
            borderBottom: activeTab === "builder" ? "2px solid var(--primary)" : "2px solid transparent",
            padding: "0.75rem 1.25rem",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            borderRadius: "6px 6px 0 0",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Layers size={18} /> Ingredient-Based Meal Builder ({ingredients.length})
        </button>
      </div>

      {/* Tab 1: Single Food Calculator */}
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
                    placeholder="e.g. Almonds, Paneer, Brown Bread, Oatmeal..."
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
                    step="0.5"
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

              <button
                type="submit"
                disabled={calculating}
                className="btn btn-primary"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                <Calculator size={18} />
                {calculating ? "Computing Nutrients..." : `Calculate for ${calcQuantity} ${calcUnit} of ${foodQuery || "Item"}`}
              </button>

              {calcError && (
                <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem" }}>
                  {calcError}
                </div>
              )}
            </form>
          </div>

          {/* Results Display */}
          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem" }}>Nutritional Profile</h3>

            {!calcResult ? (
              <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 1rem" }}>
                <PieChart size={48} style={{ opacity: 0.3, marginBottom: "0.75rem" }} />
                <p>Enter a food item and quantity on the left to see the instant nutritional analysis.</p>
                <span style={{ fontSize: "0.8rem", color: "var(--primary)" }}>
                  Try: "7-8 almonds", "2 slices of bread", or "50g paneer"
                </span>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.75rem" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.3rem" }}>{calcResult.foodName}</h4>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Portion: {calcResult.quantity} {calcResult.unit} ({Math.round(calcResult.calculatedGrams || 0)}g)
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)" }}>
                      {Math.round(calcResult.calories || 0)}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: "0.3rem" }}>kcal</span>
                  </div>
                </div>

                {/* Macronutrient Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                  <div style={{ background: "rgba(56, 189, 248, 0.1)", padding: "0.85rem", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.75rem", color: "#38bdf8", fontWeight: 700 }}>PROTEIN</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, marginTop: "0.2rem" }}>
                      {calcResult.proteinG}g
                    </div>
                  </div>

                  <div style={{ background: "rgba(251, 191, 36, 0.1)", padding: "0.85rem", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.75rem", color: "#fbbf24", fontWeight: 700 }}>CARBOHYDRATES</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, marginTop: "0.2rem" }}>
                      {calcResult.carbsG}g
                    </div>
                  </div>

                  <div style={{ background: "rgba(244, 63, 94, 0.1)", padding: "0.85rem", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.75rem", color: "#f43f5e", fontWeight: 700 }}>TOTAL FATS</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, marginTop: "0.2rem" }}>
                      {calcResult.fatG}g
                    </div>
                  </div>
                </div>

                {/* Micronutrients / Fiber */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span className="text-muted">Dietary Fiber:</span>
                    <strong>{calcResult.fiberG || 0} g</strong>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span className="text-muted">Sugars:</span>
                    <strong>{calcResult.sugarG || 0} g</strong>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span className="text-muted">Sodium:</span>
                    <strong>{calcResult.sodiumMg || 0} mg</strong>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.75rem", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}>
                    <span className="text-muted">Category:</span>
                    <strong>{calcResult.category || "Whole Food"}</strong>
                  </div>
                </div>

                {/* Add to Meal Builder CTA */}
                <button
                  type="button"
                  onClick={handleAddCalculatedToMeal}
                  className="btn btn-outline"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "0.5rem" }}
                >
                  <Plus size={16} /> Add This Item to Meal Builder
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Ingredient-Based Meal Builder */}
      {activeTab === "builder" && (
        <div style={{ display: "grid", gap: "1.75rem" }}>
          {saveSuccessMsg && (
            <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--primary)", padding: "1rem", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle size={20} />
                <span>{saveSuccessMsg}</span>
              </div>
              <Link to="/patient/daily-report" className="btn btn-outline" style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem" }}>
                View Daily Report →
              </Link>
            </div>
          )}

          {/* Meal Details Bar */}
          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                Meal Name / Recipe Title:
              </label>
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g. Paneer Sandwich, Protein Oatmeal Bowl"
                className="form-control"
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                Meal Session:
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="form-control"
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="SNACK">Snack</option>
                <option value="DINNER">Dinner</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                Date:
              </label>
              <input
                type="date"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Aggregate Nutrients Card */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Total Calories</span>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)", marginTop: "0.2rem" }}>
                {Math.round(totalCalories)} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>kcal</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Protein</span>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#38bdf8", marginTop: "0.2rem" }}>
                {totalProtein.toFixed(1)} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Carbohydrates</span>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fbbf24", marginTop: "0.2rem" }}>
                {totalCarbs.toFixed(1)} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Fats</span>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f43f5e", marginTop: "0.2rem" }}>
                {totalFat.toFixed(1)} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
              </div>
            </div>
          </div>

          {/* Ingredients Table */}
          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.15rem" }}>
                Meal Ingredients ({ingredients.length})
              </h3>
              <button
                onClick={() => setActiveTab("single")}
                className="btn btn-outline"
                style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Plus size={14} /> Calculate & Add Another Ingredient
              </button>
            </div>

            {ingredients.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                <p>No ingredients in this meal yet. Switch to Single Food Calculator to search and add ingredients.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "0.9rem 1.25rem",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.06)"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "1rem" }}>{ing.foodName}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        Portion: {ing.quantity} {ing.unit} ({ing.grams}g)
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <div style={{ textAlign: "right", fontSize: "0.85rem" }}>
                        <div style={{ fontWeight: 700, color: "var(--primary)" }}>{Math.round(ing.calories)} kcal</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                          P: {ing.proteinG}g • C: {ing.carbsG}g • F: {ing.fatG}g
                        </div>
                      </div>

                      <button
                        onClick={() => removeIngredient(ing.id)}
                        className="btn btn-outline"
                        style={{ padding: "0.35rem 0.5rem", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
                        title="Remove ingredient"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Notes & Confirm Save to Diary */}
            <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem", display: "grid", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Meal Notes / Preparation details:
                </label>
                <input
                  type="text"
                  value={mealNotes}
                  onChange={(e) => setMealNotes(e.target.value)}
                  placeholder="e.g. Lightly toasted, with a pinch of black pepper"
                  className="form-control"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                <button
                  onClick={handleSaveMealToDiary}
                  disabled={savingMeal || ingredients.length === 0}
                  className="btn btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.75rem", fontSize: "0.95rem" }}
                >
                  <Utensils size={18} />
                  {savingMeal ? "Logging Meal to Diary..." : "Log Built Meal to Daily Food Diary"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
