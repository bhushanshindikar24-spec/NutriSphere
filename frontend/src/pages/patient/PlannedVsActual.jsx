import {  useState, useEffect  } from "react";
import api from "../../services/api";
import PlannedVsActualComponent from "../../components/nutrition/PlannedVsActual";
import NutritionProgress from "../../components/nutrition/NutritionProgress";
import { formatISODate } from "../../utils/dateUtils";

export default function PlannedVsActual() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(formatISODate(new Date()));

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/nutrition/planned-vs-actual?date=${selectedDate}`);
        setData(res.data?.data || res.data);
      } catch (err) {
        console.error("Failed to load planned vs actual", err);
        // Fallback calculation using digital-twin / diet-plan if specific endpoint absent
        try {
          const twinRes = await api.get("/digital-twin");
          const twin = twinRes.data?.data;
          setData({
            date: selectedDate,
            planned: {
              calories: twin?.targetCalories || 2000,
              proteinG: twin?.targetProteinG || 120,
              carbsG: twin?.targetCarbsG || 220,
              fatG: twin?.targetFatG || 65,
              waterMl: twin?.targetWaterMl || 2500,
            },
            actual: {
              calories: twin?.avgDailyCalories || 0,
              proteinG: twin?.avgDailyProteinG || 0,
              carbsG: twin?.avgDailyCarbsG || 0,
              fatG: twin?.avgDailyFatG || 0,
              waterMl: twin?.avgDailyWaterMl || 0,
            },
            meals: [],
          });
        } catch (_e) {
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [selectedDate]);

  if (loading) return <div className="loading-screen">Loading Nutrition Comparison...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Planned vs Actual Nutrition</h2>
          <p className="text-muted">Compare your target dietary prescriptions against logged food intake.</p>
        </div>
        <input
          type="date"
          className="input-field"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {data ? (
        <>
          <NutritionProgress
            consumedCalories={data.actual?.calories || 0}
            targetCalories={data.planned?.calories || 2000}
            consumedMacros={data.actual || {}}
            targetMacros={data.planned || {}}
            waterConsumedMl={data.actual?.waterMl || 0}
            waterTargetMl={data.planned?.waterMl || 2500}
          />

          <PlannedVsActualComponent planned={data.planned} actual={data.actual} meals={data.meals} />
        </>
      ) : (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
          No planned diet or logs found for this date.
        </div>
      )}
    </div>
  );
}
