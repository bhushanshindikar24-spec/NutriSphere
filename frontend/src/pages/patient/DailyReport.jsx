import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ClipboardList, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Droplet, 
  Flame, 
  ArrowLeft, 
  Printer, 
  PlusCircle,
  Utensils,
  Sparkles,
  TrendingUp,
  Activity
} from "lucide-react";
import api from "../../services/api";

export default function DailyReport() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDailyReport = async (dateStr) => {
    setLoading(true);
    try {
      const res = await api.get(`/food-logs/daily-report?date=${dateStr}`);
      const data = res.data?.data || res.data;
      setReport(data || null);
    } catch (_e) {
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReport(selectedDate);
  }, [selectedDate]);

  if (loading) return <div className="loading-screen">Compiling Automated Daily Nutrition Report...</div>;

  const plannedCals = report?.plannedCalories || 0;
  const actualCals = report?.actualCalories || 0;
  const calGap = report?.calorieGap !== undefined ? report.calorieGap : (actualCals - plannedCals);
  const adherence = report?.adherencePercentage !== undefined ? report.adherencePercentage : 0;
  const loggedItems = Array.isArray(report?.loggedItems) ? report.loggedItems : [];
  const difficulties = Array.isArray(report?.difficultyReports) ? report.difficultyReports : [];
  const patientNotes = Array.isArray(report?.patientNotes) ? report.patientNotes : [];

  const getDayName = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <button
            onClick={() => navigate("/patient/diet-plan")}
            className="btn btn-outline"
            style={{ marginBottom: "0.5rem", display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.75rem", fontSize: "0.82rem" }}
          >
            <ArrowLeft size={14} /> Back to Meal Plan
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ background: "rgba(2, 132, 199, 0.12)", padding: "0.5rem", borderRadius: "10px", color: "#0284c7" }}>
              <ClipboardList size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>
              Daily Meal & Nutrition Intake Report
            </h2>
          </div>
          <p className="text-muted" style={{ margin: "0.35rem 0 0 0", fontSize: "0.9rem" }}>
            Comprehensive comparison of daily consumption vs required clinical targets, macronutrient gaps, and adherence tracking.
          </p>
        </div>

        {/* Date Selector & Print */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "#ffffff",
            padding: "0.4rem 0.85rem",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <Calendar size={16} color="#0284c7" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "#0f172a",
                outline: "none",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: "pointer"
              }}
            />
          </div>

          <button onClick={() => window.print()} className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* Clinical Care Team & Protocol Banner */}
      <div style={{
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(2, 132, 199, 0.05) 100%)",
        border: "1px solid rgba(16, 185, 129, 0.25)",
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <CheckCircle2 size={26} color="#059669" />
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "#0f172a" }}>
              Daily Dietary Telemetry for {getDayName(selectedDate)}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.15rem" }}>
              Supervised by: <strong>{report?.assignedDoctorName || "Assigned Medical Doctor"}</strong> • <strong>{report?.assignedDietitianName || "Clinical Dietitian / NutriSphere AI"}</strong>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Protocol Adherence Score</div>
          <div style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: adherence >= 80 ? "#059669" : (adherence >= 60 ? "#d97706" : "#dc2626")
          }}>
            {adherence}%
          </div>
          <span style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            padding: "0.15rem 0.5rem",
            borderRadius: "6px",
            background: adherence >= 80 ? "#ecfdf5" : "#fffbeb",
            color: adherence >= 80 ? "#059669" : "#d97706"
          }}>
            {report?.adherenceStatus || (adherence >= 80 ? "OPTIMAL" : "ON_TRACK")}
          </span>
        </div>
      </div>

      {/* Required Target vs Actual Intake Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {/* Calories Card */}
        <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Energy (Calories)</span>
            <Flame size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0f172a" }}>
            {Math.round(actualCals)} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>/ {Math.round(plannedCals)} kcal</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: calGap > 50 ? "#e11d48" : (calGap < -50 ? "#d97706" : "#059669"), fontWeight: 600, marginTop: "0.35rem" }}>
            {calGap > 0 ? `+${Math.round(calGap)} kcal surplus` : `${Math.round(calGap)} kcal deficit`}
          </div>
        </div>

        {/* Protein Card */}
        <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Protein</span>
            <Activity size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0f172a" }}>
            {Math.round(report?.actualProteinG || 0)} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>/ {Math.round(report?.plannedProteinG || 0)} g</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.35rem" }}>
            Gap: <strong>{(report?.proteinGap || (report?.actualProteinG - report?.plannedProteinG) || 0).toFixed(1)}g</strong>
          </div>
        </div>

        {/* Carbohydrates Card */}
        <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Carbohydrates</span>
            <TrendingUp size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0f172a" }}>
            {Math.round(report?.actualCarbsG || 0)} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>/ {Math.round(report?.plannedCarbsG || 0)} g</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.35rem" }}>
            Gap: <strong>{(report?.carbsGap || (report?.actualCarbsG - report?.plannedCarbsG) || 0).toFixed(1)}g</strong>
          </div>
        </div>

        {/* Fats Card */}
        <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Healthy Fats</span>
            <Activity size={18} color="#e11d48" />
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0f172a" }}>
            {Math.round(report?.actualFatG || 0)} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>/ {Math.round(report?.plannedFatG || 0)} g</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.35rem" }}>
            Gap: <strong>{(report?.fatGap || (report?.actualFatG - report?.plannedFatG) || 0).toFixed(1)}g</strong>
          </div>
        </div>

        {/* Hydration Card */}
        <div className="glass-panel" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Hydration</span>
            <Droplet size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: "1.65rem", fontWeight: 800, color: "#0284c7" }}>
            {Math.round(report?.actualWaterMl || 0)} <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>/ {Math.round(report?.plannedWaterMl || 0)} ml</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.35rem" }}>
            Gap: <strong>{(report?.waterGap || (report?.actualWaterMl - report?.plannedWaterMl) || 0).toFixed(0)}ml</strong>
          </div>
        </div>
      </div>

      {/* Logged Meals Breakdown */}
      <div className="glass-panel" style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "1.75rem",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
            Logged Foods & Meal Diary ({loggedItems.length} entries)
          </h3>
          <Link to="/patient/log-food" className="btn btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem" }}>
            <PlusCircle size={15} /> Log Additional Food
          </Link>
        </div>

        {loggedItems.length === 0 ? (
          <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "#64748b" }}>
            <Utensils size={44} style={{ color: "#94a3b8", marginBottom: "0.75rem" }} />
            <h4 style={{ margin: "0 0 0.4rem 0", color: "#1e293b", fontSize: "1.1rem" }}>
              No Meals Logged for {getDayName(selectedDate)}
            </h4>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.88rem" }}>
              You haven't logged any foods or hydration entries for this date yet.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <Link to="/patient/log-food" className="btn btn-primary" style={{ fontSize: "0.88rem" }}>
                Log Today's Meals Now
              </Link>
              <Link to="/patient/diet-plan" className="btn btn-outline" style={{ fontSize: "0.88rem" }}>
                View Prescribed Diet Plan
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {loggedItems.map((item, idx) => (
              <div key={item.id || idx} style={{
                background: "#f8fafc",
                border: "1px solid #f1f5f9",
                borderRadius: "10px",
                padding: "0.95rem 1.15rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.75rem"
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{
                      background: "#f0f9ff",
                      color: "#0284c7",
                      padding: "0.2rem 0.55rem",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 700
                    }}>
                      {item.mealType}
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>
                      {item.foodName}
                    </strong>
                  </div>
                  {item.notes && (
                    <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.25rem" }}>
                      {item.notes}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                    {Math.round(item.calories || 0)} kcal
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    P: {Math.round(item.proteinG || 0)}g • C: {Math.round(item.carbsG || 0)}g • F: {Math.round(item.fatG || 0)}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patient Difficulty & Symptom Reporting */}
      {difficulties.length > 0 && (
        <div className="glass-panel" style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "1.75rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", color: "#d97706" }}>
            <AlertTriangle size={20} />
            <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
              Patient Adherence Difficulty & Symptom Feedback
            </h3>
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {difficulties.map((d, i) => (
              <div key={i} style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "0.85rem 1rem", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.88rem", color: "#b45309" }}>
                  <span>{d.mealType}: {d.foodName}</span>
                  <span>Difficulty Level: {d.difficultyRating}/5</span>
                </div>
                {d.difficultyReason && (
                  <div style={{ fontSize: "0.82rem", color: "#92400e", marginTop: "0.25rem" }}>
                    Reason: {d.difficultyReason}
                  </div>
                )}
                {d.symptomsReported && (
                  <div style={{ fontSize: "0.82rem", color: "#b91c1c", marginTop: "0.2rem", fontWeight: 600 }}>
                    Reported Symptoms: {d.symptomsReported}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Clinical Insights for the Day */}
      <div style={{
        background: "linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(14, 165, 233, 0.03) 100%)",
        border: "1px solid rgba(2, 132, 199, 0.25)",
        borderRadius: "16px",
        padding: "1.75rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0284c7", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.6rem" }}>
          <Sparkles size={20} />
          <span>AI Clinical Intake Evaluation & Guidance</span>
        </div>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#334155", lineHeight: 1.6 }}>
          {actualCals === 0 ? (
            "No nutritional entries have been logged for this date yet. Log meals to evaluate postprandial glycemic response, micronutrient adequacy, and deficit/surplus alignment with your clinical goals."
          ) : (
            `Today's recorded consumption reached ${Math.round(actualCals)} kcal (${adherence}% protocol adherence vs target ${Math.round(plannedCals)} kcal). ` +
            (actualCals < plannedCals - 200 ? "You are currently running a caloric deficit. Ensure protein intake remains adequate to prevent lean tissue catabolism. " : "") +
            (actualCals > plannedCals + 200 ? "Caloric intake is slightly elevated over prescribed metabolic limits. Prioritize high-fiber complex foods to promote satiety. " : "") +
            `Hydration logged at ${Math.round(report?.actualWaterMl || 0)} ml (${Math.round((report?.actualWaterMl || 0) / (report?.plannedWaterMl || 2400) * 100)}% of electrolytic target).`
          )}
        </p>
      </div>
    </div>
  );
}
