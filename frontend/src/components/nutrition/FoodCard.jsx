
import { Plus, Info } from "lucide-react";

export default function FoodCard({ food, onSelect, onDetails, showAddButton = true }) {
  if (!food) return null;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "1.25rem",
        borderRadius: "var(--radius-lg)",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "transform 0.15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "1rem" }}>{food.name || food.foodName}</h4>
          {food.brand && <span className="text-muted" style={{ fontSize: "0.75rem" }}>{food.brand}</span>}
          {food.category && (
            <span
              style={{
                display: "inline-block",
                marginLeft: food.brand ? "0.5rem" : 0,
                fontSize: "0.7rem",
                padding: "0.15rem 0.4rem",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "4px",
              }}
            >
              {food.category}
            </span>
          )}
        </div>

        {food.source && (
          <span style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 600 }}>
            {food.source}
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.4rem",
          background: "rgba(255, 255, 255, 0.02)",
          padding: "0.6rem",
          borderRadius: "6px",
          textAlign: "center",
          fontSize: "0.75rem",
        }}
      >
        <div>
          <span className="text-muted" style={{ display: "block" }}>Calories</span>
          <strong>{Math.round(food.caloriesPer100g || food.calories || 0)}</strong>
        </div>
        <div>
          <span className="text-muted" style={{ display: "block" }}>Protein</span>
          <strong style={{ color: "#3B82F6" }}>{Math.round((food.proteinG || 0) * 10) / 10}g</strong>
        </div>
        <div>
          <span className="text-muted" style={{ display: "block" }}>Carbs</span>
          <strong style={{ color: "#10B981" }}>{Math.round((food.carbsG || 0) * 10) / 10}g</strong>
        </div>
        <div>
          <span className="text-muted" style={{ display: "block" }}>Fat</span>
          <strong style={{ color: "#F59E0B" }}>{Math.round((food.fatG || 0) * 10) / 10}g</strong>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        {onDetails && (
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => onDetails(food)}
            style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
          >
            <Info size={14} /> Details
          </button>
        )}
        {showAddButton && onSelect && (
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => onSelect(food)}
            style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>
    </div>
  );
}
