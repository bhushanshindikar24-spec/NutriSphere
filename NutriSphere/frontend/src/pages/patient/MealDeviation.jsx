import {  useState, useEffect  } from "react";
import MealDeviationForm from "../../components/nutrition/MealDeviationForm";
import BarrierCard from "../../components/intelligence/BarrierCard";
import { barrierService } from "../../services/barrierService";

export default function MealDeviation() {
  const [barriers, setBarriers] = useState([]);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const loadBarriers = async () => {
    try {
      const res = await barrierService.getMyBarriers();
      setBarriers(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load barriers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    loadBarriers();
  }, []);

  const handleSubmit = async (barrierData) => {
    try {
      await barrierService.reportBarrier(barrierData);
      setSuccessMsg("Barrier reported. Your Dietitian and Adaptive Engine will adjust your recommendations!");
      await loadBarriers();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Failed to report barrier", err);
      alert("Failed to record barrier report.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <h2>Report Adherence Barrier</h2>
        <p className="text-muted">
          Encountered an obstacle sticking to your diet plan? Transparent barrier reporting allows NutriSphere's Adaptive Engine to re-calibrate meal plans to fit your real life.
        </p>
      </div>

      {successMsg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          {successMsg}
        </div>
      )}

      <MealDeviationForm onSubmit={handleSubmit} />

      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 1rem 0" }}>Your Past Adherence Logs</h4>
        {barriers.length === 0 ? (
          <p className="text-muted" style={{ textAlign: "center", margin: 0, padding: "1rem" }}>
            No adherence barriers reported. Excellent consistency!
          </p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {barriers.map((b, idx) => (
              <BarrierCard key={b.id || idx} barrier={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
