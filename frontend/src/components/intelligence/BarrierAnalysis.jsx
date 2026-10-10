import {  useState  } from "react";
import BarrierAnalysisCard from "./BarrierAnalysisCard";
import BarrierCard from "./BarrierCard";

export default function BarrierAnalysis({
  barriers = [],
  barrierCounts = {},
  onResolveBarrier,
}) {
  const [filter, setFilter] = useState("ALL");

  const filtered = barriers.filter((b) => {
    if (filter === "RESOLVED") return b.resolved;
    if (filter === "ACTIVE") return !b.resolved;
    if (filter !== "ALL") return b.barrierType === filter || b.type === filter;
    return true;
  });

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <BarrierAnalysisCard barriers={barriers} barrierCounts={barrierCounts} />

      <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "1rem",
          }}
        >
          <h4 style={{ margin: 0, fontSize: "1rem" }}>Recorded Adherence Barriers</h4>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["ALL", "ACTIVE", "RESOLVED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`btn btn-sm ${filter === status ? "btn-primary" : "btn-outline"}`}
                style={{ fontSize: "0.75rem" }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-muted" style={{ textAlign: "center", padding: "1.5rem 0", fontSize: "0.875rem" }}>
            No barriers matching current filter.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {filtered.map((b, idx) => (
              <BarrierCard key={b.id || idx} barrier={b} onResolve={onResolveBarrier} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
