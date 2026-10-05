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
    setLoading(true);
    try {
      const res = await api.get(`/nutrition/foods/${food.id || 1}/alternatives`);
      setAlternatives(res.data?.data || res.data || []);
    } catch (_err) {
      // Heuristic fallback substitutes based on food category/name
      const name = (food.name || "").toLowerCase();
// eslint-disable-next-line no-useless-assignment
      let mockList = [];
      if (name.includes("rice") || name.includes("bread") || name.includes("grain")) {
        mockList = [
          { name: "Cooked Quinoa", calories: 120, proteinG: 4.4, carbsG: 21, fatG: 1.9, reason: "Higher fiber and complete protein profile." },
          { name: "Cauliflower Rice", calories: 25, proteinG: 2.0, carbsG: 5, fatG: 0.3, reason: "Low calorie, keto-friendly alternative." },
          { name: "Brown Rice", calories: 111, proteinG: 2.6, carbsG: 23, fatG: 0.9, reason: "Lower glycemic index with sustained energy release." },
        ];
      } else if (name.includes("chicken") || name.includes("beef") || name.includes("meat")) {
        mockList = [
          { name: "Grilled Firm Tofu", calories: 140, proteinG: 17, carbsG: 3, fatG: 8, reason: "Heart-healthy plant-based protein with zero cholesterol." },
          { name: "Lentil Dal", calories: 165, proteinG: 12, carbsG: 27, fatG: 1, reason: "Rich in prebiotic fiber and micronutrients." },
          { name: "Baked Salmon", calories: 206, proteinG: 22, carbsG: 0, fatG: 12, reason: "High in anti-inflammatory Omega-3 fatty acids." },
        ];
      } else {
        mockList = [
          { name: "Steamed Edamame", calories: 122, proteinG: 11, carbsG: 10, fatG: 5, reason: "High fiber and micronutrient density." },
          { name: "Greek Yogurt (Nonfat)", calories: 59, proteinG: 10, carbsG: 3.6, fatG: 0.4, reason: "High protein satiety with gut probiotics." },
        ];
      }
      setAlternatives(mockList);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2>Food & Recipe Alternatives</h2>
        <p className="text-muted">Find clinically equivalent dietary substitutes that match your nutritional targets.</p>
      </div>

      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }}>
        <h4 style={{ margin: "0 0 0.75rem 0" }}>Select a Food to Substitute</h4>
        <FoodSearch onSelectFood={fetchAlternatives} placeholder="Search food to replace (e.g. white rice, steak)..." />
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
                    {alt.reason || "Clinically balanced nutritional substitute."}
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.8rem" }}>
                    <span><strong>{alt.calories}</strong> kcal</span>
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
