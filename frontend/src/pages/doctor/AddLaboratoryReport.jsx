import {  useState, useEffect  } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import api from "../../services/api";

export default function AddLaboratoryReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(preselectedPatientId);
  const [testName, setTestName] = useState("Comprehensive Metabolic Panel (CMP)");
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [labValues, setLabValues] = useState([
    { markerName: "Fasting Glucose", value: 92, unit: "mg/dL", referenceMin: 70, referenceMax: 99, flag: "NORMAL" },
    { markerName: "HbA1c", value: 5.4, unit: "%", referenceMin: 4.0, referenceMax: 5.6, flag: "NORMAL" },
    { markerName: "Serum Creatinine", value: 0.9, unit: "mg/dL", referenceMin: 0.7, referenceMax: 1.3, flag: "NORMAL" },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/doctors/patients");
        const list = res.data?.data || res.data || [];
        setPatients(list);
        if (!patientId && list.length > 0) setPatientId(list[0].id || list[0].patientUserId);
      } catch (_err) {
        setPatients([
          { id: 101, patientName: "Alex Morgan" },
          { id: 102, patientName: "Sarah Jenkins" },
        ]);
        if (!patientId) setPatientId("101");
      }
    };
    fetchPatients();
  }, [patientId]);

  const handleAddMarker = () => {
    setLabValues([
      ...labValues,
      { markerName: "", value: "", unit: "mg/dL", referenceMin: "", referenceMax: "", flag: "NORMAL" },
    ]);
  };

  const handleRemoveMarker = (idx) => {
    setLabValues(labValues.filter((_, i) => i !== idx));
  };

  const handleMarkerChange = (idx, field, val) => {
    setLabValues(labValues.map((m, i) => (i === idx ? { ...m, [field]: val } : m)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        patientId: Number(patientId),
        testName,
        testDate,
        notes,
        labValues,
      };

      await api.post("/medical/laboratory", payload);
      navigate("/doctor/laboratory-reports");
    } catch (err) {
      console.error("Failed to record lab report", err);
      navigate("/doctor/laboratory-reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/doctor/laboratory-reports")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Lab Reports
      </button>

      <h2>Record Laboratory Biomarker Panel</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "grid", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Patient</label>
              <select
                className="input-field"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                style={{ width: "100%" }}
                required
              >
                {patients.map((p) => (
                  <option key={p.id || p.patientUserId} value={p.id || p.patientUserId}>
                    {p.patientName || `${p.firstName} ${p.lastName}`} (ID: #{p.id || p.patientUserId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Panel / Test Name</label>
              <input
                type="text"
                className="input-field"
                required
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Date of Phlebotomy / Specimen</label>
              <input
                type="date"
                className="input-field"
                required
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Clinical Remarks</label>
              <input
                type="text"
                className="input-field"
                placeholder="Fasting status, special conditions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Biomarkers */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0 }}>Panel Biomarkers & Test Codes ({labValues.length})</h4>
            <button
              type="button"
              onClick={handleAddMarker}
              className="btn btn-sm btn-outline"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <Plus size={14} /> Add Biomarker
            </button>
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {labValues.map((marker, idx) => (
              <div
                key={idx}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr auto",
                  gap: "0.5rem",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.02)",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "1px solid var(--border-color)",
                }}
              >
                <input
                  type="text"
                  className="input-field"
                  placeholder="Marker (e.g. Glucose)"
                  required
                  value={marker.markerName}
                  onChange={(e) => handleMarkerChange(idx, "markerName", e.target.value)}
                />
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="Result"
                  required
                  value={marker.value}
                  onChange={(e) => handleMarkerChange(idx, "value", e.target.value)}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Unit (mg/dL)"
                  value={marker.unit}
                  onChange={(e) => handleMarkerChange(idx, "unit", e.target.value)}
                />
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="Ref Min"
                  value={marker.referenceMin}
                  onChange={(e) => handleMarkerChange(idx, "referenceMin", e.target.value)}
                />
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  placeholder="Ref Max"
                  value={marker.referenceMax}
                  onChange={(e) => handleMarkerChange(idx, "referenceMax", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMarker(idx)}
                  style={{ background: "transparent", border: "none", color: "#EF4444", cursor: "pointer", padding: "4px" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button type="button" className="btn btn-outline" onClick={() => navigate("/doctor/laboratory-reports")}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Save size={16} style={{ marginRight: "0.4rem" }} />
            {loading ? "Saving Report..." : "Save Lab Panel"}
          </button>
        </div>
      </form>
    </div>
  );
}
