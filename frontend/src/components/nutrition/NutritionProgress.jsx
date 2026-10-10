
import CalorieBudgetBar from "./CalorieBudgetBar";
import MacroBreakdown from "./MacroBreakdown";

export default function NutritionProgress({
  consumedCalories = 0,
  targetCalories = 2000,
  consumedMacros = { proteinG: 0, carbsG: 0, fatG: 0 },
  targetMacros = { proteinG: 120, carbsG: 220, fatG: 65 },
  waterConsumedMl = 0,
  waterTargetMl = 2500,
}) {
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", display: "grid", gap: "1.5rem" }}>
      <div>
        <h4 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem" }}>Daily Nutrition & Calorie Progress</h4>
        <CalorieBudgetBar consumed={consumedCalories} target={targetCalories} />
      </div>

      <div>
        <h5 style={{ margin: "0 0 0.75rem 0", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Macronutrient Fulfillment
        </h5>
        <MacroBreakdown actual={consumedMacros} target={targetMacros} />
      </div>

      {waterTargetMl > 0 && (
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.4rem" }}>
            <span>Hydration Progress</span>
            <strong style={{ color: "#3B82F6" }}>
              {Math.round(waterConsumedMl)} / {waterTargetMl} mL ({Math.min(100, Math.round((waterConsumedMl / waterTargetMl) * 100))}%)
            </strong>
          </div>
          <div style={{ height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.min(100, Math.round((waterConsumedMl / waterTargetMl) * 100))}%`,
                background: "#3B82F6",
                borderRadius: "3px",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
