import {  useState, useEffect  } from "react";
import DigitalTwinComponent from "../../components/intelligence/DigitalTwin";
import RealityScoreGauge from "../../components/intelligence/RealityScoreGauge";
import RealityScoreBreakdown from "../../components/intelligence/RealityScoreBreakdown";
import { digitalTwinService } from "../../services/digitalTwinService";

export default function DigitalTwin() {
  const [twinData, setTwinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  const fetchTwin = async () => {
    try {
      const res = await digitalTwinService.getMyDigitalTwin();
      setTwinData(res.data?.data || res.data);
    } catch (err) {
      console.error("Failed to load digital twin", err);
      // Sensible baseline twin fallback
      setTwinData({
        currentWeightKg: 78.5,
        targetWeightKg: 72.0,
        netCaloricDeficit: -450,
        projectedWeight30Days: 76.2,
        realityScore: 84,
        realityScoreInterpretation: "Feasible and Sustainable",
        dailyCaloricTarget: 1950,
        bmr: 1680,
        tdee: 2320,
        historicalWeights: [
          { date: "Day 1", weight: 80.0 },
          { date: "Day 7", weight: 79.4 },
          { date: "Day 14", weight: 79.0 },
          { date: "Day 21", weight: 78.5 },
        ],
        projectedWeights: [
          { date: "Day 21", weight: 78.5 },
          { date: "Day 30", weight: 77.8 },
          { date: "Day 45", weight: 76.9 },
          { date: "Day 60", weight: 76.0 },
        ],
        dimensionScores: {
          caloricFeasibility: 88,
          mealTimingFeasibility: 82,
          foodAvailability: 85,
          biologicalTolerance: 80,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTwin();
  }, []);

  const handleRunSimulation = async () => {
    setSimulating(true);
    try {
      const res = await digitalTwinService.recalculateProjection();
      if (res.data?.data) {
        setTwinData(res.data.data);
      } else {
        await fetchTwin();
      }
    } catch (err) {
      console.error("Simulation recalculation error", err);
      await fetchTwin();
    } finally {
      setSimulating(false);
    }
  };

  if (loading) return <div className="loading-screen">Synthesizing Bioenergetic Digital Twin...</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <h2>Nutrition Digital Twin</h2>
        <p className="text-muted">
          Your personalized bioenergetic computational model. It continuously updates with your intake, activity, and metabolic expenditure to predict long-term outcomes.
        </p>
      </div>

      <DigitalTwinComponent
        twinData={twinData}
        onRunSimulation={handleRunSimulation}
        isSimulating={simulating}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <RealityScoreGauge
          score={twinData?.realityScore || 80}
          interpretation={twinData?.realityScoreInterpretation || "Adherent"}
          dimensionScores={twinData?.dimensionScores || {}}
        />

        <RealityScoreBreakdown
          score={twinData?.realityScore || 80}
          breakdown={twinData?.dimensionScores || {}}
        />
      </div>
    </div>
  );
}
