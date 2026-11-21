import {  useState, useEffect  } from "react";
import api from "../../services/api";
import PlannedVsActualComponent from "../../components/nutrition/PlannedVsActual";
import NutritionProgress from "../../components/nutrition/NutritionProgress";
import { formatISODate } from "../../utils/dateUtils";
import { toPlannedVsActual } from "../../utils/dailyReport";

export default function PlannedVsActual() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(formatISODate(new Date()));

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/food-logs/daily-report?date=${selectedDate}`);
        setData(toPlannedVsActual(res.data?.data || res.data));
      } catch (err) {
        console.error("Failed to load planned vs actual", err);
        setData(null);
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
            targetCalories={data.planned?.calories || 0}
            consumedMacros={data.actual || {}}
            targetMacros={data.planned || {}}
            waterConsumedMl={data.actual?.waterMl || 0}
            waterTargetMl={data.planned?.waterMl || 0}
          />

          <PlannedVsActualComponent comparison={data.report} />
        </>
      ) : (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
          No planned diet or logs found for this date.
        </div>
      )}
    </div>
  );
}
