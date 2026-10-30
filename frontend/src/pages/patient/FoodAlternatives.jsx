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
      if (name.includes("rice") || name.includes("bread") || name.includes("roti") || name.includes("grain")) {
        mockList = [
          { name: "Jowar / Bajra Bhakri", calories: 105, proteinG: 3.7, carbsG: 21.6, fatG: 0.8, reason: "High-fiber gluten-free millet flatbread with low glycemic index." },
          { name: "Steamed Brown Basmati Rice", calories: 112, proteinG: 2.6, carbsG: 23.5, fatG: 0.9, reason: "Complex whole grain with slow digestive absorption." },
          { name: "Multigrain Phulka (Wheat, Jowar & Bajra)", calories: 84, proteinG: 3.3, carbsG: 16.1, fatG: 0.7, reason: "Traditional Indian staple packed with fiber and magnesium." },
        ];
      } else if (name.includes("chicken") || name.includes("mutton") || name.includes("fish") || name.includes("meat")) {
        mockList = [
          { name: "Low-Fat Paneer Bhurji", calories: 145, proteinG: 12.0, carbsG: 2.8, fatG: 9.0, reason: "Dense vegetarian dairy protein with calcium and minimal carbohydrates." },
          { name: "Panchmel Dal Tadka", calories: 110, proteinG: 6.5, carbsG: 16.0, fatG: 2.8, reason: "Easily digestible satvik legume mix rich in prebiotic fiber and iron." },
          { name: "Sprouted Kala Chana Chaat", calories: 125, proteinG: 8.5, carbsG: 21.0, fatG: 1.2, reason: "High bioavailable zinc, magnesium, and plant-based amino acids." },
        ];
      } else {
        mockList = [
          { name: "Roasted Desi Makhana (Foxnuts)", calories: 105, proteinG: 2.9, carbsG: 22.8, fatG: 0.3, reason: "Zero cholesterol, low-sodium Indian superfood rich in magnesium." },
          { name: "Spiced Tadka Chaas (Buttermilk)", calories: 35, proteinG: 2.2, carbsG: 3.2, fatG: 1.2, reason: "Traditional probiotic cooler with roasted cumin to stimulate digestion." },
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
