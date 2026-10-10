import {  useState  } from "react";
import ProgressChart from "../charts/ProgressChart";
import AdherenceChart from "../charts/AdherenceChart";
import WeightTrendChart from "../charts/WeightTrendChart";

export default function TrendAnalysis({
  adherenceData = [],
  weightData = [],
  calorieData = [],
  title = "Biometric & Compliance Trend Analysis",
}) {
  const [tab, setTab] = useState("adherence");

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem",
        }}
      >
        <h4 style={{ margin: 0, fontSize: "1.05rem" }}>{title}</h4>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[
            { id: "adherence", label: "Adherence" },
            { id: "weight", label: "Weight History" },
            { id: "calories", label: "Calorie Intake" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`btn btn-sm ${tab === t.id ? "btn-primary" : "btn-outline"}`}
              style={{ fontSize: "0.75rem" }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ minHeight: "260px" }}>
        {tab === "adherence" && (
          <AdherenceChart data={adherenceData} />
        )}
        {tab === "weight" && (
          <WeightTrendChart actualData={weightData} projectedData={[]} />
        )}
        {tab === "calories" && (
          <ProgressChart data={calorieData} dataKey="calories" />
        )}
      </div>
    </div>
  );
}
