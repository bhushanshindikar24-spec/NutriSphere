import { useEffect, useState } from "react";
import { homeFoodService } from "../../services/homeFoodService";
import { foodLogService } from "../../services/foodLogService";
import HomeFoodInventory from "../../components/intelligence/HomeFoodInventory";
import HomeFoodSuggestions from "../../components/intelligence/HomeFoodSuggestions";

export default function HomeFoodMode() {
  const [inventory, setInventory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [invRes, suggRes] = await Promise.all([
          homeFoodService.getInventory(),
          homeFoodService.getMealSuggestions(),
        ]);
        if (!cancelled) {
          const items = invRes.data?.data || invRes.data || [];
          const generated = suggRes.data?.data || suggRes.data || [];
          setInventory(Array.isArray(items) ? items : []);
          setSuggestions(Array.isArray(generated) ? generated : []);
          setError("");
        }
      } catch (_err) {
        if (!cancelled) {
          setError("Unable to load Home Food data. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, []);

  const loadData = async () => {
    try {
      const [invRes, suggRes] = await Promise.all([
        homeFoodService.getInventory(),
        homeFoodService.getMealSuggestions(),
      ]);
      setInventory(invRes.data?.data || invRes.data || []);
      setSuggestions(suggRes.data?.data || suggRes.data || []);
      setError("");
    } catch (_err) {
      setError("Unable to refresh Home Food data.");
    }
  };

  const handleAddItem = async (item) => {
    try {
      setError("");
      await homeFoodService.addInventoryItem(item);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add the pantry item.");
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setError("");
      await homeFoodService.removeInventoryItem(itemId);
      await loadData();
    } catch (_err) {
      setError("Unable to remove the pantry item.");
    }
  };

  const handleGenerateMore = async () => {
    setGenerating(true);
    setError("");
    try {
      const res = await homeFoodService.generateSuggestions({
        availableIngredients: inventory.map((i) => i.foodName || i.name),
      });
      const generated = res.data?.data || res.data || [];
      setSuggestions(Array.isArray(generated) ? generated : []);
    } catch (_err) {
      setError("Unable to generate meal suggestions.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    if (!suggestion.estimatedCalories || suggestion.estimatedCalories <= 0) {
      setError("This suggestion does not have enough linked food data to log accurate nutrition values.");
      return;
    }

    try {
      setError("");
      await foodLogService.logFood({
        foodName: suggestion.mealName,
        calories: suggestion.estimatedCalories,
        proteinG: suggestion.estimatedProteinG,
        mealType: suggestion.mealType || "LUNCH",
        logDate: new Date().toISOString().slice(0, 10),
        logTime: new Date().toTimeString().slice(0, 8),
        notes: "Logged from Home Food Mode; nutrition values are based on linked food data.",
      });
      setSuccessMsg(`Logged "${suggestion.mealName}" using the available nutrition data.`);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (_err) {
      setError("Failed to log the suggested meal.");
    }
  };

  if (loading) return <div className="loading-screen">Loading Home Food Pantry...</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <h2>Home Food Mode</h2>
        <p className="text-muted">
          Use available pantry items to generate heuristic meal suggestions against your approved plan and recorded food data.
        </p>
      </div>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      {successMsg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          {successMsg}
        </div>
      )}

      <HomeFoodInventory
        items={inventory}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />

      <HomeFoodSuggestions
        suggestions={suggestions}
        onSelectSuggestion={handleSelectSuggestion}
        onGenerateMore={handleGenerateMore}
        isLoading={generating}
      />
    </div>
  );
}
