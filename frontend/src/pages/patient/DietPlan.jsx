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
  FileText,
  Edit2,
  Trash2,
  Save,
  Plus,
  HeartPulse,
  Droplet,
  ShieldAlert,
  Flame,
  ShieldCheck
} from "lucide-react";
import api from "../../services/api";

export default function DietPlan() {
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Clinician Approval Modal State
  const [approvingPlan, setApprovingPlan] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [approvalSuccessMsg, setApprovalSuccessMsg] = useState("");

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const isClinician = currentUser?.role === "DOCTOR" || currentUser?.role === "DIETITIAN";

  // Log Meal Modal State
  const [activeMealLogModal, setActiveMealLogModal] = useState(null);
  const [logQuantities, setLogQuantities] = useState({});
  const [appetiteRating, setAppetiteRating] = useState("NORMAL");
  const [difficultyRating, setDifficultyRating] = useState(1);
  const [difficultyReason, setDifficultyReason] = useState("");
  const [symptomsReported, setSymptomsReported] = useState("");
  const [logSuccessMsg, setLogSuccessMsg] = useState("");
  const [submittingLog, setSubmittingLog] = useState(false);

  // Edit Meal Plan Modal State
  const [editingMealModal, setEditingMealModal] = useState(null); // meal object being edited
  const [editMealData, setEditMealData] = useState({
    mealName: "",
    scheduledTime: "",
    notes: "",
    items: []
  });
  const [savingMealEdit, setSavingMealEdit] = useState(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

  // Edit Targets Modal State
  const [editingTargetsModal, setEditingTargetsModal] = useState(false);
  const [targetFormData, setTargetFormData] = useState({
    targetCalories: "",
    targetProteinG: "",
    targetCarbsG: "",
    targetFatG: "",
    targetFiberG: "",
    targetWaterMl: "",
  });
  const [savingTargets, setSavingTargets] = useState(false);

  const fetchPlanAndProfile = async () => {
    try {
      setLoading(true);
      const [planRes, profRes] = await Promise.allSettled([
        api.get("/nutrition/diet-plans/my"),
        api.get("/patients/profile")
      ]);

      if (planRes.status === "fulfilled") {
        const plans = planRes.value.data?.data || planRes.value.data;
        const activePlan = Array.isArray(plans) ? (plans.length > 0 ? plans[0] : null) : plans;
        setPlan(activePlan);
        if (activePlan) {
          setTargetFormData({
            targetCalories: activePlan.targetCalories || "",
            targetProteinG: activePlan.targetProteinG || "",
            targetCarbsG: activePlan.targetCarbsG || "",
            targetFatG: activePlan.targetFatG || "",
            targetFiberG: activePlan.targetFiberG || "",
            targetWaterMl: activePlan.targetWaterMl || "",
          });
        }
      }

      if (profRes.status === "fulfilled") {
        setProfile(profRes.value.data?.data || profRes.value.data || null);
      }
    } catch (err) {
      console.error("Failed to load diet plan or profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanAndProfile();
  }, []);

  const handleGenerateAiDietPlan = async () => {
    setGeneratingAi(true);
    try {
      const res = await api.post("/nutrition/diet-plans/generate-ai");
      const generated = res.data?.data || res.data;
      setPlan(generated);
      if (generated) {
        setTargetFormData({
          targetCalories: generated.targetCalories || "",
          targetProteinG: generated.targetProteinG || "",
          targetCarbsG: generated.targetCarbsG || "",
          targetFatG: generated.targetFatG || "",
          targetFiberG: generated.targetFiberG || "",
          targetWaterMl: generated.targetWaterMl || "",
        });
      }
    } catch (err) {
      console.error("Failed to generate AI diet plan", err);
      alert(err.response?.data?.message || "Failed to generate AI meal plan. Please check your profile biometrics.");
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleApprovePlan = async () => {
    if (!plan) return;
    try {
      setApprovingPlan(true);
      const res = await api.post(`/nutrition/diet-plans/${plan.id}/approve`, {
        approved: true,
        notes: approvalNotes.trim() || "Plan reviewed and clinically approved for active implementation."
      });
      const updated = res.data?.data || res.data;
      setPlan(updated);
      setApprovalModalOpen(false);
      setApprovalSuccessMsg("Diet plan successfully approved and activated!");
    } catch (err) {
      console.error("Failed to approve plan", err);
      alert(err.response?.data?.message || "Failed to approve plan.");
    } finally {
      setApprovingPlan(false);
    }
  };

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

  const patientAllergies = profile?.allergies 
    ? (typeof profile.allergies === "string" ? profile.allergies.split(",").map(s => s.trim().toLowerCase()).filter(Boolean) : [])
    : [];

  const checkAllergyWarning = (foodName = "") => {
    if (!patientAllergies || patientAllergies.length === 0) return null;
    const lower = foodName.toLowerCase();
    for (const allergy of patientAllergies) {
      if (lower.includes(allergy) || allergy.includes(lower)) {
        return allergy;
      }
    }
    return null;
  };

  // --- LOG MEAL MODAL LOGIC ---
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
      }, 1200);
    } catch (err) {
      console.error("Failed to log meal", err);
      alert(err.response?.data?.message || "Failed to log meal to food diary.");
    } finally {
      setSubmittingLog(false);
    }
  };

  // --- EDIT MEAL MODAL LOGIC ---
  const openEditMealModal = (meal) => {
    setEditingMealModal(meal);
    setEditMealData({
      mealName: meal.mealName || meal.mealType || "",
      scheduledTime: meal.scheduledTime || "",
      notes: meal.notes || "",
      items: (meal.items || []).map((it) => ({
        id: it.id || Date.now(),
        foodName: it.foodName || "",
        quantityG: it.quantityG || 100,
        servingDescription: it.servingDescription || "1 portion",
        calories: it.calories || 100,
        proteinG: it.proteinG || 5,
        carbsG: it.carbsG || 15,
        fatG: it.fatG || 2,
        notes: it.notes || ""
      }))
    });
    setEditSuccessMsg("");
  };

  const handleAddMealItem = () => {
    setEditMealData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          foodName: "",
          quantityG: 100,
          servingDescription: "1 serving (100g)",
          calories: 120,
          proteinG: 5,
          carbsG: 15,
          fatG: 3,
          notes: ""
        }
      ]
    }));
  };

  const handleUpdateItemField = (index, field, value) => {
    setEditMealData((prev) => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  const handleRemoveMealItem = (index) => {
    setEditMealData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSaveMealEdit = async (e) => {
    e.preventDefault();
    if (!plan || !editingMealModal) return;

    try {
      setSavingMealEdit(true);
      await api.put(`/nutrition/diet-plans/${plan.id}/meals/${editingMealModal.id}`, {
        mealType: editingMealModal.mealType,
        mealName: editMealData.mealName,
        scheduledTime: editMealData.scheduledTime,
        notes: editMealData.notes,
        sortOrder: editingMealModal.sortOrder || 1,
        items: editMealData.items.map((it) => ({
          foodName: it.foodName || "Meal Item",
          quantityG: Number(it.quantityG) || 100,
          servingDescription: it.servingDescription || "1 serving",
          calories: Number(it.calories) || 0,
          proteinG: Number(it.proteinG) || 0,
          carbsG: Number(it.carbsG) || 0,
          fatG: Number(it.fatG) || 0,
          notes: it.notes || ""
        }))
      });

      setEditSuccessMsg("Meal plan updated successfully!");
      await fetchPlanAndProfile();
      setTimeout(() => {
        setEditingMealModal(null);
      }, 1000);
    } catch (err) {
      console.error("Failed to update meal", err);
      alert(err.response?.data?.message || "Failed to save meal edits.");
    } finally {
      setSavingMealEdit(false);
    }
  };

  // --- EDIT OVERALL TARGETS LOGIC ---
  const handleSaveTargets = async (e) => {
    e.preventDefault();
    if (!plan) return;

    try {
      setSavingTargets(true);
      await api.put(`/nutrition/diet-plans/${plan.id}`, {
        title: plan.title,
        description: plan.description,
        targetCalories: Number(targetFormData.targetCalories),
        targetProteinG: Number(targetFormData.targetProteinG),
        targetCarbsG: Number(targetFormData.targetCarbsG),
        targetFatG: Number(targetFormData.targetFatG),
        targetFiberG: Number(targetFormData.targetFiberG),
        targetWaterMl: Number(targetFormData.targetWaterMl),
        notes: plan.notes
      });

      await fetchPlanAndProfile();
      setEditingTargetsModal(false);
    } catch (err) {
      console.error("Failed to save targets", err);
      alert(err.response?.data?.message || "Failed to update daily targets.");
    } finally {
      setSavingTargets(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Personalized Diet Plan & Protocols...</div>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Top Banner with Title, Actions & AI Trigger */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1.25rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.35rem" }}>
            <div style={{ background: "#ecfdf5", padding: "0.5rem", borderRadius: "10px", color: "#059669" }}>
              <Utensils size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>
              Personalized Daily Meal & Diet Plan
            </h2>
          </div>
          <p className="text-muted" style={{ margin: 0, fontSize: "0.9rem" }}>
            {plan?.title || "Clinical Metabolic Protocol"} • Supervised by{" "}
            <strong>{plan?.dietitianName || "NutriSphere Clinical AI"}</strong>
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.45rem", flexWrap: "wrap" }}>
            <span style={{
              background: plan?.status === "APPROVED" ? "#ecfdf5" : (plan?.status === "SUBMITTED" ? "#fef3c7" : "#f1f5f9"),
              color: plan?.status === "APPROVED" ? "#059669" : (plan?.status === "SUBMITTED" ? "#d97706" : "#475569"),
              border: plan?.status === "APPROVED" ? "1px solid #a7f3d0" : (plan?.status === "SUBMITTED" ? "1px solid #fde68a" : "1px solid #cbd5e1"),
              padding: "0.2rem 0.65rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem"
            }}>
              {plan?.status === "APPROVED" ? <CheckCircle size={13} /> : <Clock size={13} />}
              {plan?.status === "APPROVED" ? "Active & Clinician Approved" : (plan?.status === "SUBMITTED" ? "Submitted for Review" : "Draft Plan")}
            </span>

            {plan?.approvedAt && (
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                Approved on {new Date(plan.approvedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={handleGenerateAiDietPlan}
            disabled={generatingAi}
            style={{
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              color: "#ffffff",
              border: "none",
              padding: "0.65rem 1.25rem",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.3)"
            }}
          >
            <Sparkles size={16} />
            {generatingAi ? "Calculating AI Diet Plan..." : (plan ? "✨ Regenerate AI Diet Plan" : "✨ Generate AI Diet Plan")}
          </button>

          {plan && (
            <button
              onClick={() => setEditingTargetsModal(true)}
              className="btn btn-outline"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}
            >
              <Edit2 size={16} /> Edit Daily Targets
            </button>
          )}

          {plan && (isClinician || plan.status !== "APPROVED") && (
            <button
              onClick={() => setApprovalModalOpen(true)}
              className="btn btn-outline"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem", borderColor: "#059669", color: "#059669" }}
            >
              <ShieldCheck size={16} /> Clinician Review & Approval
            </button>
          )}

          <Link to="/patient/daily-report" className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.88rem" }}>
            <FileText size={16} /> Daily Nutrition Report
          </Link>
        </div>
      </div>

      {approvalSuccessMsg && (
        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", padding: "0.75rem 1.25rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle size={18} />
          <span>{approvalSuccessMsg}</span>
        </div>
      )}

      {/* Clinical AI Deficiency & Health Rationale Banner */}
      {plan?.notes && (
        <div style={{
          background: "linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(14, 165, 233, 0.03) 100%)",
          border: "1px solid rgba(2, 132, 199, 0.25)",
          borderRadius: "14px",
          padding: "1.25rem 1.5rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0284c7", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.4rem" }}>
            <HeartPulse size={18} />
            <span>AI Clinical Target Calculation & Deficiency Rationale</span>
          </div>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#334155", lineHeight: 1.55 }}>
            {plan.notes}
          </p>
        </div>
      )}

      {/* Calendar Navigation Bar */}
      <div className="glass-panel" style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "0.85rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button onClick={() => changeDate(-1)} className="btn btn-outline" style={{ padding: "0.4rem 0.6rem" }} title="Previous Day">
            <ChevronLeft size={18} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.3rem 0.8rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <CalendarIcon size={18} color="#0284c7" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "#0f172a",
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
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0284c7" }}>
            {getDayName(selectedDate)}
          </span>
          {isToday && (
            <span style={{ background: "#f0f9ff", color: "#0284c7", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, border: "1px solid rgba(2, 132, 199, 0.2)" }}>
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

      {/* Daily Nutritional Required Targets Cards */}
      {plan && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
          <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Required Energy</div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0284c7", marginTop: "0.25rem" }}>
              {plan.targetCalories ? Math.round(plan.targetCalories) : "--"} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>kcal</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" }}>Target Caloric Intake</div>
          </div>

          <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Protein</div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0284c7", marginTop: "0.25rem" }}>
              {plan.targetProteinG ? Math.round(plan.targetProteinG) : "--"} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" }}>Lean mass & muscle recovery</div>
          </div>

          <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Carbohydrates</div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#d97706", marginTop: "0.25rem" }}>
              {plan.targetCarbsG ? Math.round(plan.targetCarbsG) : "--"} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" }}>Low-GI complex carbohydrates</div>
          </div>

          <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Healthy Fats</div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#e11d48", marginTop: "0.25rem" }}>
              {plan.targetFatG ? Math.round(plan.targetFatG) : "--"} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" }}>Omega-3 & cellular fats</div>
          </div>

          <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Dietary Fiber</div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#059669", marginTop: "0.25rem" }}>
              {plan.targetFiberG ? Math.round(plan.targetFiberG) : "--"} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>g</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" }}>Glycemic blunting & gut health</div>
          </div>

          <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Hydration Target</div>
            <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0284c7", marginTop: "0.25rem" }}>
              {plan.targetWaterMl ? (plan.targetWaterMl / 1000).toFixed(1) : "--"} <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>L</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem" }}>Daily water requirement</div>
          </div>
        </div>
      )}

      {/* Empty State when No Active Plan */}
      {!plan && (
        <div className="glass-panel" style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "3.5rem 2rem",
          textAlign: "center"
        }}>
          <Utensils size={56} style={{ color: "#0284c7", opacity: 0.6, marginBottom: "1rem" }} />
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.45rem", fontWeight: 800, color: "#0f172a" }}>
            No Active Diet Plan Generated Yet
          </h3>
          <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto 1.75rem auto", fontSize: "0.92rem", lineHeight: 1.5 }}>
            Generate your personalized clinical meal schedule instantly. NutriSphere AI computes your BMR, TDEE, health conditions, and blood report deficiencies to design your daily meals.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleGenerateAiDietPlan}
              disabled={generatingAi}
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
                color: "#ffffff",
                border: "none",
                padding: "0.75rem 1.75rem",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <Sparkles size={18} />
              {generatingAi ? "Calculating Clinical Diet Plan..." : "✨ Generate AI Diet Plan Now"}
            </button>
            <Link to="/patient/profile/edit" className="btn btn-outline" style={{ padding: "0.75rem 1.5rem" }}>
              Update Health Profile
            </Link>
          </div>
        </div>
      )}

      {/* Scheduled Meals List */}
      {plan && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
              Prescribed Meals for {getDayName(selectedDate)}
            </h3>
            <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
              {plan.meals?.length || 0} Structured Meal Sessions
            </span>
          </div>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            {(plan.meals || []).map((meal, idx) => {
              const mealCalories = meal.totalCalories || meal.items?.reduce((s, it) => s + (it.calories || 0), 0) || 0;
              const mealProtein = meal.totalProteinG || meal.items?.reduce((s, it) => s + (it.proteinG || 0), 0) || 0;
              const mealCarbs = meal.items?.reduce((s, it) => s + (it.carbsG || 0), 0) || 0;
              const mealFat = meal.items?.reduce((s, it) => s + (it.fatG || 0), 0) || 0;

              return (
                <div key={meal.id || idx} className="glass-panel" style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                }}>
                  {/* Meal Header */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "1rem",
                    borderBottom: "1px solid #f1f5f9",
                    paddingBottom: "1rem",
                    marginBottom: "1.25rem"
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <span style={{
                          background: "#ecfdf5",
                          color: "#059669",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "0.78rem"
                        }}>
                          {meal.mealType}
                        </span>
                        <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                          {meal.mealName || meal.mealType}
                        </h4>
                        {meal.scheduledTime && (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.85rem", color: "#64748b" }}>
                            <Clock size={14} /> {meal.scheduledTime}
                          </span>
                        )}
                      </div>
                      {meal.notes && (
                        <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.85rem", color: "#64748b" }}>
                          {meal.notes}
                        </p>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <div style={{ textAlign: "right", marginRight: "0.5rem" }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0284c7" }}>
                          {Math.round(mealCalories)} kcal
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          P: {Math.round(mealProtein)}g • C: {Math.round(mealCarbs)}g • F: {Math.round(mealFat)}g
                        </div>
                      </div>

                      <button
                        onClick={() => openEditMealModal(meal)}
                        className="btn btn-outline"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 0.85rem", fontSize: "0.82rem" }}
                      >
                        <Edit2 size={15} /> Edit Meal
                      </button>

                      <button
                        onClick={() => openLogModal(meal)}
                        className="btn btn-primary"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", fontSize: "0.82rem" }}
                      >
                        <PlusCircle size={16} /> Log Meal
                      </button>
                    </div>
                  </div>

                  {/* Meal Items and Portion Breakdown */}
                  <div>
                    <h5 style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>
                      Prescribed Clinical Foods & Portions
                    </h5>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem" }}>
                      {(meal.items || []).map((item, itemIdx) => {
                        const allergyFound = checkAllergyWarning(item.foodName);
                        return (
                          <div
                            key={item.id || itemIdx}
                            style={{
                              background: allergyFound ? "#fef2f2" : "#f8fafc",
                              border: allergyFound ? "1px solid #fecaca" : "1px solid #f1f5f9",
                              borderRadius: "10px",
                              padding: "0.9rem 1rem"
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>
                                {item.foodName}
                              </span>
                              <span style={{ color: "#0284c7", fontWeight: 700, fontSize: "0.85rem" }}>
                                {item.servingDescription || (item.quantityG ? `${item.quantityG}g` : "1 portion")}
                              </span>
                            </div>

                            {allergyFound && (
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#dc2626", fontSize: "0.78rem", fontWeight: 600, margin: "0.3rem 0" }}>
                                <AlertTriangle size={14} /> Potential Allergy Alert: Contains {allergyFound}
                              </div>
                            )}

                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#64748b", marginTop: "0.4rem" }}>
                              <span>{Math.round(item.calories || 0)} kcal</span>
                              <span>P: {Math.round(item.proteinG || 0)}g</span>
                              <span>C: {Math.round(item.carbsG || 0)}g</span>
                              <span>F: {Math.round(item.fatG || 0)}g</span>
                            </div>

                            {item.notes && (
                              <div style={{ fontSize: "0.75rem", color: "#0284c7", marginTop: "0.4rem", background: "#f0f9ff", padding: "0.25rem 0.5rem", borderRadius: "6px" }}>
                                {item.notes}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* EDIT OVERALL TARGETS MODAL */}
      {editingTargetsModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "18px",
            maxWidth: "540px",
            width: "100%",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                Edit Daily Nutritional Targets
              </h3>
              <button
                type="button"
                onClick={() => setEditingTargetsModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTargets} style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Target Calories (kcal) *</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    value={targetFormData.targetCalories}
                    onChange={(e) => setTargetFormData({ ...targetFormData, targetCalories: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="form-label">Target Protein (g) *</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    value={targetFormData.targetProteinG}
                    onChange={(e) => setTargetFormData({ ...targetFormData, targetProteinG: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Target Carbohydrates (g)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={targetFormData.targetCarbsG}
                    onChange={(e) => setTargetFormData({ ...targetFormData, targetCarbsG: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="form-label">Target Healthy Fats (g)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={targetFormData.targetFatG}
                    onChange={(e) => setTargetFormData({ ...targetFormData, targetFatG: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Target Dietary Fiber (g)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={targetFormData.targetFiberG}
                    onChange={(e) => setTargetFormData({ ...targetFormData, targetFiberG: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="form-label">Target Daily Water (ml)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={targetFormData.targetWaterMl}
                    onChange={(e) => setTargetFormData({ ...targetFormData, targetWaterMl: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingTargetsModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingTargets}
                >
                  {savingTargets ? "Saving..." : "Save Targets"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEAL ITEMS MODAL */}
      {editingMealModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "18px",
            maxWidth: "750px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
            overflow: "hidden"
          }}>
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                  Edit {editingMealModal.mealName || editingMealModal.mealType}
                </h3>
                <p className="text-muted" style={{ margin: 0, fontSize: "0.82rem" }}>
                  Add, modify, or remove foods and portions in this meal plan session.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingMealModal(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMealEdit} style={{ padding: "1.5rem", display: "grid", gap: "1.25rem" }}>
              {editSuccessMsg && (
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", padding: "0.75rem", borderRadius: "8px", fontSize: "0.85rem" }}>
                  {editSuccessMsg}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Meal Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editMealData.mealName}
                    onChange={(e) => setEditMealData({ ...editMealData, mealName: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="form-label">Scheduled Time</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. 08:30 AM"
                    value={editMealData.scheduledTime}
                    onChange={(e) => setEditMealData({ ...editMealData, scheduledTime: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Meal Notes & Dietary Guidelines</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Low glycemic load, pairs iron with citrus"
                  value={editMealData.notes}
                  onChange={(e) => setEditMealData({ ...editMealData, notes: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Items List */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                    Meal Food Items ({editMealData.items.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMealItem}
                    style={{
                      background: "#f0f9ff",
                      color: "#0284c7",
                      border: "1px solid rgba(2, 132, 199, 0.3)",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem"
                    }}
                  >
                    <Plus size={14} /> Add Food Item
                  </button>
                </div>

                <div style={{ display: "grid", gap: "0.75rem", maxHeight: "280px", overflowY: "auto", paddingRight: "0.25rem" }}>
                  {editMealData.items.map((item, index) => (
                    <div key={item.id || index} style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                      padding: "0.85rem",
                      display: "grid",
                      gap: "0.5rem"
                    }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Food Name (e.g. Steel-Cut Oats)"
                          value={item.foodName}
                          onChange={(e) => handleUpdateItemField(index, "foodName", e.target.value)}
                          style={{ flex: 2 }}
                        />
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Portion (e.g. 1 bowl)"
                          value={item.servingDescription}
                          onChange={(e) => handleUpdateItemField(index, "servingDescription", e.target.value)}
                          style={{ flex: 1.5 }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMealItem(index)}
                          style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#dc2626",
                            padding: "0.45rem",
                            borderRadius: "8px",
                            cursor: "pointer"
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block" }}>Calories</span>
                          <input
                            type="number"
                            className="input-field"
                            value={item.calories}
                            onChange={(e) => handleUpdateItemField(index, "calories", e.target.value)}
                            style={{ width: "100%", padding: "0.35rem 0.5rem", fontSize: "0.82rem" }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block" }}>Protein (g)</span>
                          <input
                            type="number"
                            step="0.1"
                            className="input-field"
                            value={item.proteinG}
                            onChange={(e) => handleUpdateItemField(index, "proteinG", e.target.value)}
                            style={{ width: "100%", padding: "0.35rem 0.5rem", fontSize: "0.82rem" }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block" }}>Carbs (g)</span>
                          <input
                            type="number"
                            step="0.1"
                            className="input-field"
                            value={item.carbsG}
                            onChange={(e) => handleUpdateItemField(index, "carbsG", e.target.value)}
                            style={{ width: "100%", padding: "0.35rem 0.5rem", fontSize: "0.82rem" }}
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block" }}>Fat (g)</span>
                          <input
                            type="number"
                            step="0.1"
                            className="input-field"
                            value={item.fatG}
                            onChange={(e) => handleUpdateItemField(index, "fatG", e.target.value)}
                            style={{ width: "100%", padding: "0.35rem 0.5rem", fontSize: "0.82rem" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingMealModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingMealEdit}
                >
                  {savingMealEdit ? "Saving..." : "Save Meal Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG MEAL MODAL */}
      {activeMealLogModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "18px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "1.75rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                  Log {activeMealLogModal.mealName}
                </h3>
                <p className="text-muted" style={{ margin: 0, fontSize: "0.82rem" }}>
                  Record actual consumption for {selectedDate}.
                </p>
              </div>
              <button onClick={() => setActiveMealLogModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                ✕
              </button>
            </div>

            {logSuccessMsg ? (
              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", padding: "1.25rem", borderRadius: "10px", textAlign: "center", fontWeight: 700 }}>
                {logSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleLogMeal} style={{ display: "grid", gap: "1rem" }}>
                <div>
                  <label className="form-label">Portions Consumed</label>
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    {(activeMealLogModal.items || []).map((it) => (
                      <div key={it.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                        <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>{it.foodName}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <input
                            type="number"
                            className="input-field"
                            style={{ width: "75px", padding: "0.25rem 0.5rem", fontSize: "0.85rem" }}
                            value={logQuantities[it.id] || it.quantityG || 100}
                            onChange={(e) => setLogQuantities({ ...logQuantities, [it.id]: e.target.value })}
                          />
                          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="form-label">Appetite Level</label>
                    <select
                      className="input-field"
                      value={appetiteRating}
                      onChange={(e) => setAppetiteRating(e.target.value)}
                      style={{ width: "100%" }}
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal / Balanced</option>
                      <option value="HIGH">High / Ravenous</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Difficulty Following</label>
                    <select
                      className="input-field"
                      value={difficultyRating}
                      onChange={(e) => setDifficultyRating(Number(e.target.value))}
                      style={{ width: "100%" }}
                    >
                      <option value={1}>1 - Very Easy</option>
                      <option value={2}>2 - Minor Challenge</option>
                      <option value={3}>3 - Moderate Difficulty</option>
                      <option value={4}>4 - Significant Challenge</option>
                      <option value={5}>5 - Could Not Complete</option>
                    </select>
                  </div>
                </div>

                {difficultyRating > 1 && (
                  <div>
                    <label className="form-label">Difficulty Reason</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Time constraints, hunger, lack of ingredients"
                      value={difficultyReason}
                      onChange={(e) => setDifficultyReason(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>
                )}

                <div>
                  <label className="form-label">Symptoms / Notes (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Bloating, fatigue, or felt energized"
                    value={symptomsReported}
                    onChange={(e) => setSymptomsReported(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button type="button" className="btn btn-outline" onClick={() => setActiveMealLogModal(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submittingLog}>
                    {submittingLog ? "Logging..." : "Confirm & Log to Diary"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Clinician Approval Modal */}
      {approvalModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "2rem",
            maxWidth: "520px",
            width: "100%",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#059669", marginBottom: "0.75rem" }}>
              <ShieldCheck size={24} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
                Review & Approve Diet Plan
              </h3>
            </div>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.88rem", color: "#64748b", lineHeight: 1.5 }}>
              Review the daily nutritional requirements and scheduled meals. Approving this plan validates it as the active clinical guideline for the patient.
            </p>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: "0.4rem" }}>
                Clinician Supervisory Notes & Instructions:
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="e.g. Plan reviewed and approved. Caloric deficit calibrated for safe metabolic rate."
                className="form-control"
                rows={3}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setApprovalModalOpen(false)}
                className="btn btn-outline"
                disabled={approvingPlan}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprovePlan}
                disabled={approvingPlan}
                className="btn btn-primary"
                style={{ background: "#059669", borderColor: "#059669", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Check size={16} />
                {approvingPlan ? "Approving..." : "Approve & Activate Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
