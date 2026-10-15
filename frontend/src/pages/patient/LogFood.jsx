import { useState, useEffect } from "react";
import { 
  PlusCircle, Utensils, Droplets, Edit2, Trash2, Check, X, 
  Sparkles, Clock, AlertCircle, Plus 
} from "lucide-react";
import { foodLogService } from "../../services/foodLogService";
import { waterLogService } from "../../services/waterLogService";
import FoodSearch from "../../components/nutrition/FoodSearch";

const initialFoodForm = {
  foodName: "",
  calories: "",
  proteinG: "",
  carbsG: "",
  fatG: "",
  quantityG: 100,
  mealType: "BREAKFAST",
  notes: ""
};

export default function LogFood() {
  const [activeTab, setActiveTab] = useState("food"); // "food" | "water"
  
  // Food State
  const [foodFormData, setFoodFormData] = useState(initialFoodForm);
  const [foodLogs, setFoodLogs] = useState([]);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [editFoodForm, setEditFoodForm] = useState(null);
  
  // Water State
  const [waterLogs, setWaterLogs] = useState([]);
  const [customWaterMl, setCustomWaterMl] = useState("");
  const [editingWaterId, setEditingWaterId] = useState(null);
  const [editWaterForm, setEditWaterForm] = useState(null);

  // Common UI State
  const [_loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Fetch Food Logs
  const fetchFoodLogs = async () => {
    try {
      const res = await foodLogService.getTodayFoodLogs();
      setFoodLogs(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load food logs:", err);
    }
  };

  // Fetch Water Logs
  const fetchWaterLogs = async () => {
    try {
      const res = await waterLogService.getTodayWaterLogs();
      setWaterLogs(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load water logs:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchFoodLogs(), fetchWaterLogs()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  // Food Handlers
  const handleSelectFood = (food) => {
    setFoodFormData({
      ...foodFormData,
      foodName: food.name || food.foodName || "",
      calories: Math.round(food.caloriesPer100g || food.calories || 0),
      proteinG: Math.round(food.proteinG || 0),
      carbsG: Math.round(food.carbsG || 0),
      fatG: Math.round(food.fatG || 0),
      quantityG: 100,
    });
  };

  const handleLogFood = async (e) => {
    e.preventDefault();
    if (!foodFormData.foodName.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        foodName: foodFormData.foodName,
        mealType: foodFormData.mealType,
        calories: Number(foodFormData.calories) || 0,
        proteinG: Number(foodFormData.proteinG) || 0,
        carbsG: Number(foodFormData.carbsG) || 0,
        fatG: Number(foodFormData.fatG) || 0,
        quantityG: Number(foodFormData.quantityG) || 100,
        notes: foodFormData.notes || "",
        logDate: new Date().toISOString().split("T")[0],
        logTime: new Date().toTimeString().split(" ")[0].substring(0, 5)
      };
      await foodLogService.logFood(payload);
      showNotification("Food entry logged successfully!");
      setFoodFormData(initialFoodForm);
      await fetchFoodLogs();
    } catch (err) {
      console.error("Failed to log food:", err);
      showNotification("Failed to log food. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEditFood = (item) => {
    setEditingFoodId(item.id);
    setEditFoodForm({
      foodName: item.foodName,
      mealType: item.mealType || "BREAKFAST",
      calories: item.calories || 0,
      proteinG: item.proteinG || 0,
      carbsG: item.carbsG || 0,
      fatG: item.fatG || 0,
      quantityG: item.quantityG || 100,
      notes: item.notes || ""
    });
  };

  const handleSaveEditFood = async (id) => {
    setSubmitting(true);
    try {
      await foodLogService.updateFoodLog(id, {
        ...editFoodForm,
        calories: Number(editFoodForm.calories) || 0,
        proteinG: Number(editFoodForm.proteinG) || 0,
        carbsG: Number(editFoodForm.carbsG) || 0,
        fatG: Number(editFoodForm.fatG) || 0,
        quantityG: Number(editFoodForm.quantityG) || 100,
      });
      showNotification("Food entry updated!");
      setEditingFoodId(null);
      await fetchFoodLogs();
    } catch (err) {
      console.error("Failed to update food log:", err);
      showNotification("Failed to update food entry.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food entry?")) return;
    try {
      await foodLogService.deleteFoodLog(id);
      showNotification("Food entry deleted.");
      await fetchFoodLogs();
    } catch (err) {
      console.error("Failed to delete food log:", err);
      showNotification("Failed to delete food entry.", "error");
    }
  };

  // Water Handlers
  const handleLogWater = async (amount) => {
    const ml = Number(amount);
    if (!ml || ml <= 0) return;
    setSubmitting(true);
    try {
      await waterLogService.logWater({ 
        amountMl: ml,
        logDate: new Date().toISOString().split("T")[0],
        logTime: new Date().toTimeString().split(" ")[0].substring(0, 5)
      });
      showNotification(`Logged +${ml} mL of water!`);
      setCustomWaterMl("");
      await fetchWaterLogs();
    } catch (err) {
      console.error("Failed to log water:", err);
      showNotification("Failed to log hydration.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEditWater = (item) => {
    setEditingWaterId(item.id);
    setEditWaterForm({
      amountMl: item.amountMl || item.amount || 250,
      notes: item.notes || ""
    });
  };

  const handleSaveEditWater = async (id) => {
    setSubmitting(true);
    try {
      await waterLogService.updateWaterLog(id, {
        amountMl: Number(editWaterForm.amountMl) || 0,
        notes: editWaterForm.notes || ""
      });
      showNotification("Hydration entry updated!");
      setEditingWaterId(null);
      await fetchWaterLogs();
    } catch (err) {
      console.error("Failed to update water log:", err);
      showNotification("Failed to update hydration entry.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWater = async (id) => {
    if (!window.confirm("Are you sure you want to delete this water entry?")) return;
    try {
      await waterLogService.deleteWaterLog(id);
      showNotification("Hydration entry deleted.");
      await fetchWaterLogs();
    } catch (err) {
      console.error("Failed to delete water log:", err);
      showNotification("Failed to delete hydration entry.", "error");
    }
  };

  // Totals calculations
  const totalCalories = foodLogs.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
  const totalProtein = foodLogs.reduce((acc, it) => acc + (Number(it.proteinG) || 0), 0);
  const totalCarbs = foodLogs.reduce((acc, it) => acc + (Number(it.carbsG) || 0), 0);
  const totalFat = foodLogs.reduce((acc, it) => acc + (Number(it.fatG) || 0), 0);
  const totalWaterMl = waterLogs.reduce((acc, it) => acc + (Number(it.amountMl || it.amount) || 0), 0);
  const targetWaterMl = 2500;
  const waterPct = Math.min(100, Math.round((totalWaterMl / targetWaterMl) * 100));

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      {/* Page Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: "0 0 0.25rem 0" }}>Daily Nutrition & Hydration Tracker</h2>
          <p className="text-muted" style={{ margin: 0 }}>
            Log your daily food intake and water consumption, view today's history, and update any entry.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          background: notification.type === "error" ? "#fef2f2" : "#f0fdf4",
          border: `1px solid ${notification.type === "error" ? "#fecaca" : "#bbf7d0"}`,
          color: notification.type === "error" ? "#b91c1c" : "#15803d",
          padding: "0.85rem 1.25rem",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontSize: "0.9rem",
          fontWeight: 600
        }}>
          {notification.type === "error" ? <AlertCircle size={18} /> : <Check size={18} />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: "flex",
        background: "#f1f5f9",
        padding: "0.35rem",
        borderRadius: "14px",
        gap: "0.35rem"
      }}>
        <button
          onClick={() => setActiveTab("food")}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.92rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: activeTab === "food" ? "#ffffff" : "transparent",
            color: activeTab === "food" ? "#0284c7" : "#64748b",
            boxShadow: activeTab === "food" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          <Utensils size={18} /> Food & Meals ({foodLogs.length})
        </button>

        <button
          onClick={() => setActiveTab("water")}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "0.92rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            background: activeTab === "water" ? "#ffffff" : "transparent",
            color: activeTab === "water" ? "#0284c7" : "#64748b",
            boxShadow: activeTab === "water" ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.2s ease"
          }}
        >
          <Droplets size={18} /> Hydration ({waterLogs.length})
        </button>
      </div>

      {/* TAB 1: FOOD & MEALS */}
      {activeTab === "food" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {/* Summary Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Calories</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0284c7" }}>{totalCalories} <span style={{ fontSize: "0.8rem", color: "#64748b" }}>kcal</span></div>
            </div>
            <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Protein</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#10b981" }}>{totalProtein} <span style={{ fontSize: "0.8rem", color: "#64748b" }}>g</span></div>
            </div>
            <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Carbs</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f59e0b" }}>{totalCarbs} <span style={{ fontSize: "0.8rem", color: "#64748b" }}>g</span></div>
            </div>
            <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Fat</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ef4444" }}>{totalFat} <span style={{ fontSize: "0.8rem", color: "#64748b" }}>g</span></div>
            </div>
          </div>

          {/* Quick Search & Log Form */}
          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <PlusCircle size={20} color="#0284c7" /> Log a New Meal / Food Item
            </h3>

            {/* Database Instant Search */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Sparkles size={15} color="#0284c7" /> Search Food Database (USDA / Nutrition Database)
              </label>
              <FoodSearch onSelectFood={handleSelectFood} placeholder="Search rice, grilled chicken breast, oats, avocado..." />
            </div>

            <form onSubmit={handleLogFood} style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Food Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Greek Yogurt with Berries"
                    value={foodFormData.foodName}
                    onChange={(e) => setFoodFormData({ ...foodFormData, foodName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Meal Type</label>
                  <select
                    className="form-input"
                    value={foodFormData.mealType}
                    onChange={(e) => setFoodFormData({ ...foodFormData, mealType: e.target.value })}
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                    <option value="SNACK">Snack</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                <div>
                  <label className="form-label">Calories (kcal)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    placeholder="0"
                    value={foodFormData.calories}
                    onChange={(e) => setFoodFormData({ ...foodFormData, calories: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Protein (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-input"
                    placeholder="0"
                    value={foodFormData.proteinG}
                    onChange={(e) => setFoodFormData({ ...foodFormData, proteinG: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Carbs (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-input"
                    placeholder="0"
                    value={foodFormData.carbsG}
                    onChange={(e) => setFoodFormData({ ...foodFormData, carbsG: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Fat (g)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-input"
                    placeholder="0"
                    value={foodFormData.fatG}
                    onChange={(e) => setFoodFormData({ ...foodFormData, fatG: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting || !foodFormData.foodName.trim()} style={{ justifySelf: "start", marginTop: "0.25rem" }}>
                <PlusCircle size={16} /> {submitting ? "Logging..." : "Add to Food Log"}
              </button>
            </form>
          </div>

          {/* Today's Logged Food List with EDIT & DELETE */}
          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Clock size={18} color="#0284c7" /> Today's Logged Food Entries
              </h3>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {foodLogs.length} items logged today
              </span>
            </div>

            {foodLogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                <Utensils size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.3 }} />
                <p style={{ margin: 0 }}>No food logged yet today. Use the form above to record your first meal!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.85rem" }}>
                {foodLogs.map((item) => {
                  const isEditing = editingFoodId === item.id;

                  if (isEditing) {
                    return (
                      <div key={item.id} style={{
                        background: "#f0f9ff",
                        border: "2px solid #0284c7",
                        borderRadius: "14px",
                        padding: "1.25rem"
                      }}>
                        <div style={{ fontWeight: 700, color: "#0284c7", marginBottom: "0.75rem", fontSize: "0.95rem" }}>
                          Edit Food Entry
                        </div>
                        <div style={{ display: "grid", gap: "0.75rem" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.75rem" }}>
                            <div>
                              <label className="form-label" style={{ fontSize: "0.8rem" }}>Food Name</label>
                              <input
                                type="text"
                                className="form-input"
                                value={editFoodForm.foodName}
                                onChange={(e) => setEditFoodForm({ ...editFoodForm, foodName: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="form-label" style={{ fontSize: "0.8rem" }}>Meal Type</label>
                              <select
                                className="form-input"
                                value={editFoodForm.mealType}
                                onChange={(e) => setEditFoodForm({ ...editFoodForm, mealType: e.target.value })}
                              >
                                <option value="BREAKFAST">Breakfast</option>
                                <option value="LUNCH">Lunch</option>
                                <option value="DINNER">Dinner</option>
                                <option value="SNACK">Snack</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                            <div>
                              <label className="form-label" style={{ fontSize: "0.8rem" }}>Calories</label>
                              <input
                                type="number"
                                className="form-input"
                                value={editFoodForm.calories}
                                onChange={(e) => setEditFoodForm({ ...editFoodForm, calories: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="form-label" style={{ fontSize: "0.8rem" }}>Protein (g)</label>
                              <input
                                type="number"
                                step="0.1"
                                className="form-input"
                                value={editFoodForm.proteinG}
                                onChange={(e) => setEditFoodForm({ ...editFoodForm, proteinG: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="form-label" style={{ fontSize: "0.8rem" }}>Carbs (g)</label>
                              <input
                                type="number"
                                step="0.1"
                                className="form-input"
                                value={editFoodForm.carbsG}
                                onChange={(e) => setEditFoodForm({ ...editFoodForm, carbsG: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="form-label" style={{ fontSize: "0.8rem" }}>Fat (g)</label>
                              <input
                                type="number"
                                step="0.1"
                                className="form-input"
                                value={editFoodForm.fatG}
                                onChange={(e) => setEditFoodForm({ ...editFoodForm, fatG: e.target.value })}
                              />
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                            <button
                              onClick={() => handleSaveEditFood(item.id)}
                              className="btn btn-primary"
                              style={{ fontSize: "0.85rem", padding: "0.45rem 0.9rem" }}
                              disabled={submitting}
                            >
                              <Check size={15} /> Save Changes
                            </button>
                            <button
                              onClick={() => setEditingFoodId(null)}
                              className="btn btn-outline"
                              style={{ fontSize: "0.85rem", padding: "0.45rem 0.9rem" }}
                            >
                              <X size={15} /> Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: "1rem 1.25rem",
                        borderRadius: "12px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-surface)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                          <span style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.6rem",
                            borderRadius: "9999px",
                            background: 
                              item.mealType === "BREAKFAST" ? "#fef3c7" :
                              item.mealType === "LUNCH" ? "#dbeafe" :
                              item.mealType === "DINNER" ? "#e0e7ff" : "#f1f5f9",
                            color:
                              item.mealType === "BREAKFAST" ? "#b45309" :
                              item.mealType === "LUNCH" ? "#1d4ed8" :
                              item.mealType === "DINNER" ? "#4338ca" : "#475569",
                          }}>
                            {item.mealType || "MEAL"}
                          </span>
                          <strong style={{ fontSize: "1rem" }}>{item.foodName}</strong>
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                          <span><strong>{item.calories || 0}</strong> kcal</span>
                          <span>•</span>
                          <span>P: <strong>{item.proteinG || 0}g</strong></span>
                          <span>•</span>
                          <span>C: <strong>{item.carbsG || 0}g</strong></span>
                          <span>•</span>
                          <span>F: <strong>{item.fatG || 0}g</strong></span>
                          {item.logTime && (
                            <>
                              <span>•</span>
                              <span>{item.logTime}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        <button
                          onClick={() => handleStartEditFood(item)}
                          className="btn btn-outline"
                          title="Edit Food Log"
                          style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          <Edit2 size={14} color="#0284c7" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFood(item.id)}
                          className="btn btn-outline"
                          title="Delete Food Log"
                          style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", color: "#ef4444", borderColor: "#fecaca" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HYDRATION & WATER */}
      {activeTab === "water" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {/* Progress Card */}
          <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
            <div style={{ display: "inline-flex", padding: "1rem", borderRadius: "50%", background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", marginBottom: "0.75rem" }}>
              <Droplets size={36} />
            </div>
            <h3 style={{ fontSize: "2.25rem", margin: "0 0 0.25rem 0", color: "#3B82F6" }}>
              {totalWaterMl} <span style={{ fontSize: "1.15rem", color: "var(--text-muted)", fontWeight: 400 }}>/ {targetWaterMl} mL</span>
            </h3>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
              {waterPct}% of daily recommended hydration target reached
            </p>

            <div style={{ height: "10px", background: "var(--border-color)", borderRadius: "5px", overflow: "hidden", margin: "1.5rem 0 0.5rem 0" }}>
              <div
                style={{
                  height: "100%",
                  width: `${waterPct}%`,
                  background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                  borderRadius: "5px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Quick Add Hydration */}
          <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
            <h4 style={{ margin: "0 0 1rem 0" }}>Quick Add Hydration</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
              {[
                { label: "Glass (250 mL)", amount: 250 },
                { label: "Bottle (500 mL)", amount: 500 },
                { label: "Flask (750 mL)", amount: 750 },
              ].map((item) => (
                <button
                  key={item.amount}
                  className="btn btn-outline"
                  disabled={submitting}
                  onClick={() => handleLogWater(item.amount)}
                  style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
                >
                  <Droplets size={20} color="#3B82F6" />
                  <strong style={{ fontSize: "0.9rem" }}>+{item.amount} mL</strong>
                  <span className="text-muted" style={{ fontSize: "0.75rem" }}>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogWater(customWaterMl);
              }}
              style={{ display: "flex", gap: "0.75rem" }}
            >
              <input
                type="number"
                min="10"
                step="10"
                className="input-field"
                placeholder="Custom amount in mL (e.g. 350)"
                value={customWaterMl}
                onChange={(e) => setCustomWaterMl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={submitting || !customWaterMl}>
                <Plus size={16} /> Add Custom
              </button>
            </form>
          </div>

          {/* Today's Logged Water Entries with EDIT & DELETE */}
          <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Clock size={18} color="#3B82F6" /> Today's Hydration Entries
              </h3>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {waterLogs.length} entries recorded
              </span>
            </div>

            {waterLogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                <Droplets size={36} style={{ margin: "0 auto 0.75rem", opacity: 0.3, color: "#3B82F6" }} />
                <p style={{ margin: 0 }}>No water logged yet today. Drink a glass of water to get started!</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {waterLogs.map((log) => {
                  const isEditing = editingWaterId === log.id;

                  if (isEditing) {
                    return (
                      <div key={log.id} style={{
                        background: "#eff6ff",
                        border: "2px solid #3b82f6",
                        borderRadius: "12px",
                        padding: "1rem"
                      }}>
                        <div style={{ fontWeight: 700, color: "#2563eb", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                          Edit Water Intake Entry
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
                          <input
                            type="number"
                            min="10"
                            step="10"
                            className="form-input"
                            style={{ width: "160px" }}
                            value={editWaterForm.amountMl}
                            onChange={(e) => setEditWaterForm({ ...editWaterForm, amountMl: e.target.value })}
                          />
                          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>mL</span>
                          <button
                            onClick={() => handleSaveEditWater(log.id)}
                            className="btn btn-primary"
                            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                            disabled={submitting}
                          >
                            <Check size={14} /> Save
                          </button>
                          <button
                            onClick={() => setEditingWaterId(null)}
                            className="btn btn-outline"
                            style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                          >
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={log.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem 1rem",
                        background: "var(--bg-surface)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          background: "#eff6ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          <Droplets size={16} color="#3B82F6" />
                        </div>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{log.amountMl || log.amount} mL</span>
                          {log.notes && (
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
                              • {log.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                          {log.logTime || (log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Today")}
                        </span>
                        <button
                          onClick={() => handleStartEditWater(log)}
                          className="btn btn-outline"
                          title="Edit Water Log"
                          style={{ padding: "0.35rem 0.6rem", fontSize: "0.78rem" }}
                        >
                          <Edit2 size={13} color="#3b82f6" />
                        </button>
                        <button
                          onClick={() => handleDeleteWater(log.id)}
                          className="btn btn-outline"
                          title="Delete Water Log"
                          style={{ padding: "0.35rem 0.6rem", fontSize: "0.78rem", color: "#ef4444", borderColor: "#fecaca" }}
                        >
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
      )}
    </div>
  );
}