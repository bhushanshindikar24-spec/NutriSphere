import {  useState  } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../services/api";

export default function AddMeal() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "LUNCH",
    price: 14.99,
    calories: 500,
    proteinG: 35,
    carbsG: 50,
    fatG: 15,
    description: "",
    ingredients: "",
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/hotel/meals", {
        ...formData,
        price: Number(formData.price),
        calories: Number(formData.calories),
        proteinG: Number(formData.proteinG),
        carbsG: Number(formData.carbsG),
        fatG: Number(formData.fatG),
        ingredients: formData.ingredients.split(",").map((i) => i.trim()),
      });
      navigate("/hotel/menu");
    } catch (err) {
      console.error("Failed to add meal", err);
      navigate("/hotel/menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "750px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/hotel/menu")}
        className="btn btn-outline"
        style={{ marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Menu
      </button>

      <h2>Add Commercial Kitchen Meal</h2>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)", marginTop: "1rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Meal Name</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. Sesame Crusted Ahi Tuna Bowl"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: "100%" }}
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="SNACK">Snack / Side</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            <div>
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="input-field"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
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
            <div>
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.proteinG}
                onChange={(e) => setFormData({ ...formData, proteinG: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Carbs (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.carbsG}
                onChange={(e) => setFormData({ ...formData, carbsG: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Preparation method, culinary style, and clinical dietary benefits..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="form-label">Ingredients (Comma Separated)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 150g Tuna, Wild rice, Edamame, Sesame oil"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/hotel/menu")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} style={{ marginRight: "0.4rem" }} />
              {loading ? "Adding..." : "Add to Kitchen Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
