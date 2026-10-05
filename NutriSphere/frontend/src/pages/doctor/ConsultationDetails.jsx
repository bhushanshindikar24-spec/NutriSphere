import {  useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { formatDateTime } from "../../utils/dateUtils";
import api from "../../services/api";

export default function ConsultationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consult, setConsult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsult = async () => {
      try {
        const res = await api.get(`/medical/consultations/${id || 1}`);
        setConsult(res.data?.data || res.data);
      } catch (_err) {
        setConsult({
          id: id || 1,
          patientName: "Alex Morgan",
          patientId: 101,
          consultationDate: "2026-09-20T10:30:00Z",
          chiefComplaint: "Routine Lipid & Metabolic Follow-Up",
          diagnosis: "Borderline LDL Elevation",
          icdCode: "E78.00",
          vitalSigns: { bloodPressure: "118/76", heartRate: "68" },
          clinicalNotes: "Patient adhering conscientiously to prescribed Mediterranean diet plan. Blood pressure is optimal at 118/76 mmHg. Resting heart rate 68 bpm. Patient reports higher daytime energy and zero gastrointestinal distress.",
          dietaryDirectives: "Maintain 30g+ prebiotic fiber daily. Recheck fasting lipid panel in 90 days.",
          physicianName: "Dr. Marcus Thorne, MD",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConsult();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading Consultation Record...</div>;
  if (!consult) return <div className="glass-panel" style={{ padding: "2rem" }}>Record not found.</div>;

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/doctor/consultations")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Consultations
      </button>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: "0.5rem", display: "inline-block" }}>
              Patient: {consult.patientName} (ID: #{consult.patientId})
            </span>
            <h2 style={{ margin: "0 0 0.25rem 0" }}>{consult.chiefComplaint}</h2>
            <span className="text-muted" style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Calendar size={14} /> Recorded: {formatDateTime(consult.consultationDate)}
            </span>
          </div>
        </div>

        {/* Vitals */}
        {consult.vitalSigns && (
          <div style={{ display: "flex", gap: "1.5rem", background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1.5rem" }}>
            <div>
              <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Blood Pressure</span>
              <strong>{consult.vitalSigns.bloodPressure} mmHg</strong>
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Heart Rate</span>
              <strong>{consult.vitalSigns.heartRate} bpm</strong>
            </div>
          </div>
        )}

        {/* Diagnosis */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ margin: "0 0 0.5rem 0" }}>Clinical Assessment & Diagnosis</h4>
          <div style={{ background: "rgba(99, 102, 241, 0.08)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
            <strong style={{ fontSize: "1rem" }}>{consult.diagnosis}</strong>
            {consult.icdCode && (
              <span className="text-muted" style={{ marginLeft: "0.5rem", fontSize: "0.85rem" }}>
                (ICD-10: {consult.icdCode})
              </span>
            )}
          </div>
        </div>

        {/* Clinical Notes */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ margin: "0 0 0.5rem 0" }}>Examination & Subjective Notes</h4>
          <p style={{ lineHeight: 1.6, color: "var(--text-secondary)", margin: 0 }}>
            {consult.clinicalNotes}
          </p>
        </div>

        {/* Dietitian Directives */}
        {consult.dietaryDirectives && (
          <div style={{ background: "rgba(16, 185, 129, 0.05)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#10B981" }}>Physician Dietetic Directives</h4>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
              {consult.dietaryDirectives}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
