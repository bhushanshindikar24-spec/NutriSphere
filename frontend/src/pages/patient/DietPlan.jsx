import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  Utensils, 
  Clock, 
  Sparkles, 
  PlusCircle, 
  Check, 
  FileText
} from "lucide-react";
import api from "../../services/api";

export default function DietPlan() {
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [activeMealLogModal, setActiveMealLogModal] = useState(null);
  const [logQuantities, setLogQuantities] = useState({});
  const [appetiteRating, setAppetiteRating] = useState("NORMAL");
  const [difficultyRating, setDifficultyRating] = useState(1);
  const [difficultyReason, setDifficultyReason] = useState("");
  const [symptomsReported, setSymptomsReported] = useState("");
  const [logSuccessMsg, setLogSuccessMsg] = useState("");
  const [submittingLog, setSubmittingLog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch active diet plan
        const planRes = await api.get("/nutrition/diet-plans/my");
        const plans = planRes.data.data;
        const activePlan = Array.isArray(plans) ? (plans.length > 0 ? plans[0] : null) : plans;
        setPlan(activePlan);

        // Fetch patient profile for allergy cross-referencing
        const profRes = await api.get("/patient/profile/me");
        setProfile(profRes.data?.data || profRes.data || null);
      } catch (err) {
        console.error("Failed to load diet plan or profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const changeDate = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  const getDayName = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  };

  const patientAllergies = profile?.allergies || [];

  const checkAllergyWarning = (foodName = "") => {
    if (!patientAllergies || patientAllergies.length === 0) return null;
    const lower = foodName.toLowerCase();
    for (const allergy of patientAllergies) {
      if (lower.includes(allergy.toLowerCase()) || allergy.toLowerCase().includes(lower)) {
        return allergy;
      }
    }
    return null;
  };

  const openLogModal = (meal) => {
    setActiveMealLogModal(meal);
    const initialQty = {};
    if (meal.items) {
      meal.items.forEach((it) => {
        initialQty[it.id] = it.quantityG || 100;
      });
    }
    setLogQuantities(initialQty);
    setAppetiteRating("NORMAL");
    setDifficultyRating(1);
    setDifficultyReason("");
    setSymptomsReported("");
    setLogSuccessMsg("");
  };

  const handleLogMeal = async (e) => {
    e.preventDefault();
    if (!activeMealLogModal) return;

    try {
      setSubmittingLog(true);
      const itemsToLog = (activeMealLogModal.items || []).map((it) => ({
        foodItemId: it.foodItemId || null,
        foodName: it.foodName,
        quantityG: Number(logQuantities[it.id] || it.quantityG || 100),
        servingDescription: it.servingDescription || `${logQuantities[it.id] || it.quantityG || 100}g`,
        calories: Number(((it.calories || 100) * (Number(logQuantities[it.id] || it.quantityG || 100) / (it.quantityG || 100))).toFixed(1)),
        proteinG: Number(((it.proteinG || 5) * (Number(logQuantities[it.id] || it.quantityG || 100) / (it.quantityG || 100))).toFixed(1)),
        carbsG: Number(((it.carbsG || 15) * (Number(logQuantities[it.id] || it.quantityG || 100) / (it.quantityG || 100))).toFixed(1)),
        fatG: Number(((it.fatG || 2) * (Number(logQuantities[it.id] || it.quantityG || 100) / (it.quantityG || 100))).toFixed(1)),
      }));

      await api.post("/food-logs/meal-builder", {
        mealType: activeMealLogModal.mealType || "SNACK",
        mealName: activeMealLogModal.mealName || "Scheduled Meal",
        logDate: selectedDate,
        notes: `Appetite: ${appetiteRating}. Notes: ${activeMealLogModal.notes || ""}`,
        difficultyRating: Number(difficultyRating),
        difficultyReason: difficultyReason.trim() || null,
        symptomsReported: symptomsReported.trim() || null,
        ingredients: itemsToLog,
      });

      setLogSuccessMsg(`Successfully logged ${activeMealLogModal.mealName} for ${selectedDate}!`);
      setTimeout(() => {
        setActiveMealLogModal(null);
      }, 1400);
    } catch (err) {
      console.error("Failed to log meal", err);
      alert(err.response?.data?.message || "Failed to log meal to food diary.");
    } finally {
      setSubmittingLog(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Personalized Diet Plan & Protocols...</div>;

  if (!plan) {
    return (
      <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", maxWidth: "800px", margin: "2rem auto" }}>
        <Utensils size={54} style={{ color: "var(--primary)", opacity: 0.5, marginBottom: "1rem" }} />
        <h2 style={{ marginBottom: "0.5rem" }}>No Active Personalized Diet Plan</h2>
        <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
          Your clinical dietitian has not assigned an active medical diet plan yet. Once your assessment or consultation is complete, your personalized daily meal schedule will appear here.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link to="/patient/profile/edit" className="btn btn-primary">
            Update Assessment & Goals
          </Link>
          <Link to="/patient/consultations" className="btn btn-outline">
            Schedule Consultation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Top Banner with Title & Status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "0.5rem", borderRadius: "10px", color: "var(--primary)" }}>
              <Utensils size={24} />
            </div>
            <h2 style={{ margin: 0 }}>Daily Personalized Diet Plan</h2>
          </div>
          <p className="text-muted" style={{ margin: 0 }}>
            {plan.title || "Clinical Metabolic Protocol"} • Approved by{" "}
            <strong>{plan.dietitianName || "Clinical Dietitian"}</strong>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link to="/patient/daily-report" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={16} /> View End-of-Day Report
          </Link>
          <span style={{
            background: plan.status === "ACTIVE" ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
            color: plan.status === "ACTIVE" ? "#10b981" : "#f59e0b",
            padding: "0.5rem 1rem",
            borderRadius: "9999px",
            fontWeight: 700,
            fontSize: "0.85rem",
            border: `1px solid ${plan.status === "ACTIVE" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`
          }}>
            ● {plan.status}
          </span>
        </div>
      </div>

      {/* Calendar Navigation Bar */}
      <div className="glass-panel" style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={() => changeDate(-1)} className="btn btn-outline" style={{ padding: "0.4rem 0.6rem" }} title="Previous Day">
            <ChevronLeft size={18} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.3rem 0.8rem", background: "rgba(255, 255, 255, 0.05)", borderRadius: "8px" }}>
            <CalendarIcon size={18} style={{ color: "var(--primary)" }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "inherit",
                fontSize: "0.95rem",
                fontWeight: 600,
                outline: "none",
                cursor: "pointer"
              }}
            />
          </div>
          <button onClick={() => changeDate(1)} className="btn btn-outline" style={{ padding: "0.4rem 0.6rem" }} title="Next Day">
            <ChevronRight size={18} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary)" }}>
            {getDayName(selectedDate)}
          </span>
          {isToday && (
            <span style={{ background: "rgba(2, 132, 199, 0.15)", color: "#0284c7", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>
              Today
            </span>
          )}
          {!isToday && (
            <button onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])} className="btn btn-outline" style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}>
              Back to Today
            </button>
          )}
        </div>
      </div>

      {/* Daily Nutritional Targets Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
        <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Target Energy</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)", marginTop: "0.25rem" }}>
            {plan.targetCalories || 2000} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>kcal</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Daily metabolic budget</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Protein</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#38bdf8", marginTop: "0.25rem" }}>
            {plan.targetProteinG || 75} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Lean mass & recovery</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Carbohydrates</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fbbf24", marginTop: "0.25rem" }}>
            {plan.targetCarbsG || 240} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Sustained glycogen</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Healthy Fats</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f43f5e", marginTop: "0.25rem" }}>
            {plan.targetFatG || 60} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Hormonal & cellular balance</div>
        </div>

        <div className="glass-panel" style={{ padding: "1.25rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Hydration Target</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#06b6d4", marginTop: "0.25rem" }}>
            {plan.targetWaterMl || 2500} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>ml</span>
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>Electrolytic fluid goal</div>
        </div>
      </div>

      {/* Meals Schedule */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem" }}>
            Scheduled Meals for {getDayName(selectedDate)}
          </h3>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            {plan.meals?.length || 0} Prescribed Meal Sessions
          </span>
        </div>

        {(!plan.meals || plan.meals.length === 0) ? (
          <div className="glass-panel" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
            <p>No meals registered under this diet plan schedule yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {plan.meals.map((meal, idx) => {
              // Calculate meal totals
              const mealCalories = meal.totalCalories || meal.items?.reduce((s, it) => s + (it.calories || 0), 0) || 0;
              const mealProtein = meal.totalProteinG || meal.items?.reduce((s, it) => s + (it.proteinG || 0), 0) || 0;
              const mealCarbs = meal.items?.reduce((s, it) => s + (it.carbsG || 0), 0) || 0;
              const mealFat = meal.items?.reduce((s, it) => s + (it.fatG || 0), 0) || 0;

              return (
                <div key={meal.id || idx} className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <span style={{
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "var(--primary)",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          letterSpacing: "0.03em"
                        }}>
                          {meal.mealType}
                        </span>
                        <h4 style={{ margin: 0, fontSize: "1.2rem" }}>{meal.mealName || meal.mealType}</h4>
                        {meal.scheduledTime && (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            <Clock size={14} /> {meal.scheduledTime}
                          </span>
                        )}
                      </div>
                      {meal.notes && (
                        <p style={{ margin: "0.4rem 0 0 0", fontSize: "0.88rem", color: "var(--text-muted)" }}>
                          {meal.notes}
                        </p>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--primary)" }}>
                          {Math.round(mealCalories)} kcal
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          P: {Math.round(mealProtein)}g • C: {Math.round(mealCarbs)}g • F: {Math.round(mealFat)}g
                        </div>
                      </div>
                      <button
                        onClick={() => openLogModal(meal)}
                        className="btn btn-primary"
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                      >
                        <PlusCircle size={16} /> Log This Meal
                      </button>
                    </div>
                  </div>

                  {/* Meal Items and Portion Breakdown */}
                  <div>
                    <h5 style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Prescribed Ingredients & Portions
                    </h5>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem" }}>
                      {(meal.items || []).map((item, itemIdx) => {
                        const allergyFound = checkAllergyWarning(item.foodName);
                        return (
                          <div
                            key={item.id || itemIdx}
                            style={{
                              background: allergyFound ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.03)",
                              border: allergyFound ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(255, 255, 255, 0.06)",
                              borderRadius: "8px",
                              padding: "0.9rem 1rem"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.3rem" }}>
                              <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{item.foodName}</span>
                              <span style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.85rem" }}>
                                {item.quantityG ? `${item.quantityG}g` : item.servingDescription || "1 portion"}
                              </span>
                            </div>

                            {/* Allergy Warning Alert */}
                            {allergyFound && (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#ef4444", fontSize: "0.78rem", fontWeight: 600, margin: "0.3rem 0" }}>
                                <AlertTriangle size={14} /> Potential Allergy Alert: Contains {allergyFound}
                              </div>
                            )}

                            {/* Macronutrient breakdown */}
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.4rem" }}>
                              <span>{Math.round(item.calories || 0)} kcal</span>
                              <span>P: {Math.round(item.proteinG || 0)}g</span>
                              <span>C: {Math.round(item.carbsG || 0)}g</span>
                              <span>F: {Math.round(item.fatG || 0)}g</span>
                            </div>

                            {/* Food Alternatives Suggestion */}
                            <div style={{ marginTop: "0.6rem", borderTop: "1px dashed rgba(255, 255, 255, 0.08)", paddingTop: "0.4rem", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.75rem" }}>
                              <span style={{ color: "var(--accent)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                <Sparkles size={12} /> Alternatives available
                              </span>
                              <Link to="/patient/food-alternatives" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                                View Substitutes →
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Meal Log & Difficulty Modal */}
      {activeMealLogModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "1rem"
        }}>
          <div className="glass-panel" style={{
            maxWidth: "650px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "2rem",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(16, 185, 129, 0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: 0 }}>Log {activeMealLogModal.mealName}</h3>
                <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
                  Record actual consumption, portion adjustments, appetite, and difficulties.
                </p>
              </div>
              <button onClick={() => setActiveMealLogModal(null)} className="btn btn-outline" style={{ padding: "0.3rem 0.6rem" }}>
                ✕
              </button>
            </div>

            {logSuccessMsg ? (
              <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "var(--primary)", padding: "1.25rem", borderRadius: "10px", textAlign: "center", fontWeight: 600 }}>
                <CheckCircle size={24} style={{ display: "block", margin: "0 auto 0.5rem auto" }} />
                {logSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleLogMeal} style={{ display: "grid", gap: "1.25rem" }}>
                {/* Date selection for logging */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>Log Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: "200px" }}
                  />
                </div>

                {/* Items & Portions */}
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                    Actual Consumed Portions (grams):
                  </label>
                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    {(activeMealLogModal.items || []).map((it) => (
                      <div key={it.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", background: "rgba(255, 255, 255, 0.03)", padding: "0.6rem 0.8rem", borderRadius: "6px" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{it.foodName}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={logQuantities[it.id] ?? (it.quantityG || 100)}
                            onChange={(e) => setLogQuantities({ ...logQuantities, [it.id]: e.target.value })}
                            className="form-control"
                            style={{ width: "90px", textAlign: "right" }}
                          />
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Appetite */}
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                    Appetite During Meal:
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    {["POOR", "NORMAL", "HIGH", "EXCESSIVE"].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setAppetiteRating(app)}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          borderRadius: "6px",
                          border: appetiteRating === app ? "1px solid var(--primary)" : "1px solid rgba(255, 255, 255, 0.1)",
                          background: appetiteRating === app ? "rgba(16, 185, 129, 0.15)" : "transparent",
                          color: appetiteRating === app ? "var(--primary)" : "inherit",
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Rating & Barriers */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      Difficulty Following This Meal Protocol (1 = Easy, 5 = Severe):
                    </label>
                    <span style={{ fontWeight: 700, color: difficultyRating > 2 ? "#ef4444" : "var(--primary)" }}>
                      Level {difficultyRating}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={difficultyRating}
                    onChange={(e) => setDifficultyRating(Number(e.target.value))}
                    style={{ width: "100%", accentColor: difficultyRating > 2 ? "#ef4444" : "var(--primary)" }}
                  />
                </div>

                {difficultyRating > 1 && (
                  <div>
                    <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                      Reason for Difficulty (e.g., taste, satiety, preparation time, cravings):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Too high in fiber, tasted bland, or lacked cooking time"
                      value={difficultyReason}
                      onChange={(e) => setDifficultyReason(e.target.value)}
                      className="form-control"
                    />
                  </div>
                )}

                {/* Symptoms or Physical Reactions */}
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                    Symptoms or Digestive Difficulties (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mild bloating, reflux, fatigue, nausea"
                    value={symptomsReported}
                    onChange={(e) => setSymptomsReported(e.target.value)}
                    className="form-control"
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setActiveMealLogModal(null)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingLog} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Check size={16} />
                    {submittingLog ? "Logging..." : "Confirm & Save to Food Diary"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
