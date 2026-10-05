
import { Clock, CheckCircle2, ShoppingBag, Utensils } from "lucide-react";
import Badge from "../common/Badge";
import { capitalize } from "../../utils/formatters";

export default function MealCard({
  meal,
  onLogMeal,
  onReportDeviation,
  onOrderHotel,
  isLogged = false,
}) {
  if (!meal) return null;

  const mealType = meal.mealType || meal.type || "Meal";
  const mealName = meal.mealName || meal.name || capitalize(mealType);

  return (
    <div
      className="glass-panel"
      style={{
        padding: "1.25rem",
        borderRadius: "var(--radius-lg)",
        borderLeft: isLogged ? "4px solid #10B981" : "4px solid var(--primary)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h4 style={{ margin: 0, fontSize: "1.05rem" }}>{mealName}</h4>
            {isLogged && (
              <span style={{ color: "#10B981", display: "inline-flex", alignItems: "center", gap: "0.2rem", fontSize: "0.75rem" }}>
                <CheckCircle2 size={15} /> Logged
              </span>
            )}
          </div>
          <span className="text-muted" style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.3rem", marginTop: "0.2rem" }}>
            <Clock size={13} /> {meal.time || meal.scheduledTime || "Scheduled"}
          </span>
        </div>

        <Badge variant={isLogged ? "success" : "primary"}>
          {capitalize(mealType)}
        </Badge>
      </div>

      {meal.description && (
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
          {meal.description}
        </p>
      )}

      {/* Foods list if present */}
      {meal.items && meal.items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {meal.items.map((item, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.5rem",
                background: "rgba(255, 255, 255, 0.04)",
                borderRadius: "4px",
                border: "1px solid var(--border-color)",
              }}
            >
              {item.name || item.foodName} ({item.quantity || "1 serving"})
            </span>
          ))}
        </div>
      )}

      {/* Target Macros */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          fontSize: "0.8rem",
          background: "rgba(255, 255, 255, 0.02)",
          padding: "0.5rem 0.75rem",
          borderRadius: "6px",
        }}
      >
        <span><strong>{Math.round(meal.targetCalories || meal.calories || 0)}</strong> kcal</span>
        <span className="text-muted">•</span>
        <span>P: {Math.round(meal.targetProteinG || meal.proteinG || 0)}g</span>
        <span className="text-muted">•</span>
        <span>C: {Math.round(meal.targetCarbsG || meal.carbsG || 0)}g</span>
        <span className="text-muted">•</span>
        <span>F: {Math.round(meal.targetFatG || meal.fatG || 0)}g</span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.25rem" }}>
        {onReportDeviation && !isLogged && (
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => onReportDeviation(meal)}
            style={{ fontSize: "0.75rem", color: "#F59E0B", borderColor: "rgba(245, 158, 11, 0.3)" }}
          >
            Report Barrier
          </button>
        )}

        {onOrderHotel && (
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => onOrderHotel(meal)}
            style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            <ShoppingBag size={13} /> Order Delivery
          </button>
        )}

        {onLogMeal && !isLogged && (
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => onLogMeal(meal)}
            style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            <Utensils size={13} /> Log Eaten
          </button>
        )}
      </div>
    </div>
  );
}
