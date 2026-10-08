import { useEffect, useState } from "react";
import api from "../../services/api";
import { Activity, Apple, Droplets, Target, AlertTriangle } from "lucide-react";

export default function PatientDashboard() {
  const [twinData, setTwinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchTwin = async () => {
      try {
        const res = await api.get("/digital-twin");
        if (!cancelled) {
          const data = res.data?.data || res.data;
          setTwinData(data || null);
          setError(data ? "" : "Nutrition data is not available yet.");
        }
      } catch (_err) {
        if (!cancelled) {
          setTwinData(null);
          setError("Unable to load your nutrition dashboard.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTwin();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="loading-screen">Loading Patient Data...</div>;

  if (!twinData) {
    return (
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h2>Patient Dashboard</h2>
        <p className="text-muted">{error || "Nutrition data is not available yet."}</p>
      </div>
    );
  }

  const targetCalories = twinData.targetCalories;
  const targetProtein = twinData.targetProteinG;
  const targetWater = twinData.targetWaterMl;
  const hasPlan = targetCalories != null || targetProtein != null || targetWater != null;
  const calorieProgress = targetCalories > 0 ? Math.min(100, ((twinData.avgDailyCalories || 0) / targetCalories) * 100) : 0;
  const proteinProgress = targetProtein > 0 ? Math.min(100, ((twinData.avgDailyProteinG || 0) / targetProtein) * 100) : 0;
  const waterProgress = targetWater > 0 ? Math.min(100, ((twinData.avgDailyWaterMl || 0) / targetWater) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Patient Dashboard</h2>
        <p className="text-muted">Welcome back. Here is your recorded nutritional overview.</p>
      </div>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <p className="text-muted">Daily Calories</p>
          <h3 style={{ fontSize: "1.5rem" }}>{Math.round(twinData.avgDailyCalories || 0)} kcal</h3>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Target: {targetCalories != null ? `${targetCalories} kcal` : "Not set"}
          </div>
          {targetCalories > 0 && (
            <div style={{ marginTop: "1rem", height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${calorieProgress}%`, height: "100%" }} />
            </div>
          )}
          <Activity size={20} />
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <p className="text-muted">Protein Intake</p>
          <h3 style={{ fontSize: "1.5rem" }}>{Math.round(twinData.avgDailyProteinG || 0)} g</h3>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Target: {targetProtein != null ? `${targetProtein} g` : "Not set"}
          </div>
          {targetProtein > 0 && (
            <div style={{ marginTop: "1rem", height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${proteinProgress}%`, height: "100%" }} />
            </div>
          )}
          <Apple size={20} />
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <p className="text-muted">Hydration</p>
          <h3 style={{ fontSize: "1.5rem" }}>{Math.round(twinData.avgDailyWaterMl || 0)} ml</h3>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Target: {targetWater != null ? `${targetWater} ml` : "Not set"}
          </div>
          {targetWater > 0 && (
            <div style={{ marginTop: "1rem", height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${waterProgress}%`, height: "100%" }} />
            </div>
          )}
          <Droplets size={20} />
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <p className="text-muted">Reality Score</p>
          <h3 style={{ fontSize: "1.5rem" }}>{twinData.latestRealityScore ?? "N/A"}</h3>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {twinData.realityScoreInterpretation || "No score yet"}
          </div>
          <Target size={20} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Current Diet Plan</h3>
          {hasPlan ? (
            <p className="text-muted">Your dashboard is using targets from the current approved diet plan.</p>
          ) : (
            <p className="text-muted">No approved diet plan targets are available yet.</p>
          )}
        </div>

        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={20} /> Adherence Barriers
          </h3>
          {twinData.totalBarriers > 0 ? (
            <div>
              <p><strong>Total Barriers Detected:</strong> {twinData.totalBarriers}</p>
              <p><strong>Dominant Barrier:</strong> {twinData.dominantBarrier || "Not determined"}</p>
            </div>
          ) : (
            <p className="text-muted">No barriers are recorded in the current data window.</p>
          )}
        </div>
      </div>
    </div>
  );
}
