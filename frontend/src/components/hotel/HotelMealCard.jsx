
import { formatCurrency } from "../../utils/formatters";
import { Plus } from "lucide-react";
import Badge from "../common/Badge";

export default function HotelMealCard({ meal, onAddToCart, onEdit, isHotelOwner = false }) {
  if (!meal) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        {meal.imageUrl && (
          <img
            src={meal.imageUrl}
            alt={meal.name}
            style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: "0.75rem" }}
          />
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          <h4 style={{ margin: 0, fontSize: "1.0625rem" }}>{meal.name}</h4>
          <span style={{ fontWeight: 700, color: "var(--primary)" }}>
            {formatCurrency(meal.price)}
          </span>
        </div>
        <p className="text-muted" style={{ fontSize: "0.8125rem", marginBottom: "0.75rem", lineHeight: 1.4 }}>
          {meal.description || "Freshly prepared clinical nutritional meal"}
        </p>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <Badge variant="neutral">{meal.category || "General"}</Badge>
          <span className="text-muted" style={{ fontSize: "0.75rem", alignSelf: "center" }}>
            {Math.round(meal.calories || 0)} kcal • {Math.round(meal.proteinG || 0)}g protein
          </span>
        </div>
      </div>

      <div>
        {isHotelOwner ? (
          <button
            onClick={() => onEdit(meal)}
            className="btn btn-outline"
            style={{ width: "100%", fontSize: "0.8125rem" }}
          >
            Edit Meal Item
          </button>
        ) : (
          <button
            onClick={() => onAddToCart(meal)}
            className="btn btn-primary"
            style={{ width: "100%", fontSize: "0.8125rem" }}
          >
            <Plus size={16} /> Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
