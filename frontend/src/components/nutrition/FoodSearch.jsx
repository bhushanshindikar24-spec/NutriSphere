import {  useState, useEffect  } from "react";
import { Search, Loader2 } from "lucide-react";
import { foodService } from "../../services/foodService";

export default function FoodSearch({ onSelectFood, placeholder = "Search foods, USDA, or barcodes..." }) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("ALL"); // ALL, LOCAL, USDA, OPENFOODFACTS
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
 
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        let items = [];
        if (source === "ALL" || source === "LOCAL") {
          const res = await foodService.searchFoods(query);
          const raw = res.data?.data || res.data;
          const localList = Array.isArray(raw) ? raw : (raw?.content || []);
          items = [...items, ...localList.map((f) => ({ ...f, source: f.source || "LOCAL" }))];
        }

        if (source === "USDA" || (source === "ALL" && items.length < 5)) {
          try {
            const usdaRes = await foodService.searchUSDA(query);
            const rawUsda = usdaRes.data?.data || usdaRes.data;
            const usdaList = Array.isArray(rawUsda) ? rawUsda : (rawUsda?.content || []);
            items = [...items, ...usdaList.map((f) => ({ ...f, source: "USDA" }))];
          } catch (_e) {
            // fallback gracefully
          }
        }

        if (source === "OPENFOODFACTS") {
          try {
            const offRes = await foodService.searchOpenFoodFacts(query);
            const rawOff = offRes.data?.data || offRes.data;
            const offList = Array.isArray(rawOff) ? rawOff : (rawOff?.content || []);
            items = [...items, ...offList.map((f) => ({ ...f, source: "OpenFoodFacts" }))];
          } catch (_e) {
            // fallback gracefully
          }
        }

        setResults(items);
      } catch (_err) {
        setError("Failed to search foods.");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, source]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            className="input-field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{ paddingLeft: "2.5rem", width: "100%" }}
          />
          {loading && (
            <Loader2
              size={18}
              className="spin"
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--primary)",
              }}
            />
          )}
        </div>

        <select
          className="input-field"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ width: "140px" }}
        >
          <option value="ALL">All Sources</option>
          <option value="LOCAL">NutriSphere DB</option>
          <option value="USDA">USDA Central</option>
          <option value="OPENFOODFACTS">OpenFoodFacts</option>
        </select>
      </div>

      {/* Dropdown Results */}
      {results.length > 0 && (
        <div
          className="glass-panel"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            maxHeight: "320px",
            overflowY: "auto",
            zIndex: 100,
            boxShadow: "var(--shadow-lg)",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-surface)",
          }}
        >
          {results.map((item, idx) => (
            <div
              key={item.id || item.fdcId || idx}
              onClick={() => {
                onSelectFood(item);
                setQuery("");
                setResults([]);
              }}
              style={{
                padding: "0.75rem 1rem",
                borderBottom: "1px solid var(--border-color)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "background 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div>
                <strong style={{ fontSize: "0.9rem", display: "block" }}>{item.name}</strong>
                <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {item.brand ? `${item.brand} • ` : ""}
                  {Math.round(item.caloriesPer100g || item.calories || 0)} kcal • P: {item.proteinG || 0}g • C: {item.carbsG || 0}g • F: {item.fatG || 0}g
                </span>
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "var(--primary)",
                }}
              >
                {item.source}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
