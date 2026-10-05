import { useState, useEffect } from "react";
import api from "../../services/api";
import { Activity, Apple, Droplets, Target, AlertTriangle } from "lucide-react";

export default function PatientDashboard() {
  const [twinData, setTwinData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTwin = async () => {
      try {
        const res = await api.get("/digital-twin");
        setTwinData(res.data.data);
      } catch (err) {
        console.error("Failed to load digital twin", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTwin();
  }, []);

  if (loading) return <div className="loading-screen">Loading Patient Data...</div>;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Patient Dashboard</h2>
        <p className="text-muted">Welcome back. Here is your daily nutritional overview.</p>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Daily Calories</p>
              <h3 style={{ fontSize: "1.5rem" }}>{twinData?.avgDailyCalories ? Math.round(twinData.avgDailyCalories) : 0} kcal</h3>
            </div>
            <div style={{ background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <Activity size={24} />
            </div>
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Target: {twinData?.targetCalories || 2000} kcal
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: "1rem", height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ 
              width: `${Math.min(100, ((twinData?.avgDailyCalories || 0) / (twinData?.targetCalories || 2000)) * 100)}%`, 
              height: "100%", 
              background: "#F59E0B" 
            }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Protein Intake</p>
              <h3 style={{ fontSize: "1.5rem" }}>{twinData?.avgDailyProteinG ? Math.round(twinData.avgDailyProteinG) : 0}g</h3>
            </div>
            <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--secondary)", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <Apple size={24} />
            </div>
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Target: {twinData?.targetProteinG || 50}g
          </div>
          <div style={{ marginTop: "1rem", height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, ((twinData?.avgDailyProteinG || 0) / (twinData?.targetProteinG || 50)) * 100)}%`, height: "100%", background: "var(--secondary)" }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>Hydration</p>
              <h3 style={{ fontSize: "1.5rem" }}>{twinData?.avgDailyWaterMl ? Math.round(twinData.avgDailyWaterMl) : 0} ml</h3>
            </div>
            <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <Droplets size={24} />
            </div>
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Target: {twinData?.targetWaterMl || 2500} ml
          </div>
          <div style={{ marginTop: "1rem", height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${Math.min(100, ((twinData?.avgDailyWaterMl || 0) / (twinData?.targetWaterMl || 2500)) * 100)}%`, height: "100%", background: "#3B82F6" }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>AI Reality Score</p>
              <h3 style={{ fontSize: "1.5rem" }}>{twinData?.latestRealityScore || "N/A"}</h3>
            </div>
            <div style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6", padding: "0.75rem", borderRadius: "var(--radius-md)" }}>
              <Target size={24} />
            </div>
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {twinData?.realityScoreInterpretation || "No score yet"}
          </div>
        </div>

      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Current Diet Plan
          </h3>
          <p className="text-muted">No active diet plan found. Your dietitian will assign one soon.</p>
        </div>

        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={20} color="#F59E0B" /> Adherence Barriers
          </h3>
          {twinData?.totalBarriers > 0 ? (
             <div>
               <p><strong>Total Barriers Detected:</strong> {twinData.totalBarriers}</p>
               <p><strong>Dominant Barrier:</strong> <span style={{ color: "red" }}>{twinData.dominantBarrier}</span></p>
             </div>
          ) : (
             <p className="text-muted">No significant barriers detected recently. Keep up the good work!</p>
          )}
        </div>
      </div>
    </div>
  );
}
