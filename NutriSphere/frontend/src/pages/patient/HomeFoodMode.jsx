import {  useState, useEffect  } from "react";
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

  const loadData = async () => {
    try {
      const invRes = await homeFoodService.getInventory();
      const items = invRes.data?.data || invRes.data || [];
      setInventory(items);

      const suggRes = await homeFoodService.getMealSuggestions();
      setSuggestions(suggRes.data?.data || suggRes.data || []);
    } catch (err) {
      console.error("Failed to load home food data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleAddItem = async (item) => {
    try {
      await homeFoodService.addInventoryItem(item);
      await loadData();
    } catch (err) {
      console.error("Failed to add inventory item", err);
      // Local optimistic update
      setInventory((prev) => [...prev, { ...item, id: Date.now() }]);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await homeFoodService.removeInventoryItem(itemId);
      await loadData();
    } catch (_err) {
      setInventory((prev) => prev.filter((i) => i.id !== itemId));
    }
  };

  const handleGenerateMore = async () => {
    setGenerating(true);
    try {
      const res = await homeFoodService.generateSuggestions({
        availableIngredients: inventory.map((i) => i.foodName || i.name),
      });
      setSuggestions(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to regenerate suggestions", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    try {
      await foodLogService.logFood({
        foodName: suggestion.mealName,
        calories: suggestion.estimatedCalories || 450,
        protein: suggestion.estimatedProteinG || 25,
        carbs: suggestion.estimatedCarbsG || 55,
        fat: suggestion.estimatedFatG || 14,
        mealType: suggestion.mealType || "LUNCH",
      });
      setSuccessMsg(`Logged "${suggestion.mealName}" to your daily journal!`);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Failed to log suggested meal", err);
      alert("Failed to log meal.");
    }
  };

  if (loading) return <div className="loading-screen">Loading Home Food Pantry...</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <h2>Home Food Mode</h2>
        <p className="text-muted">
          Manage your available kitchen pantry items. The AI automatically composes nutritious, home-cooked meals tailored to your diet plan.
        </p>
      </div>

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
