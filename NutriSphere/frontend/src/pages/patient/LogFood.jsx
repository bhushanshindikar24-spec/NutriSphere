import {  useState  } from "react";
import api from "../../services/api";
import { PlusCircle } from "lucide-react";

export default function LogFood() {
  const [formData, setFormData] = useState({
    foodName: "", calories: "", protein: "", carbs: "", fat: "", mealType: "BREAKFAST"
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/food-logs", formData);
      setSuccess(true);
      setFormData({ foodName: "", calories: "", protein: "", carbs: "", fat: "", mealType: "BREAKFAST" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to log food");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Log Food</h2>

      {success && <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--secondary)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>Food logged successfully!</div>}

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Food Name</label>
            <input type="text" className="form-input" required value={formData.foodName} onChange={e => setFormData({...formData, foodName: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Meal Type</label>
            <select className="form-input" value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})}>
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACK">Snack</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Calories (kcal)</label>
              <input type="number" className="form-input" required value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Protein (g)</label>
              <input type="number" className="form-input" required value={formData.protein} onChange={e => setFormData({...formData, protein: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Carbs (g)</label>
              <input type="number" className="form-input" required value={formData.carbs} onChange={e => setFormData({...formData, carbs: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Fat (g)</label>
              <input type="number" className="form-input" required value={formData.fat} onChange={e => setFormData({...formData, fat: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            <PlusCircle size={18} style={{ marginRight: "0.5rem" }} /> Log Food
          </button>
        </form>
      </div>
    </div>
  );
}
