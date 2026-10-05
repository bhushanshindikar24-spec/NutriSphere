
import { Plus } from "lucide-react";

export default function FoodItemCard({ food, onSelect }) {
  if (!food) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <h4 style={{ margin: 0, fontSize: "1rem" }}>{food.name}</h4>
          {food.brand && <span className="text-muted" style={{ fontSize: "0.75rem" }}>({food.brand})</span>}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
          <span>{food.caloriesPer100g || food.calories || 0} kcal/100g</span>
          <span>•</span>
          <span>P: {food.proteinG || 0}g</span>
          <span>•</span>
          <span>C: {food.carbsG || 0}g</span>
          <span>•</span>
          <span>F: {food.fatG || 0}g</span>
        </div>
        {food.source && (
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "inline-block" }}>
            Source: {food.source}
          </span>
        )}
      </div>

      {onSelect && (
        <button
          onClick={() => onSelect(food)}
          className="btn btn-primary"
          style={{ padding: "0.4rem 0.8rem", fontSize: "0.8125rem" }}
        >
          <Plus size={16} /> Select
        </button>
      )}
    </div>
  );
}
