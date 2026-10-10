import {  useState  } from "react";
import { PlusCircle } from "lucide-react";

export default function FoodLogForm({ onSave, initialData = {} }) {
  const [formData, setFormData] = useState({
    foodName: initialData.foodName || "",
    calories: initialData.calories || "",
    protein: initialData.protein || "",
    carbs: initialData.carbs || "",
    fat: initialData.fat || "",
    mealType: initialData.mealType || "BREAKFAST",
    portionG: initialData.portionG || 100,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      calories: parseFloat(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
      portionG: parseFloat(formData.portionG) || 100,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Food / Meal Description</label>
        <input
          type="text"
          className="form-input"
          required
          value={formData.foodName}
          onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
          placeholder="e.g. Grilled Chicken Breast with Brown Rice"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group">
          <label className="form-label">Meal Slot</label>
          <select
            className="form-input"
            value={formData.mealType}
            onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
          >
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACK">Snack</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Portion Size (grams)</label>
          <input
            type="number"
            className="form-input"
            value={formData.portionG}
            onChange={(e) => setFormData({ ...formData, portionG: e.target.value })}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
        <div className="form-group">
          <label className="form-label">Calories</label>
          <input
            type="number"
            className="form-input"
            required
            value={formData.calories}
            onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Protein (g)</label>
          <input
            type="number"
            className="form-input"
            value={formData.protein}
            onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Carbs (g)</label>
          <input
            type="number"
            className="form-input"
            value={formData.carbs}
            onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Fat (g)</label>
          <input
            type="number"
            className="form-input"
            value={formData.fat}
            onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: "1rem" }}>
        <PlusCircle size={18} /> Record Food Entry
      </button>
    </form>
  );
}
