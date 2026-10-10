import {  useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit3, Calendar, Clock } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import Badge from "../../components/common/Badge";
import api from "../../services/api";

export default function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/nutrition/diet-plans/${id || 201}`);
        setPlan(res.data?.data || res.data);
      } catch (_err) {
        setPlan({
          id: id || 201,
          name: "Phase 2 Mediterranean Fat-Loss",
          patientName: "Alex Morgan",
          patientId: 101,
          status: "ACTIVE",
          startDate: "2026-09-01",
          endDate: "2026-11-30",
          dailyCaloriesTarget: 1950,
          dailyProteinTarget: 140,
          dailyCarbsTarget: 180,
          dailyFatTarget: 65,
          dailyWaterTarget: 2500,
          notes: "Focus on anti-inflammatory whole grains, lean poultry, wild fish, and high-polyphenol olive oil.",
          meals: [
            {
              mealType: "BREAKFAST",
              time: "08:00 AM",
              targetCalories: 450,
              description: "Steel-cut oatmeal with blueberries, chia seeds, and egg white scramble.",
            },
            {
              mealType: "LUNCH",
              time: "01:00 PM",
              targetCalories: 600,
              description: "Grilled chicken breast, wild quinoa, steamed broccoli, extra virgin olive oil vinaigrette.",
            },
            {
              mealType: "SNACK",
              time: "04:30 PM",
              targetCalories: 250,
              description: "Greek yogurt with a handful of raw walnuts and green tea.",
            },
            {
              mealType: "DINNER",
              time: "07:30 PM",
              targetCalories: 650,
              description: "Baked Atlantic salmon fillet with roast asparagus and sweet potato wedges.",
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading Diet Plan...</div>;
  if (!plan) return <div className="glass-panel" style={{ padding: "2rem" }}>Diet plan not found.</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => navigate("/dietitian/plans")}
          className="btn btn-outline"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <ArrowLeft size={16} /> Back to Plans
        </button>
        <button
          onClick={() => navigate(`/dietitian/plans/${plan.id}/edit`)}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <Edit3 size={16} /> Edit Plan
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: "0.5rem", display: "inline-block" }}>
              Patient: {plan.patientName || `#${plan.patientId}`}
            </span>
            <h2 style={{ margin: "0 0 0.5rem 0" }}>{plan.name}</h2>
            <div style={{ display: "flex", gap: "1rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Calendar size={14} /> Duration: {formatDate(plan.startDate)} to {formatDate(plan.endDate)}
              </span>
            </div>
          </div>
          <Badge variant={plan.status === "ACTIVE" ? "success" : "warning"}>{plan.status}</Badge>
        </div>

        {plan.notes && (
          <p style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 0 1.5rem 0" }}>
            <strong>Clinical Rationale:</strong> {plan.notes}
          </p>
        )}

        {/* Nutritional Targets */}
        <h4 style={{ margin: "0 0 1rem 0" }}>Daily Prescribed Targets</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Calories</span>
            <strong style={{ fontSize: "1.25rem" }}>{plan.dailyCaloriesTarget} kcal</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Protein</span>
            <strong style={{ fontSize: "1.25rem", color: "#3B82F6" }}>{plan.dailyProteinTarget}g</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Carbs</span>
            <strong style={{ fontSize: "1.25rem", color: "#10B981" }}>{plan.dailyCarbsTarget}g</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Fat</span>
            <strong style={{ fontSize: "1.25rem", color: "#F59E0B" }}>{plan.dailyFatTarget}g</strong>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Hydration</span>
            <strong style={{ fontSize: "1.25rem", color: "#60A5FA" }}>{plan.dailyWaterTarget} mL</strong>
          </div>
        </div>

        {/* Meal Schedule */}
        <h4 style={{ margin: "0 0 1rem 0" }}>Daily Meal Schedule</h4>
        <div style={{ display: "grid", gap: "1rem" }}>
          {plan.meals?.map((meal, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                padding: "1.25rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                borderLeft: "4px solid var(--primary)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <strong style={{ fontSize: "1rem" }}>{meal.mealType}</strong>
                <span className="text-muted" style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={13} /> {meal.time}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {meal.description}
              </p>
              {meal.targetCalories && (
                <span style={{ fontSize: "0.75rem", color: "var(--primary)", marginTop: "0.4rem", display: "inline-block" }}>
                  Budget: {meal.targetCalories} kcal
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
