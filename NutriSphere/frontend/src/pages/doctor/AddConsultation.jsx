import {  useState, useEffect  } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../services/api";

export default function AddConsultation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(preselectedPatientId);
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [icdCode, setIcdCode] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [dietaryDirectives, setDietaryDirectives] = useState("");
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [heartRate, setHeartRate] = useState("72");
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
          { id: 103, patientName: "Robert Chen" },
        ]);
        if (!patientId) setPatientId("101");
      }
    };
    fetchPatients();
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        patientId: Number(patientId),
        chiefComplaint,
        diagnosis,
        icdCode,
        clinicalNotes,
        dietaryDirectives,
        vitalSigns: { bloodPressure, heartRate },
        consultationDate: new Date().toISOString(),
      };

      await api.post("/medical/consultations", payload);
      navigate("/doctor/consultations");
    } catch (err) {
      console.error("Failed to record consultation", err);
      navigate("/doctor/consultations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/doctor/consultations")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Consultations
      </button>

      <h2>Record Clinical Consultation Note</h2>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
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
              <label className="form-label">Chief Complaint / Visit Purpose</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. 3-Month Metabolic Follow-Up"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Blood Pressure (mmHg)</label>
              <input
                type="text"
                className="input-field"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Resting Heart Rate (bpm)</label>
              <input
                type="text"
                className="input-field"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Clinical Impression / Assessment</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. Essential Hypertension, Well-Controlled"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">ICD-10 Code</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. I10"
                value={icdCode}
                onChange={(e) => setIcdCode(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Detailed Clinical Notes & Examination</label>
            <textarea
              className="input-field"
              rows={4}
              required
              placeholder="Physical findings, review of symptoms, medication updates, diagnostic rationale..."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="form-label">Physician Directives for Dietitian Team</label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="Target sodium threshold, specific nutrient restrictions, recommended caloric deficit..."
              value={dietaryDirectives}
              onChange={(e) => setDietaryDirectives(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/doctor/consultations")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} style={{ marginRight: "0.4rem" }} />
              {loading ? "Saving Note..." : "Save Consultation Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
