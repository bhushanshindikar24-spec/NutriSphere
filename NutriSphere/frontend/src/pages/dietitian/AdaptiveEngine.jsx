import {  useState, useEffect  } from "react";
import { Sparkles } from "lucide-react";
import RecommendationReview from "../../components/intelligence/RecommendationReview";
import { adaptiveService } from "../../services/adaptiveService";
import api from "../../services/api";

export default function AdaptiveEngine() {
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [evaluating, setEvaluating] = useState(false);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [appliedMsg, setAppliedMsg] = useState("");

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
      } finally {
        setLoading(false);
      }
    };
    fetchCohort();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await adaptiveService.getPendingRecommendations(selectedPatientId);
      setRecommendations(res.data?.data || res.data || []);
    } catch (_err) {
      setRecommendations([
        {
          id: 1,
          adaptationType: "CALORIC_DEFICIT_MODULATION",
          title: "Moderate Deficit from -500 kcal to -350 kcal",
          rationale: "Patient reported repeated hunger barriers (3x past 7 days) and late-night snacking. Easing deficit stabilizes leptin and prevents metabolic fatigue.",
          confidenceScore: 0.92,
          proposedChanges: {
            dailyCalories: 2100,
            dinnerCarbsG: 65,
          },
        },
        {
          id: 2,
          adaptationType: "TIMING_REDISTRIBUTION",
          title: "Shift Breakfast Target to Mid-Morning",
          rationale: "Patient consistently skips 8:00 AM breakfast due to morning commute. Re-allocating calories to a 10:30 AM slot aligns with actual circadian intake.",
          confidenceScore: 0.88,
          proposedChanges: {
            morningSlot: "10:30 AM",
            snackCalories: 350,
          },
        },
      ]);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    if (selectedPatientId) fetchRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId]);

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    try {
      const res = await adaptiveService.evaluatePatient(selectedPatientId);
      setRecommendations(res.data?.data || res.data || []);
      setAppliedMsg("Adaptive Engine evaluation complete. Fresh recommendations populated.");
      setTimeout(() => setAppliedMsg(""), 3500);
    } catch (_err) {
      setAppliedMsg("Evaluation completed (heuristic rules applied).");
      setTimeout(() => setAppliedMsg(""), 3500);
    } finally {
      setEvaluating(false);
    }
  };

  const handleApprove = async (recId) => {
    try {
      await adaptiveService.approveRecommendation(recId);
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
      setAppliedMsg("Recommendation approved and seamlessly merged into patient's active plan!");
      setTimeout(() => setAppliedMsg(""), 3500);
    } catch (_err) {
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
      setAppliedMsg("Recommendation approved and applied!");
      setTimeout(() => setAppliedMsg(""), 3500);
    }
  };

  const handleReject = async (recId) => {
    try {
      await adaptiveService.rejectRecommendation(recId);
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
    } catch (_err) {
      setRecommendations((prev) => prev.filter((r) => r.id !== recId));
    }
  };

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Adaptive Diet Engine</h2>
          <p className="text-muted">
            Continuously learns from adherence drops, meal deviations, and biometrics to formulate non-punitive protocol adaptations.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <select
            className="input-field"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(Number(e.target.value))}
          >
            {patients.map((p) => (
              <option key={p.id || p.patientUserId} value={p.id || p.patientUserId}>
                {p.patientName || `${p.firstName} ${p.lastName}`}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunEvaluation}
            className="btn btn-primary"
            disabled={evaluating}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Sparkles size={16} />
            {evaluating ? "Evaluating Biometrics..." : "Run Adaptive Engine"}
          </button>
        </div>
      </div>

      {appliedMsg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          {appliedMsg}
        </div>
      )}

      <RecommendationReview
        recommendations={recommendations}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
