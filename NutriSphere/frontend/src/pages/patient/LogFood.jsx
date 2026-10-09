import { useState } from "react";
import api from "../../services/api";
import { PlusCircle } from "lucide-react";

const initialFormData = {
  foodName: "",
  calories: "",
  proteinG: "",
  carbsG: "",
  fatG: "",
  mealType: "BREAKFAST"
};

export default function LogFood() {
  const [formData, setFormData] = useState(initialFormData);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/food-logs", {
  foodName: formData.foodName,
  mealType: formData.mealType,
  calories: Number(formData.calories),
  proteinG: Number(formData.proteinG),
  carbsG: Number(formData.carbsG),
  fatG: Number(formData.fatG),
  logDate: new Date().toISOString().split("T")[0]
});
      setSuccess(true);
      setFormData(initialFormData);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Food log failed:", err);
      alert("Failed to log food");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Log Food</h2>

      {success && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            color: "var(--secondary)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "1rem"
          }}
        >
          Food logged successfully!
        </div>
      )}

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Food Name</label>
            <input
              type="text"
              className="form-input"
              required
              value={formData.foodName}
              onChange={(e) =>
                setFormData({ ...formData, foodName: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Meal Type</label>
            <select
              className="form-input"
              value={formData.mealType}
              onChange={(e) =>
                setFormData({ ...formData, mealType: e.target.value })
              }
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACK">Snack</option>
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem"
            }}
          >
            <div className="form-group">
              <label className="form-label">Calories (kcal)</label>
              <input
                type="number"
                className="form-input"
                required
                min="0"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({ ...formData, calories: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                className="form-input"
                required
                min="0"
                step="0.1"
                value={formData.proteinG}
                onChange={(e) =>
                  setFormData({ ...formData, proteinG: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Carbs (g)</label>
              <input
                type="number"
                className="form-input"
                required
                min="0"
                step="0.1"
                value={formData.carbsG}
                onChange={(e) =>
                  setFormData({ ...formData, carbsG: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fat (g)</label>
              <input
                type="number"
                className="form-input"
                required
                min="0"
                step="0.1"
                value={formData.fatG}
                onChange={(e) =>
                  setFormData({ ...formData, fatG: e.target.value })
                }
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            <PlusCircle size={18} style={{ marginRight: "0.5rem" }} />
            Log Food
          </button>
        </form>
      </div>
    </div>
  );
}