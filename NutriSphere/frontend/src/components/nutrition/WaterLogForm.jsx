import {  useState  } from "react";
import { Droplets, Plus } from "lucide-react";

export default function WaterLogForm({ onLogWater, currentAmountMl = 0, targetMl = 2500 }) {
// eslint-disable-next-line unused-imports/no-unused-vars
  const [amount, setAmount] = useState(250);

  const presets = [150, 250, 500, 750];

  const handleAdd = (val) => {
    onLogWater(val);
  };

  const pct = Math.min(100, Math.round((currentAmountMl / targetMl) * 100));

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3B82F6", padding: "0.5rem", borderRadius: "8px" }}>
            <Droplets size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>Daily Hydration</h4>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              Target: {targetMl} ml
            </span>
          </div>
        </div>
        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#3B82F6" }}>
          {currentAmountMl} ml
        </span>
      </div>

      <div style={{ height: "8px", background: "var(--border-color)", borderRadius: "4px", overflow: "hidden", marginBottom: "1.25rem" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#3B82F6", transition: "width 0.4s ease" }} />
      </div>

      <div>
        <span className="text-muted" style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.5rem" }}>
          Quick Add Water:
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleAdd(p)}
              className="btn btn-outline"
              style={{ fontSize: "0.8125rem", padding: "0.4rem 0.25rem", borderColor: "#93C5FD", color: "#2563EB" }}
            >
              <Plus size={12} /> {p}ml
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
