import {  useState, useEffect  } from "react";
import api from "../../services/api";

export default function DietPlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get("/nutrition/diet-plans/my");
        const plans = res.data.data;
        setPlan(Array.isArray(plans) ? (plans.length > 0 ? plans[0] : null) : plans);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  if (loading) return <div className="loading-screen">Loading Diet Plan...</div>;

  if (!plan) return (
    <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
      <h2>No Active Diet Plan</h2>
      <p className="text-muted">Your dietitian has not assigned an active diet plan yet.</p>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2>Current Diet Plan</h2>
          <p className="text-muted">Approved by your dietitian. Focus on your daily goals.</p>
        </div>
        <span style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--secondary)", padding: "0.5rem 1rem", borderRadius: "var(--radius-md)", fontWeight: 500 }}>
          {plan.status}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h3>Daily Targets</h3>
          <ul style={{ listStyle: "none", marginTop: "1rem" }}>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}><strong>Calories:</strong> {plan.dailyCaloriesTarget} kcal</li>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}><strong>Protein:</strong> {plan.dailyProteinTarget} g</li>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}><strong>Carbs:</strong> {plan.dailyCarbsTarget} g</li>
            <li style={{ padding: "0.5rem 0", borderBottom: "1px solid var(--border-color)" }}><strong>Fat:</strong> {plan.dailyFatTarget} g</li>
            <li style={{ padding: "0.5rem 0" }}><strong>Water:</strong> {plan.dailyWaterTarget} ml</li>
          </ul>
        </div>
      </div>

      <h3>Meals</h3>
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {plan.meals?.map((meal, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: "1.5rem" }}>
            <h4>{meal.mealType} ({meal.time})</h4>
            <p className="text-muted" style={{ marginTop: "0.5rem" }}>{meal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
