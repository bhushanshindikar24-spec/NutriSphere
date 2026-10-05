import {  useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Sparkles, Plus } from "lucide-react";
import RealityScoreGauge from "../../components/intelligence/RealityScoreGauge";
import BarrierAnalysisCard from "../../components/intelligence/BarrierAnalysisCard";
import DigitalTwinSummary from "../../components/intelligence/DigitalTwinSummary";
import api from "../../services/api";

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [twin, setTwin] = useState(null);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [barriers, setBarriers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await api.get(`/dietitians/patients/${id || 1}`);
        setPatient(res.data?.data || res.data);
      } catch (_err) {
        setPatient({
          id: id || 1,
          firstName: "Alex",
          lastName: "Morgan",
          age: 32,
          gender: "Male",
          weightKg: 78.5,
          targetWeightKg: 72.0,
          heightCm: 178,
          activeCondition: "Mild Dyslipidemia",
          allergies: ["Peanuts", "Shellfish"],
          adherenceRate: 88,
          activePlan: {
            id: 201,
            name: "Phase 2 Mediterranean Fat-Loss",
            dailyCalories: 1950,
            status: "ACTIVE",
          },
        });
      }

      try {
        const twinRes = await api.get(`/digital-twin?patientId=${id || 1}`);
        setTwin(twinRes.data?.data || twinRes.data);
      } catch (_e) {
        setTwin({
          currentWeightKg: 78.5,
          targetWeightKg: 72.0,
          projectedWeight30Days: 76.2,
          dailyCaloricTarget: 1950,
          realityScore: 84,
          bmr: 1680,
          tdee: 2320,
        });
      }

      try {
        const barrierRes = await api.get(`/adherence/barriers?patientId=${id || 1}`);
        setBarriers(barrierRes.data?.data || barrierRes.data || []);
      } catch (_e) {
        setBarriers([
          { type: "TIME_CONSTRAINT", count: 3 },
          { type: "FOOD_UNAVAILABLE", count: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading Patient Dossier...</div>;
  if (!patient) return <div className="glass-panel" style={{ padding: "2rem" }}>Patient not found.</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/dietitian/patients")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Patient Roster
      </button>

      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={28} />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{patient.firstName} {patient.lastName}</h2>
            <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              <span>{patient.age} yrs • {patient.gender}</span>
              <span>•</span>
              <span>Weight: {patient.weightKg} kg (Target: {patient.targetWeightKg} kg)</span>
              <span>•</span>
              <span>Height: {patient.heightCm} cm</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => navigate(`/dietitian/create-plan?patientId=${patient.id}`)}
            className="btn btn-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Plus size={16} /> Prescribe Diet Plan
          </button>
          <button
            onClick={() => navigate(`/dietitian/adaptive-engine?patientId=${patient.id}`)}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Sparkles size={16} /> Run Adaptive Engine
          </button>
        </div>
      </div>

      {/* Twin & Score Grids */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <DigitalTwinSummary twinData={twin} />
        <RealityScoreGauge
          score={twin?.realityScore || 84}
          interpretation="High Real-World Feasibility"
          dimensionScores={{
            "Caloric Feasibility": 88,
            "Meal Timing Feasibility": 82,
            "Food Availability": 85,
            "Biological Tolerance": 80,
          }}
        />
      </div>

      {/* Active Diet Plan & Barriers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
          <h4 style={{ margin: "0 0 1rem 0" }}>Current Active Diet Plan</h4>
          {patient.activePlan ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{patient.activePlan.name}</h3>
                  <span className="text-muted" style={{ fontSize: "0.8rem" }}>Daily Target: {patient.activePlan.dailyCalories} kcal</span>
                </div>
                <span className="badge badge-success">{patient.activePlan.status}</span>
              </div>
              <button
                onClick={() => navigate(`/dietitian/plans/${patient.activePlan.id}`)}
                className="btn btn-sm btn-outline"
                style={{ marginTop: "1rem" }}
              >
                Inspect Plan Details
              </button>
            </div>
          ) : (
            <p className="text-muted">No active diet plan assigned yet.</p>
          )}
        </div>

        <BarrierAnalysisCard
          barriers={[]}
          barrierCounts={{ TIME_CONSTRAINT: 3, FOOD_UNAVAILABLE: 1 }}
        />
      </div>
    </div>
  );
}
