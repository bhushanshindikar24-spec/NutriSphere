import { HeartPulse, Scale, Flame, TrendingDown } from "lucide-react";
import StatCard from "../common/StatCard";
import WeightTrendChart from "../charts/WeightTrendChart";

export default function DigitalTwinViewer({ twinData }) {
  if (!twinData) {
    return (
      <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
        Digital Twin data is not available yet.
      </div>
    );
  }

  const projection = twinData.currentWeightKg != null && twinData.projectedWeight30Days != null
    ? [
        { date: "Today", weight: twinData.currentWeightKg },
        { date: "30 days", weight: twinData.projectedWeight30Days },
      ]
    : [];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        <StatCard
          title="Current Weight"
          value={twinData.currentWeightKg != null ? `${twinData.currentWeightKg} kg` : "--"}
          subtext="Recorded patient weight"
          icon={<Scale size={20} />}
          iconColor="#4F46E5"
          iconBg="var(--primary-light)"
        />
        <StatCard
          title="Daily Calorie Balance"
          value={twinData.netCaloricDeficit != null ? `${Math.round(twinData.netCaloricDeficit)} kcal` : "--"}
          subtext="Approved target minus recorded intake"
          icon={<Flame size={20} />}
          iconColor="#F59E0B"
          iconBg="rgba(245, 158, 11, 0.1)"
        />
        <StatCard
          title="Projected 30-Day Weight"
          value={twinData.projectedWeight30Days != null ? `${Math.round(twinData.projectedWeight30Days * 10) / 10} kg` : "--"}
          subtext="Transparent energy-balance projection"
          icon={<TrendingDown size={20} />}
          iconColor="#10B981"
          iconBg="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          title="Metabolic Reality Score"
          value={twinData.latestRealityScore != null ? `${Math.round(twinData.latestRealityScore)} / 100` : "--"}
          subtext="Latest calculated feasibility score"
          icon={<HeartPulse size={20} />}
          iconColor="#EC4899"
          iconBg="rgba(236, 72, 153, 0.1)"
        />
      </div>

      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ marginBottom: "1rem" }}>Weight Progression & Predictive Projection</h4>
        <WeightTrendChart
          actualData={twinData.weightHistory || []}
          projectedData={projection}
        />
      </div>
    </div>
  );
}
