import {  useState, useEffect  } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import Badge from "../../components/common/Badge";
import api from "../../services/api";

export default function PlanApproval() {
  const [pendingPlans, setPendingPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await api.get("/nutrition/diet-plans/pending");
      const list = res.data?.data || res.data;
      setPendingPlans(Array.isArray(list) ? list : []);
    } catch (_err) {
      setPendingPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/nutrition/diet-plans/${id}/approve`);
      setPendingPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (_err) {
      setPendingPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/nutrition/diet-plans/${id}/reject`);
      setPendingPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (_err) {
      setPendingPlans((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (loading) return <div className="loading-screen">Loading Approval Queue...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div>
        <h2>Diet Plan Approval Queue</h2>
        <p className="text-muted">Review and formally validate dietary protocols requiring clinical approval.</p>
      </div>

      {pendingPlans.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "var(--radius-lg)" }}>
          <CheckCircle2 size={40} style={{ margin: "0 auto 1rem", color: "#10B981", opacity: 0.8 }} />
          <p style={{ margin: 0 }}>All submitted diet plans have been reviewed and approved!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {pendingPlans.map((plan) => (
            <div
              key={plan.id}
              className="glass-panel"
              style={{
                padding: "1.5rem",
                borderRadius: "var(--radius-lg)",
                borderLeft: "4px solid #F59E0B",
                display: "grid",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>{plan.name}</h3>
                  <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Patient: <strong>{plan.patientName}</strong> • Submitted: {plan.submittedDate}
                  </span>
                </div>
                <Badge variant="warning">Awaiting Approval</Badge>
              </div>

              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {plan.notes}
              </p>

              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.85rem", background: "rgba(255, 255, 255, 0.02)", padding: "0.75rem 1rem", borderRadius: "6px" }}>
                <span>Daily Target: <strong>{plan.dailyCaloriesTarget} kcal</strong></span>
                <span>Protein: <strong>{plan.dailyProteinTarget}g</strong></span>
                {plan.prescribingDoctor && <span>Physician: <strong>{plan.prescribingDoctor}</strong></span>}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button
                  onClick={() => handleReject(plan.id)}
                  className="btn btn-outline"
                  style={{ color: "#EF4444", borderColor: "rgba(239, 68, 68, 0.3)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <XCircle size={16} /> Reject with Revisions
                </button>
                <button
                  onClick={() => handleApprove(plan.id)}
                  className="btn btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <CheckCircle2 size={16} /> Approve & Activate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
