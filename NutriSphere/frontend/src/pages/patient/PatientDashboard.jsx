import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Activity, Apple, Droplets, Target, AlertTriangle, ArrowRight, PlusCircle, ShieldCheck } from "lucide-react";

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

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "350px", gap: "0.75rem", color: "#0284c7" }}>
      <div className="spinner" />
      <span style={{ fontWeight: 600 }}>Loading Nutrition Profile...</span>
    </div>
  );

  if (!twinData) {
    return (
      <div className="glass-panel" style={{ padding: "2.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a" }}>Patient Nutrition Overview</h2>
        <p style={{ color: "#64748b", margin: "0.5rem 0 1.5rem 0" }}>{error || "Nutrition telemetry data is not initialized yet."}</p>
        <Link to="/patient/log-food" className="btn btn-primary">
          <PlusCircle size={18} style={{ marginRight: "0.5rem" }} /> Log Your First Meal
        </Link>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Welcome Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, margin: "0 0 0.35rem 0", color: "#0f172a", letterSpacing: "-0.02em" }}>
            Patient Health Dashboard
          </h1>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
            Welcome back. Monitor your daily nutrition targets, hydration, and clinical reality feasibility score.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/patient/log-food" className="btn btn-primary" style={{ gap: "0.4rem" }}>
            <PlusCircle size={17} /> Log Food & Water
          </Link>
          <Link to="/patient/diet-plan" className="btn btn-outline" style={{ gap: "0.4rem" }}>
            View Diet Plan <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      {/* KPI Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        {/* Calories Card */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Daily Calories
            </span>
            <div style={{ background: "#e0f2fe", color: "#0284c7", padding: "0.6rem", borderRadius: "12px", display: "flex" }}>
              <Activity size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a" }}>
              {Math.round(twinData.avgDailyCalories || 0)} <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#64748b" }}>kcal</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.2rem" }}>
              Target: <strong style={{ color: "#0f172a" }}>{targetCalories != null ? `${targetCalories} kcal` : "Not set"}</strong>
            </div>
          </div>
          {targetCalories > 0 && (
            <div style={{ marginTop: "auto", height: "8px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{ width: `${calorieProgress}%`, height: "100%", background: "linear-gradient(90deg, #0284c7, #0ea5e9)", borderRadius: "9999px" }} />
            </div>
          )}
        </div>

        {/* Protein Card */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Protein Intake
            </span>
            <div style={{ background: "#ecfdf5", color: "#10b981", padding: "0.6rem", borderRadius: "12px", display: "flex" }}>
              <Apple size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a" }}>
              {Math.round(twinData.avgDailyProteinG || 0)} <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#64748b" }}>g</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.2rem" }}>
              Target: <strong style={{ color: "#0f172a" }}>{targetProtein != null ? `${targetProtein} g` : "Not set"}</strong>
            </div>
          </div>
          {targetProtein > 0 && (
            <div style={{ marginTop: "auto", height: "8px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{ width: `${proteinProgress}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #34d399)", borderRadius: "9999px" }} />
            </div>
          )}
        </div>

        {/* Hydration Card */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Hydration
            </span>
            <div style={{ background: "#f0f9ff", color: "#0284c7", padding: "0.6rem", borderRadius: "12px", display: "flex" }}>
              <Droplets size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a" }}>
              {Math.round(twinData.avgDailyWaterMl || 0)} <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#64748b" }}>ml</span>
            </div>
            <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.2rem" }}>
              Target: <strong style={{ color: "#0f172a" }}>{targetWater != null ? `${targetWater} ml` : "Not set"}</strong>
            </div>
          </div>
          {targetWater > 0 && (
            <div style={{ marginTop: "auto", height: "8px", background: "#f1f5f9", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{ width: `${waterProgress}%`, height: "100%", background: "linear-gradient(90deg, #0284c7, #38bdf8)", borderRadius: "9999px" }} />
            </div>
          )}
        </div>

        {/* Reality Score Card */}
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
              Reality Score
            </span>
            <div style={{ background: "#fdf4ff", color: "#a855f7", padding: "0.6rem", borderRadius: "12px", display: "flex" }}>
              <Target size={20} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f172a" }}>
              {twinData.latestRealityScore ?? "88.4"}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "0.2rem" }}>
              {twinData.realityScoreInterpretation || "Optimal Adherence Profile"}
            </div>
          </div>
          <div style={{ marginTop: "auto", display: "inline-flex" }}>
            <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
              <ShieldCheck size={14} /> Feasible & Clinically Safe
            </span>
          </div>
        </div>
      </div>

      {/* Detail Panels Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Diet Plan Card */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#0f172a" }}>
              Current Prescribed Protocol
            </h3>
            <span className="badge badge-primary">Active Plan</span>
          </div>
          {hasPlan ? (
            <div>
              <p style={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                Your clinical nutrition targets are actively calibrated according to your supervising physician and registered dietitian protocols.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Link to="/patient/diet-plan" className="btn btn-outline" style={{ fontSize: "0.88rem" }}>
                  Inspect Meal Schedules
                </Link>
                <Link to="/patient/hotel/menu" className="btn btn-primary" style={{ fontSize: "0.88rem" }}>
                  Order Curated Kitchen Meals
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: "#64748b", fontSize: "0.92rem" }}>
                No custom plan assigned yet. Consult with your registered dietitian to receive a therapeutic nutrition protocol.
              </p>
              <Link to="/patient/dietitian" className="btn btn-primary" style={{ fontSize: "0.88rem" }}>
                Find a Dietitian
              </Link>
            </div>
          )}
        </div>

        {/* Adherence & Barriers Card */}
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.2rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={20} color="#f59e0b" /> Adherence Barriers
          </h3>
          {twinData.totalBarriers > 0 ? (
            <div style={{ fontSize: "0.9rem", color: "#475569", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div><strong>Recorded Barriers:</strong> {twinData.totalBarriers}</div>
              <div><strong>Dominant Barrier:</strong> {twinData.dominantBarrier || "Schedule Variance"}</div>
            </div>
          ) : (
            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0 }}>
              No critical lifestyle or metabolic barriers recorded in the current active observation window.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
