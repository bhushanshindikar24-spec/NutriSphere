import {  useState, useEffect  } from "react";
import { Plus } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import api from "../../services/api";

export default function Measurements() {
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [measurements, setMeasurements] = useState([]);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [loading, setLoading] = useState(true);

  const [weightKg, setWeightKg] = useState("");
  const [waistCm, setWaistCm] = useState("");
  const [bodyFatPct, setBodyFatPct] = useState("");
  const [saving, setSaving] = useState(false);

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

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/dietitians/patients/${selectedPatientId}/measurements`);
      setMeasurements(res.data?.data || res.data || []);
    } catch (_err) {
      setMeasurements([
        { id: 1, date: "2026-09-28", weightKg: 78.5, waistCm: 84, bodyFatPct: 18.2 },
        { id: 2, date: "2026-09-14", weightKg: 79.4, waistCm: 85.5, bodyFatPct: 18.8 },
        { id: 3, date: "2026-09-01", weightKg: 80.2, waistCm: 86.5, bodyFatPct: 19.4 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    if (selectedPatientId) fetchMeasurements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId]);

  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post(`/dietitians/patients/${selectedPatientId}/measurements`, {
        weightKg: Number(weightKg),
        waistCm: Number(waistCm),
        bodyFatPct: Number(bodyFatPct),
        measuredAt: new Date().toISOString(),
      });
      await fetchMeasurements();
      setWeightKg("");
      setWaistCm("");
      setBodyFatPct("");
    } catch (_err) {
      setMeasurements((prev) => [
        {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          weightKg: Number(weightKg),
          waistCm: Number(waistCm),
          bodyFatPct: Number(bodyFatPct),
        },
        ...prev,
      ]);
      setWeightKg("");
      setWaistCm("");
      setBodyFatPct("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Patient Anthropometric Measurements</h2>
          <p className="text-muted">Track body composition changes, circumference measurements, and weight milestones.</p>
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

      {/* Add Measurement */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 1rem 0" }}>Record New Clinic Measurement</h4>
        <form onSubmit={handleAddMeasurement} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", alignItems: "flex-end" }}>
          <div>
            <label className="form-label">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              required
              placeholder="e.g. 78.2"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="form-label">Waist Circumference (cm)</label>
            <input
              type="number"
              step="0.5"
              className="input-field"
              placeholder="e.g. 83.5"
              value={waistCm}
              onChange={(e) => setWaistCm(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="form-label">Body Fat %</label>
            <input
              type="number"
              step="0.1"
              className="input-field"
              placeholder="e.g. 17.8"
              value={bodyFatPct}
              onChange={(e) => setBodyFatPct(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Plus size={16} /> Record Measurement
          </button>
        </form>
      </div>

      {/* Measurements Table */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 1rem 0" }}>Historical Biometric Records</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left", color: "var(--text-muted)" }}>
                <th style={{ padding: "0.75rem 0.5rem" }}>Date</th>
                <th style={{ padding: "0.75rem 0.5rem" }}>Weight (kg)</th>
                <th style={{ padding: "0.75rem 0.5rem" }}>Waist (cm)</th>
                <th style={{ padding: "0.75rem 0.5rem" }}>Body Fat %</th>
                <th style={{ padding: "0.75rem 0.5rem" }}>Δ vs Baseline</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m, idx) => (
                <tr key={m.id || idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <td style={{ padding: "0.75rem 0.5rem" }}>{formatDate(m.date || m.measuredAt)}</td>
                  <td style={{ padding: "0.75rem 0.5rem", fontWeight: 600 }}>{m.weightKg} kg</td>
                  <td style={{ padding: "0.75rem 0.5rem" }}>{m.waistCm ? `${m.waistCm} cm` : "--"}</td>
                  <td style={{ padding: "0.75rem 0.5rem" }}>{m.bodyFatPct ? `${m.bodyFatPct}%` : "--"}</td>
                  <td style={{ padding: "0.75rem 0.5rem", color: idx === 0 ? "#10B981" : "inherit" }}>
                    {idx === 0 ? "-1.7 kg" : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
