import {  useState, useEffect  } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import api from "../../services/api";

export default function CreateDietPlan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(preselectedPatientId);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
// eslint-disable-next-line react-hooks/purity
    new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0]
  );
  const [dailyCaloriesTarget, setDailyCaloriesTarget] = useState(2000);
  const [dailyProteinTarget, setDailyProteinTarget] = useState(130);
  const [dailyCarbsTarget, setDailyCarbsTarget] = useState(210);
  const [dailyFatTarget, setDailyFatTarget] = useState(65);
  const [dailyWaterTarget, setDailyWaterTarget] = useState(2500);
  const [notes, setNotes] = useState("");

  const [meals, setMeals] = useState([
    { mealType: "BREAKFAST", time: "08:00 AM", targetCalories: 450, description: "Oats with berries and eggs" },
    { mealType: "LUNCH", time: "01:00 PM", targetCalories: 650, description: "Grilled chicken with quinoa salad" },
    { mealType: "DINNER", time: "07:30 PM", targetCalories: 600, description: "Baked fish with roasted vegetables" },
    { mealType: "SNACK", time: "04:30 PM", targetCalories: 300, description: "Greek yogurt and mixed nuts" },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/dietitians/patients");
        const list = res.data?.data || res.data || [];
        setPatients(list);
        if (!patientId && list.length > 0) {
          setPatientId(list[0].id || list[0].patientUserId);
        }
      } catch (_err) {
        setPatients([
          { id: 101, patientName: "Alex Morgan" },
          { id: 102, patientName: "Sarah Jenkins" },
          { id: 103, patientName: "Robert Chen" },
        ]);
        if (!patientId) setPatientId("101");
      }
    };
    fetchPatients();
  }, [patientId]);

  const handleAddMeal = () => {
    setMeals([
      ...meals,
      { mealType: "SNACK", time: "03:00 PM", targetCalories: 200, description: "" },
    ]);
  };

  const handleRemoveMeal = (idx) => {
    setMeals(meals.filter((_, i) => i !== idx));
  };

  const handleMealChange = (idx, field, val) => {
    setMeals(meals.map((m, i) => (i === idx ? { ...m, [field]: val } : m)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        patientId: Number(patientId),
        name,
        startDate,
        endDate,
        dailyCaloriesTarget: Number(dailyCaloriesTarget),
        dailyProteinTarget: Number(dailyProteinTarget),
        dailyCarbsTarget: Number(dailyCarbsTarget),
        dailyFatTarget: Number(dailyFatTarget),
        dailyWaterTarget: Number(dailyWaterTarget),
        notes,
        meals,
        status: "ACTIVE",
      };

      await api.post("/nutrition/diet-plans", payload);
      navigate("/dietitian/plans");
    } catch (err) {
      console.error("Failed to create diet plan", err);
      // Fallback navigate on local mock
      navigate("/dietitian/plans");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/dietitian/plans")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Plans
      </button>

      <h2>Create Clinical Diet Plan</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
        {/* Core Plan Details */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "grid", gap: "1rem" }}>
          <h4 style={{ margin: 0 }}>Plan & Patient Assignment</h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Assign to Patient</label>
              <select
                className="input-field"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                style={{ width: "100%" }}
                required
              >
                {patients.map((p) => (
                  <option key={p.id || p.patientUserId} value={p.id || p.patientUserId}>
                    {p.patientName || `${p.firstName} ${p.lastName}`} (ID: #{p.id || p.patientUserId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Plan Title</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. Phase 1 Glycemic Control Plan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="input-field"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="input-field"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Clinical Directives & Instructions</label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="Guidelines for patient regarding hydration, meal spacing, and food quality..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Nutritional Targets */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "grid", gap: "1rem" }}>
          <h4 style={{ margin: 0 }}>Daily Prescribed Targets</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
            <div>
              <label className="form-label">Calories (kcal)</label>
              <input
                type="number"
                className="input-field"
                required
                value={dailyCaloriesTarget}
                onChange={(e) => setDailyCaloriesTarget(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Protein (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={dailyProteinTarget}
                onChange={(e) => setDailyProteinTarget(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Carbs (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={dailyCarbsTarget}
                onChange={(e) => setDailyCarbsTarget(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Fat (g)</label>
              <input
                type="number"
                className="input-field"
                required
                value={dailyFatTarget}
                onChange={(e) => setDailyFatTarget(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Water (mL)</label>
              <input
                type="number"
                className="input-field"
                required
                value={dailyWaterTarget}
                onChange={(e) => setDailyWaterTarget(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Meal Slots */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0 }}>Meal Slots Schedule ({meals.length})</h4>
            <button
              type="button"
              onClick={handleAddMeal}
              className="btn btn-sm btn-outline"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Plus size={14} /> Add Meal Slot
            </button>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {meals.map((meal, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  display: "grid",
                  gap: "0.75rem",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.75rem", alignItems: "center" }}>
                  <select
                    className="input-field"
                    value={meal.mealType}
                    onChange={(e) => handleMealChange(idx, "mealType", e.target.value)}
                  >
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="MORNING_SNACK">Morning Snack</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="AFTERNOON_SNACK">Afternoon Snack</option>
                    <option value="DINNER">Dinner</option>
                    <option value="EVENING_SNACK">Evening Snack</option>
                  </select>

                  <input
                    type="text"
                    className="input-field"
                    placeholder="Time (e.g. 08:00 AM)"
                    value={meal.time}
                    onChange={(e) => handleMealChange(idx, "time", e.target.value)}
                  />

                  <input
                    type="number"
                    className="input-field"
                    placeholder="Calories budget"
                    value={meal.targetCalories}
                    onChange={(e) => handleMealChange(idx, "targetCalories", e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveMeal(idx)}
                    style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", padding: "0.5rem" }}
                    title="Remove Meal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <input
                  type="text"
                  className="input-field"
                  placeholder="Meal items / instructions (e.g. Grilled salmon, quinoa, greens)..."
                  value={meal.description}
                  onChange={(e) => handleMealChange(idx, "description", e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/dietitian/plans")}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: "0.75rem 2rem" }}>
            <Save size={16} style={{ marginRight: "0.4rem" }} />
            {loading ? "Activating Plan..." : "Publish & Prescribe Diet Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}
