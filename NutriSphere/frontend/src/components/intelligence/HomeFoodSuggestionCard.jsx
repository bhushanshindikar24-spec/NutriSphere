
import Badge from "../common/Badge";

export default function HomeFoodSuggestionCard({ suggestion, onSelect }) {
  if (!suggestion) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "1.125rem" }}>{suggestion.mealName}</h4>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>
            {suggestion.mealType}
          </span>
        </div>
        <Badge variant={suggestion.matchesDietPlan ? "success" : "warning"}>
          {suggestion.matchesDietPlan ? "Matches Diet Plan" : "Home Pantry Recipe"}
        </Badge>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
        <span><strong>Calories:</strong> {Math.round(suggestion.estimatedCalories || 0)} kcal</span>
        <span><strong>Protein:</strong> {Math.round(suggestion.estimatedProteinG || 0)}g</span>
      </div>

      {suggestion.ingredients && suggestion.ingredients.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <span className="text-muted" style={{ fontSize: "0.75rem", display: "block", marginBottom: "0.35rem" }}>
            Pantry Ingredients Used:
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {suggestion.ingredients.map((ing, i) => (
              <span
                key={i}
                style={{
                  background: "var(--bg-color)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "9999px",
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.75rem",
                }}
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}

      {suggestion.preparationNotes && (
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          {suggestion.preparationNotes}
        </p>
      )}

      {onSelect && (
        <button
          onClick={() => onSelect(suggestion)}
          className="btn btn-primary"
          style={{ width: "100%", fontSize: "0.875rem" }}
        >
          Log as Eaten Meal
        </button>
      )}
    </div>
  );
}
