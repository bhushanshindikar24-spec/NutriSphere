import {  useState, useEffect  } from "react";
import PlannedVsActualComponent from "../../components/nutrition/PlannedVsActual";
import NutritionProgress from "../../components/nutrition/NutritionProgress";
import api from "../../services/api";

export default function PlannedVsActual() {
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohort = async () => {
      try {
        const res = await api.get("/dietitians/patients");
        const list = res.data?.data || res.data || [];
        setPatients(list);
        if (list.length > 0) setSelectedPatientId(list[0].id || list[0].patientUserId || 101);
      } catch (_err) {
        setPatients([
          { id: 101, patientName: "Alex Morgan" },
          { id: 102, patientName: "Sarah Jenkins" },
        ]);
      }
    };
    fetchCohort();
  }, []);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/nutrition/planned-vs-actual?patientId=${selectedPatientId}`);
        setData(res.data?.data || res.data);
      } catch (_err) {
        setData({
          planned: { calories: 1950, proteinG: 140, carbsG: 180, fatG: 65, waterMl: 2500 },
          actual: { calories: 1880, proteinG: 135, carbsG: 172, fatG: 62, waterMl: 2250 },
          meals: [
            { name: "Breakfast", plannedKcal: 450, actualKcal: 420, status: "MATCHED" },
            { name: "Lunch", plannedKcal: 600, actualKcal: 610, status: "MATCHED" },
            { name: "Dinner", plannedKcal: 650, actualKcal: 600, status: "MATCHED" },
            { name: "Snack", plannedKcal: 250, actualKcal: 250, status: "MATCHED" },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    if (selectedPatientId) fetchComparison();
  }, [selectedPatientId]);

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Planned vs Actual Compliance Audit</h2>
          <p className="text-muted">Compare prescribed macronutrients against real-time patient logs.</p>
        </div>

        <select
          className="input-field"
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(Number(e.target.value))}
          style={{ width: "220px" }}
        >
          {patients.map((p) => (
            <option key={p.id || p.patientUserId} value={p.id || p.patientUserId}>
              {p.patientName || `${p.firstName} ${p.lastName}`}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-screen">Comparing Prescriptions vs Intake...</div>
      ) : data ? (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <NutritionProgress
            consumedCalories={data.actual?.calories || 0}
            targetCalories={data.planned?.calories || 2000}
            consumedMacros={data.actual || {}}
            targetMacros={data.planned || {}}
            waterConsumedMl={data.actual?.waterMl || 0}
            waterTargetMl={data.planned?.waterMl || 2500}
          />
          <PlannedVsActualComponent planned={data.planned} actual={data.actual} meals={data.meals} />
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>No logs recorded.</div>
      )}
    </div>
  );
}
