import {  useState  } from "react";
import HomeFoodSuggestionCard from "./HomeFoodSuggestionCard";
import { Sparkles } from "lucide-react";

export default function HomeFoodSuggestions({
  suggestions = [],
  onSelectSuggestion,
  onGenerateMore,
  isLoading = false,
}) {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filtered = suggestions.filter((s) => {
    if (activeFilter === "ALL") return true;
    return s.mealType?.toUpperCase() === activeFilter;
  });

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <div
        className="glass-panel"
        style={{
          padding: "1.25rem 1.5rem",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Sparkles size={20} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>AI Home Meal Suggestions</h3>
          </div>
          <p className="text-muted" style={{ margin: 0, fontSize: "0.8125rem", marginTop: "0.25rem" }}>
            Recipes dynamically composed from your available home pantry ingredients to fit your diet plan.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["ALL", "BREAKFAST", "LUNCH", "DINNER", "SNACK"].map((meal) => (
            <button
              key={meal}
              onClick={() => setActiveFilter(meal)}
              className={`btn btn-sm ${activeFilter === meal ? "btn-primary" : "btn-outline"}`}
              style={{ fontSize: "0.75rem" }}
            >
              {meal}
            </button>
          ))}
          {onGenerateMore && (
            <button
              onClick={onGenerateMore}
              className="btn btn-sm btn-primary"
              disabled={isLoading}
              style={{ fontSize: "0.75rem" }}
            >
              {isLoading ? "Generating..." : "Regenerate"}
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
          {suggestions.length === 0
            ? "No meal suggestions available. Add items to your pantry and click 'Generate Suggestions'."
            : `No recipes found for ${activeFilter.toLowerCase()}.`}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {filtered.map((suggestion, idx) => (
            <HomeFoodSuggestionCard
              key={suggestion.id || idx}
              suggestion={suggestion}
              onSelect={onSelectSuggestion}
            />
          ))}
        </div>
      )}
    </div>
  );
}
