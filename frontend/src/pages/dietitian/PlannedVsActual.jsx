import {  useState, useEffect  } from "react";
import PlannedVsActualComponent from "../../components/nutrition/PlannedVsActual";
import NutritionProgress from "../../components/nutrition/NutritionProgress";
import api from "../../services/api";
import { toPlannedVsActual } from "../../utils/dailyReport";

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
        if (list.length > 0) setSelectedPatientId(list[0].id || list[0].patientUserId);
      } catch (_err) {
        setPatients([]);
      }
    };
    fetchCohort();
  }, []);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/food-logs/daily-report?patientUserId=${selectedPatientId}`);
        setData(toPlannedVsActual(res.data?.data || res.data));
      } catch (_err) {
        setData(null);
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
            targetCalories={data.planned?.calories || 0}
            consumedMacros={data.actual || {}}
            targetMacros={data.planned || {}}
            waterConsumedMl={data.actual?.waterMl || 0}
            waterTargetMl={data.planned?.waterMl || 0}
          />
          <PlannedVsActualComponent comparison={data.report} />
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>No logs recorded.</div>
      )}
    </div>
  );
}
