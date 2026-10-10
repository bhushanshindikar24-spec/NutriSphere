
import { formatCalories, formatGrams } from "../../utils/formatters";
import { Target } from "lucide-react";

export default function NutritionRequirementCard({ requirement }) {
  if (!requirement) {
    return (
      <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
        No clinical nutrition requirement calculated yet.
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "0.5rem", borderRadius: "8px" }}>
            <Target size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>Prescribed Targets</h4>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              Calculation method: {requirement.calculationMethod || "Mifflin-St Jeor / Clinical Standard"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", background: "var(--bg-color)", padding: "1rem", borderRadius: "var(--radius-md)", textAlign: "center" }}>
        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Target Calories</span>
          <p style={{ margin: "0.25rem 0 0", fontWeight: 700, fontSize: "1.125rem", color: "var(--primary)" }}>
            {formatCalories(requirement.caloriesTarget)}
          </p>
        </div>
        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Protein</span>
          <p style={{ margin: "0.25rem 0 0", fontWeight: 700, fontSize: "1.125rem" }}>
            {formatGrams(requirement.proteinGTarget)}
          </p>
        </div>
        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Carbohydrates</span>
          <p style={{ margin: "0.25rem 0 0", fontWeight: 700, fontSize: "1.125rem" }}>
            {formatGrams(requirement.carbsGTarget)}
          </p>
        </div>
        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Dietary Fat</span>
          <p style={{ margin: "0.25rem 0 0", fontWeight: 700, fontSize: "1.125rem" }}>
            {formatGrams(requirement.fatGTarget)}
          </p>
        </div>
      </div>
    </div>
  );
}
