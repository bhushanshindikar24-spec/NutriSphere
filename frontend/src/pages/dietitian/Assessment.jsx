import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Calendar } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import api from "../../services/api";

export default function Assessment() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const res = await api.get("/dietitians/assessments");
        setAssessments(res.data?.data || res.data || []);
      } catch (_err) {
        setAssessments([
          {
            id: 1,
            patientName: "Alex Morgan",
            patientId: 101,
            assessmentType: "INITIAL_COMPREHENSIVE",
            date: "2026-09-01",
            bmi: 24.8,
            weightKg: 78.5,
            waistCm: 84,
            clinicalDiagnosis: "Mild Dyslipidemia, Inadequate dietary fiber intake.",
            recommendations: "Shift to Mediterranean anti-inflammatory protocol with 30g+ daily dietary fiber.",
          },
          {
            id: 2,
            patientName: "Sarah Jenkins",
            patientId: 102,
            assessmentType: "FOLLOW_UP_REASSESSMENT",
            date: "2026-09-15",
            bmi: 29.4,
            weightKg: 84.0,
            waistCm: 92,
            clinicalDiagnosis: "Pre-diabetes with impaired fasting glucose (108 mg/dL).",
            recommendations: "Strict low glycemic index food matrix with evening carbohydrate taper.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  if (loading) return <div className="loading-screen">Loading Nutritional Assessments...</div>;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Clinical Nutritional Assessments</h2>
          <p className="text-muted">Perform comprehensive dietary assessments, anthropometric analyses, and follow-up reviews.</p>
        </div>
        <button
          onClick={() => navigate("/dietitian/new-assessment")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={16} /> New Clinical Assessment
        </button>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {assessments.map((a) => (
          <div
            key={a.id}
            className="glass-panel"
            style={{
              padding: "1.5rem",
              borderRadius: "var(--radius-lg)",
              borderLeft: "4px solid var(--primary)",
              display: "grid",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: "0.25rem", display: "inline-block" }}>
                  {a.assessmentType.replace(/_/g, " ")}
                </span>
                <h3 style={{ margin: "0.25rem 0", fontSize: "1.15rem" }}>
                  Patient: {a.patientName} (ID: #{a.patientId})
                </h3>
              </div>
              <span className="text-muted" style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Calendar size={14} /> {formatDate(a.date)}
              </span>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", background: "rgba(255, 255, 255, 0.02)", padding: "0.75rem", borderRadius: "6px" }}>
              <span>Weight: <strong>{a.weightKg} kg</strong></span>
              <span>•</span>
              <span>BMI: <strong>{a.bmi}</strong></span>
              <span>•</span>
              <span>Waist: <strong>{a.waistCm} cm</strong></span>
            </div>

            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              <strong>Clinical Finding:</strong> {a.clinicalDiagnosis}
            </p>

            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-muted)" }}>
              <strong>Protocol Prescribed:</strong> {a.recommendations}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
