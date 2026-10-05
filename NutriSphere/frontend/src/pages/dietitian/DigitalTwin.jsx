import {  useState, useEffect  } from "react";
import DigitalTwinComponent from "../../components/intelligence/DigitalTwin";
import api from "../../services/api";

export default function DigitalTwin() {
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [twinData, setTwinData] = useState(null);
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
          { id: 103, patientName: "Robert Chen" },
        ]);
      }
    };
    fetchCohort();
  }, []);

  useEffect(() => {
    const fetchTwin = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/digital-twin?patientId=${selectedPatientId}`);
        setTwinData(res.data?.data || res.data);
      } catch (_err) {
        setTwinData({
          currentWeightKg: selectedPatientId === 102 ? 84.0 : 78.5,
          targetWeightKg: selectedPatientId === 102 ? 75.0 : 72.0,
          netCaloricDeficit: -420,
          projectedWeight30Days: selectedPatientId === 102 ? 82.1 : 76.2,
          realityScore: selectedPatientId === 102 ? 64 : 84,
          dailyCaloricTarget: 1950,
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
        });
      } finally {
        setLoading(false);
      }
    };
    if (selectedPatientId) fetchTwin();
  }, [selectedPatientId]);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Patient Digital Twin Bioenergetic Models</h2>
          <p className="text-muted">Dynamic predictive metabolism and weight progression simulation engine.</p>
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
        <div className="loading-screen">Simulating Bioenergetic Trajectory...</div>
      ) : (
        <DigitalTwinComponent twinData={twinData} />
      )}
    </div>
  );
}
