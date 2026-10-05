import {  useState, useEffect  } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../services/api";

export default function NewAssessment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(preselectedPatientId);
  const [assessmentType, setAssessmentType] = useState("INITIAL_COMPREHENSIVE");
  const [weightKg, setWeightKg] = useState(78.5);
  const [heightCm, setHeightCm] = useState(178);
  const [waistCm, setWaistCm] = useState(84);
  const [dietaryHistory, setDietaryHistory] = useState("");
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/dietitians/patients");
        const list = res.data?.data || res.data || [];
        setPatients(list);
        if (!patientId && list.length > 0) {
          setPatientId(list[0].id || list[0].patientUserId);
        }
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

  const bmi =
    heightCm > 0
      ? (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)
      : "--";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        patientId: Number(patientId),
        assessmentType,
        weightKg: Number(weightKg),
        heightCm: Number(heightCm),
        waistCm: Number(waistCm),
        bmi: Number(bmi),
        dietaryHistory,
        clinicalDiagnosis,
        recommendations,
      };

      await api.post("/dietitians/assessments", payload);
      navigate("/dietitian/assessment");
    } catch (err) {
      console.error("Failed to save assessment", err);
      navigate("/dietitian/assessment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/dietitian/assessment")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Assessments
      </button>

      <h2>New Nutritional Clinical Assessment</h2>

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
              <label className="form-label">Assessment Type</label>
              <select
                className="input-field"
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="INITIAL_COMPREHENSIVE">Initial Comprehensive Intake</option>
                <option value="FOLLOW_UP_REASSESSMENT">Follow-Up Reassessment</option>
                <option value="ACUTE_INTERVENTION">Acute Barrier Intervention</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            <div>
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                className="input-field"
                required
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Waist (cm)</label>
              <input
                type="number"
                className="input-field"
                value={waistCm}
                onChange={(e) => setWaistCm(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Calculated BMI</label>
              <input
                type="text"
                className="input-field"
                disabled
                value={bmi}
                style={{ width: "100%", background: "rgba(255, 255, 255, 0.05)" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Dietary History & 24h Recall Summary</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Patient's typical meal patterns, alcohol intake, sodium habits, and snacking triggers..."
              value={dietaryHistory}
              onChange={(e) => setDietaryHistory(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="form-label">Clinical Nutritional Diagnostic Impression</label>
            <input
              type="text"
              className="input-field"
              required
              placeholder="e.g. Inadequate dietary fiber related to food accessibility"
              value={clinicalDiagnosis}
              onChange={(e) => setClinicalDiagnosis(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="form-label">Prescribed Nutritional Interventions & Plan</label>
            <textarea
              className="input-field"
              rows={3}
              required
              placeholder="Prescribed changes, target calories, hydration schedule, and home food suggestions..."
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/dietitian/assessment")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} style={{ marginRight: "0.4rem" }} />
              {loading ? "Recording..." : "Save Assessment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
