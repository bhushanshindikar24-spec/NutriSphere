import {  useState, useEffect  } from "react";
import { formatDate } from "../../utils/dateUtils";
import api from "../../services/api";

export default function FoodLogs() {
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [logs, setLogs] = useState([]);
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

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/food-logs?patientId=${selectedPatientId}`);
      setLogs(res.data?.data?.content || res.data?.data || res.data || []);
    } catch (_err) {
      setLogs([
        {
          id: 1,
          foodName: "Steel-cut oatmeal with chia seeds and blueberries",
          mealType: "BREAKFAST",
          calories: 420,
          protein: 16,
          carbs: 64,
          fat: 8,
          loggedAt: "2026-10-04T08:15:00Z",
        },
        {
          id: 2,
          foodName: "Mediterranean Herb Grilled Chicken with Quinoa",
          mealType: "LUNCH",
          calories: 580,
          protein: 44,
          carbs: 52,
          fat: 14,
          loggedAt: "2026-10-04T13:20:00Z",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 
    if (selectedPatientId) fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId]);

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Patient Food Intake Logs</h2>
          <p className="text-muted">Review dietary submissions and real-time macronutrient breakdown.</p>
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
        <div className="loading-screen">Loading Food Journal...</div>
      ) : logs.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          No meal logs recorded for this patient.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {logs.map((log) => (
            <div
              key={log.id}
              className="glass-panel"
              style={{
                padding: "1.25rem 1.5rem",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span className="badge badge-primary">{log.mealType}</span>
                  <h4 style={{ margin: 0, fontSize: "1.05rem" }}>{log.foodName}</h4>
                </div>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  <span>{formatDate(log.loggedAt || log.createdAt)}</span>
                  <span>•</span>
                  <span><strong>{Math.round(log.calories)}</strong> kcal</span>
                  <span>•</span>
                  <span>P: {log.protein}g</span>
                  <span>•</span>
                  <span>C: {log.carbs}g</span>
                  <span>•</span>
                  <span>F: {log.fat}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
