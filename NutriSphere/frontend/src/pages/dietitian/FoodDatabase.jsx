import {  useState  } from "react";
import FoodSearch from "../../components/nutrition/FoodSearch";
import FoodCard from "../../components/nutrition/FoodCard";

export default function FoodDatabase() {
  const [selectedFood, setSelectedFood] = useState(null);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [recentFoods, setRecentFoods] = useState([
    {
      id: 1,
      name: "Atlantic Salmon, Raw",
      calories: 208,
      proteinG: 20.4,
      carbsG: 0,
      fatG: 13.4,
      source: "USDA FoodData Central",
    },
    {
      id: 2,
      name: "Organic Rolled Oats",
      calories: 389,
      proteinG: 16.9,
      carbsG: 66.3,
      fatG: 6.9,
      source: "USDA FoodData Central",
    },
    {
      id: 3,
      name: "Extra Firm Tofu",
      calories: 144,
      proteinG: 17.3,
      carbsG: 2.8,
      fatG: 8.7,
      source: "OpenFoodFacts",
    },
  ]);

  const handleSelectFood = (food) => {
    setSelectedFood(food);
  };

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div>
        <h2>Clinical Food & Nutrient Database</h2>
        <p className="text-muted">
          Access over 300,000+ verified food items via USDA FoodData Central and OpenFoodFacts APIs.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 1rem 0" }}>Live Database Search</h4>
        <FoodSearch onSelectFood={handleSelectFood} />
      </div>

      {selectedFood && (
        <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)", borderLeft: "4px solid var(--primary)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <span className="badge badge-primary">{selectedFood.source || "NutriSphere DB"}</span>
              <h3 style={{ margin: "0.5rem 0 0.25rem 0" }}>{selectedFood.name}</h3>
              {selectedFood.brand && <span className="text-muted">{selectedFood.brand}</span>}
            </div>
            <button
              onClick={() => setSelectedFood(null)}
              className="btn btn-sm btn-outline"
            >
              Clear
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center", background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "8px" }}>
            <div>
              <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Calories (per 100g)</span>
              <strong style={{ fontSize: "1.25rem" }}>{Math.round(selectedFood.caloriesPer100g || selectedFood.calories || 0)}</strong>
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Protein</span>
              <strong style={{ fontSize: "1.25rem", color: "#3B82F6" }}>{selectedFood.proteinG || 0}g</strong>
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Carbohydrates</span>
              <strong style={{ fontSize: "1.25rem", color: "#10B981" }}>{selectedFood.carbsG || 0}g</strong>
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Lipids (Fat)</span>
              <strong style={{ fontSize: "1.25rem", color: "#F59E0B" }}>{selectedFood.fatG || 0}g</strong>
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 style={{ margin: "0 0 1rem 0" }}>Recently Referenced Clinical Foods</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
          {recentFoods.map((f) => (
            <FoodCard key={f.id} food={f} onSelect={handleSelectFood} showAddButton={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
