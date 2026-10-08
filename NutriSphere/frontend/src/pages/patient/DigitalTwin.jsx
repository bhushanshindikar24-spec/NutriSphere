import { useEffect, useState } from "react";
import DigitalTwinComponent from "../../components/intelligence/DigitalTwin";
import RealityScoreGauge from "../../components/intelligence/RealityScoreGauge";
import RealityScoreBreakdown from "../../components/intelligence/RealityScoreBreakdown";
import { digitalTwinService } from "../../services/digitalTwinService";

export default function DigitalTwin() {
  const [twinData, setTwinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadTwin = async () => {
      try {
        const res = await digitalTwinService.getMyDigitalTwin();
        if (!cancelled) {
          const data = res.data?.data || res.data;
          setTwinData(data || null);
          setError(data ? "" : "Digital Twin data is not available yet.");
        }
      } catch (_err) {
        if (!cancelled) {
          setTwinData(null);
          setError("Unable to load your Digital Twin. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadTwin();
    return () => { cancelled = true; };
  }, []);

  const handleRunSimulation = async () => {
    setSimulating(true);
    setError("");
    try {
      const res = await digitalTwinService.recalculateProjection();
      const data = res.data?.data || res.data;
      if (!data) {
        throw new Error("No Digital Twin data returned");
      }
      setTwinData(data);
    } catch (_err) {
      setError("Unable to recalculate the Digital Twin.");
    } finally {
      setSimulating(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading Nutrition Digital Twin...</div>;

  if (!twinData) {
    return (
      <div className="glass-panel" style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <h2>Nutrition Digital Twin</h2>
        <p className="text-muted">{error || "Digital Twin data is not available yet."}</p>
      </div>
    );
  }

  const realityScore = twinData.realityScore ?? twinData.latestRealityScore;
  const interpretation = twinData.realityScoreInterpretation;
  const dimensions = twinData.dimensionScores || {};

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <h2>Nutrition Digital Twin</h2>
        <p className="text-muted">
          A data-driven nutrition profile updated from your recorded intake, hydration, approved plan targets, barriers, and Reality Score.
        </p>
      </div>

      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <DigitalTwinComponent
        twinData={twinData}
        onRunSimulation={handleRunSimulation}
        isSimulating={simulating}
      />

      {realityScore != null && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <RealityScoreGauge
            score={realityScore}
            interpretation={interpretation || "Calculated from available data"}
            dimensionScores={dimensions}
          />
          <RealityScoreBreakdown
            score={realityScore}
            breakdown={dimensions}
          />
        </div>
      )}
    </div>
  );
}
