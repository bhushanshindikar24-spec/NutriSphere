import { useState, useEffect } from "react";
import api from "../../services/api";
import { foodLogService } from "../../services/foodLogService";
import { PlusCircle, Sparkles, Clock, Edit2, Trash2, Check, X, Utensils } from "lucide-react";
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
  const [logs, setLogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await foodLogService.getTodayFoodLogs();
      setLogs(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch food logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
      await api.post("/food-logs", {
        foodName: formData.foodName,
        calories: Number(formData.calories) || 0,
        proteinG: Number(formData.protein) || 0,
        carbsG: Number(formData.carbs) || 0,
        fatG: Number(formData.fat) || 0,
        mealType: formData.mealType,
        quantityG: Number(formData.portionGrams) || 100,
        logDate: new Date().toISOString().split("T")[0],
        logTime: new Date().toTimeString().split(" ")[0].substring(0, 5)
      });
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
      await fetchLogs();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to log food intake.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      foodName: item.foodName,
      mealType: item.mealType || "BREAKFAST",
      calories: item.calories || 0,
      proteinG: item.proteinG || 0,
      carbsG: item.carbsG || 0,
      fatG: item.fatG || 0,
      quantityG: item.quantityG || 100
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await foodLogService.updateFoodLog(id, editForm);
      setEditingId(null);
      await fetchLogs();
    } catch (err) {
      console.error("Failed to update food log:", err);
      alert("Failed to update entry.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this food entry?")) return;
    try {
      await foodLogService.deleteFoodLog(id);
      await fetchLogs();
    } catch (err) {
      console.error("Failed to delete food log:", err);
      alert("Failed to delete entry.");
    }
  };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div>
        <h2 style={{ margin: "0 0 0.25rem 0" }}>Log Daily Nutrition</h2>
        <p className="text-muted" style={{ margin: 0 }}>
          Search verified USDA / OpenFoodFacts databases or manually enter home-cooked items.
        </p>
      </div>

      {success && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "1rem", borderRadius: "var(--radius-md)" }}>
          Food logged successfully!
        </div>
      )}

      {/* Database Search */}
      <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Sparkles size={16} color="var(--primary)" /> Instant Food & Barcode Search
        </h4>
        <FoodSearch onSelectFood={handleSelectFood} placeholder="Search rice, chicken breast, oats, apples..." />
      </div>

      {/* Manual Entry Form */}
      <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Food Name *</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. Scrambled Eggs with Avocado"
                value={formData.foodName}
                onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meal Type</label>
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
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
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
                step="0.1"
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
                step="0.1"
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
                step="0.1"
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

      {/* Today's Logged Items with EDIT & DELETE */}
      <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Clock size={18} color="#0284c7" /> Today's Logged Food Items ({logs.length})
          </h3>
        </div>

        {logs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
            <Utensils size={32} style={{ margin: "0 auto 0.5rem", opacity: 0.3 }} />
            <p style={{ margin: 0 }}>No food logged yet today.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {logs.map((item) => {
              const isEditing = editingId === item.id;
              if (isEditing) {
                return (
                  <div key={item.id} style={{ background: "#f0f9ff", border: "2px solid #0284c7", borderRadius: "12px", padding: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                      <input
                        type="text"
                        className="form-input"
                        value={editForm.foodName}
                        onChange={(e) => setEditForm({ ...editForm, foodName: e.target.value })}
                      />
                      <select
                        className="form-input"
                        value={editForm.mealType}
                        onChange={(e) => setEditForm({ ...editForm, mealType: e.target.value })}
                      >
                        <option value="BREAKFAST">Breakfast</option>
                        <option value="LUNCH">Lunch</option>
                        <option value="DINNER">Dinner</option>
                        <option value="SNACK">Snack</option>
                      </select>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <input type="number" className="form-input" placeholder="Calories" value={editForm.calories} onChange={(e) => setEditForm({ ...editForm, calories: e.target.value })} />
                      <input type="number" step="0.1" className="form-input" placeholder="Protein" value={editForm.proteinG} onChange={(e) => setEditForm({ ...editForm, proteinG: e.target.value })} />
                      <input type="number" step="0.1" className="form-input" placeholder="Carbs" value={editForm.carbsG} onChange={(e) => setEditForm({ ...editForm, carbsG: e.target.value })} />
                      <input type="number" step="0.1" className="form-input" placeholder="Fat" value={editForm.fatG} onChange={(e) => setEditForm({ ...editForm, fatG: e.target.value })} />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => handleSaveEdit(item.id)} className="btn btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                        <Check size={14} /> Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn btn-outline" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                );
              }
              return (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1rem", border: "1px solid var(--border-color)", borderRadius: "10px" }}>
                  <div>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "9999px", background: "#f1f5f9", marginRight: "0.5rem" }}>
                      {item.mealType}
                    </span>
                    <strong>{item.foodName}</strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      {item.calories} kcal • P: {item.proteinG}g • C: {item.carbsG}g • F: {item.fatG}g
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button onClick={() => handleStartEdit(item)} className="btn btn-outline" style={{ padding: "0.35rem 0.6rem", fontSize: "0.78rem" }}>
                      <Edit2 size={13} color="#0284c7" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="btn btn-outline" style={{ padding: "0.35rem 0.6rem", fontSize: "0.78rem", color: "#ef4444" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
