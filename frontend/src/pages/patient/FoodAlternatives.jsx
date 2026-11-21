import {  useState  } from "react";
import { Sparkles } from "lucide-react";
import api from "../../services/api";
import FoodSearch from "../../components/nutrition/FoodSearch";

export default function FoodAlternatives() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlternatives = async (food) => {
    setSelectedFood(food);
    // Alternatives come from the NutriSphere food database; external search hits have no local id
    if (!food.id || (food.source && food.source !== "LOCAL")) {
      setAlternatives([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/food/${food.id}/alternatives`);
      setAlternatives(res.data?.data || res.data || []);
    } catch (_err) {
      setAlternatives([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2>Food & Recipe Alternatives</h2>
        <p className="text-muted">Find clinically equivalent Indian dietary substitutes that match your nutritional targets.</p>
      </div>

      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }}>
        <h4 style={{ margin: "0 0 0.75rem 0" }}>Select an Indian Food to Substitute</h4>
        <FoodSearch onSelectFood={fetchAlternatives} placeholder="Search food to replace (e.g. white rice, maida paratha, chicken curry)..." />
      </div>

      {loading ? (
        <div className="loading-screen">Finding smart dietary alternatives...</div>
      ) : selectedFood ? (
        <div style={{ display: "grid", gap: "1.25rem" }}>
          <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span className="text-muted" style={{ fontSize: "0.75rem" }}>Original Selection:</span>
              <h3 style={{ margin: 0 }}>{selectedFood.name}</h3>
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>
                {Math.round(selectedFood.caloriesPer100g || selectedFood.calories || 0)} kcal • P: {selectedFood.proteinG || 0}g
              </span>
            </div>
            <span className="badge badge-primary">Base Item</span>
          </div>

          <h4 style={{ margin: "0.5rem 0 0 0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Sparkles size={18} color="var(--primary)" /> Recommended Clinical Alternatives
          </h4>

          <div style={{ display: "grid", gap: "1rem" }}>
            {alternatives.length === 0 && (
              <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
                No alternatives in the same food category were found in the database.
              </div>
            )}
            {alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  padding: "1.25rem",
                  borderRadius: "var(--radius-md)",
                  borderLeft: "4px solid #10B981",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 0.25rem 0" }}>{alt.name}</h4>
                  <p className="text-muted" style={{ margin: "0 0 0.5rem 0", fontSize: "0.825rem" }}>
                    {alt.reason}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem" }}>
                    <span><strong>{Math.round(alt.calories ?? 0)}</strong> kcal/100g</span>
                    <span>•</span>
                    <span>P: {alt.proteinG}g</span>
                    <span>•</span>
                    <span>C: {alt.carbsG}g</span>
                    <span>•</span>
                    <span>F: {alt.fatG}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "var(--radius-lg)" }}>
          Search for any food item above to discover healthier or preferred alternatives.
        </div>
      )}
    </div>
  );
}
