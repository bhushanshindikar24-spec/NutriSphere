import {  useState  } from "react";
import api from "../../services/api";
import { PlusCircle, Sparkles } from "lucide-react";
import FoodSearch from "../../components/nutrition/FoodSearch";

export default function FoodLogging() {
  const [formData, setFormData] = useState({
    foodName: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    mealType: "BREAKFAST",
    portionGrams: 100,
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSelectFood = (food) => {
    setFormData({
      ...formData,
      foodName: food.name || food.foodName || "",
      calories: Math.round(food.caloriesPer100g || food.calories || 0),
      protein: Math.round(food.proteinG || 0),
      carbs: Math.round(food.carbsG || 0),
      fat: Math.round(food.fatG || 0),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/food-logs", formData);
      setSuccess(true);
      setFormData({
        foodName: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        mealType: "BREAKFAST",
        portionGrams: 100,
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to log food intake.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2>Log Daily Nutrition</h2>
        <p className="text-muted">
          Search verified USDA / OpenFoodFacts databases or manually enter home-cooked items.
        </p>
      </div>

      {/* Database Search */}
      <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }}>
        <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Sparkles size={16} color="var(--primary)" /> Instant Food & Barcode Search
        </h4>
        <FoodSearch onSelectFood={handleSelectFood} placeholder="Search rice, chicken breast, oats, apples..." />
      </div>

      {success && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10B981",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1rem",
            border: "1px solid rgba(16, 185, 129, 0.3)",
          }}
        >
          Meal successfully recorded into your digital twin journal!
        </div>
      )}

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Food or Recipe Name</label>
            <input
              type="text"
              className="input-field"
              required
              value={formData.foodName}
              onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
              placeholder="e.g. Oatmeal with Chia Seeds"
              style={{ width: "100%" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Meal Slot</label>
            <select
              className="input-field"
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              style={{ width: "100%" }}
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACK">Snack</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">Calories (kcal)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Carbs (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.carbs}
                onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fat (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.fat}
                onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            <PlusCircle size={18} style={{ marginRight: "0.5rem" }} />
            {loading ? "Recording..." : "Log Food Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}
