
import { Brain, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Badge from "../common/Badge";

export default function AdaptiveRecommendationCard({
  recommendation,
  onApprove,
  onReject,
  showActions = false,
}) {
  if (!recommendation) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--secondary)", padding: "0.5rem", borderRadius: "8px" }}>
            <Brain size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>
              {recommendation.recommendationType || "Adaptive Diet Adjustment"}
            </h4>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              Reason: {recommendation.triggerReason || "Adherence barrier detected"}
            </span>
          </div>
        </div>
        <Badge variant={recommendation.status}>{recommendation.status}</Badge>
      </div>

      <div style={{ background: "var(--bg-color)", padding: "1rem", borderRadius: "var(--radius-md)", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>Original Item</span>
            <p style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>
              {recommendation.originalMealName || recommendation.originalFoodName || "Prescribed Meal"}
            </p>
          </div>
          <ArrowRight size={18} color="var(--primary)" />
          <div style={{ flex: 1 }}>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>Recommended Alternative</span>
            <p style={{ margin: "0.25rem 0 0", fontWeight: 600, color: "var(--primary)" }}>
              {recommendation.suggestedMealName || recommendation.suggestedFoodName || "Alternative Meal"}
            </p>
          </div>
        </div>
      </div>

      {recommendation.clinicalNotes && (
        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
          <strong>Clinical Rationale:</strong> {recommendation.clinicalNotes}
        </p>
      )}

      {showActions && recommendation.status === "PENDING" && (
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          {onReject && (
            <button
              onClick={() => onReject(recommendation.id)}
              className="btn btn-outline"
              style={{ fontSize: "0.8125rem", padding: "0.4rem 0.85rem", color: "#EF4444" }}
            >
              <XCircle size={14} /> Reject
            </button>
          )}
          {onApprove && (
            <button
              onClick={() => onApprove(recommendation.id)}
              className="btn btn-primary"
              style={{ fontSize: "0.8125rem", padding: "0.4rem 0.85rem" }}
            >
              <CheckCircle size={14} /> Approve & Apply
            </button>
          )}
        </div>
      )}
    </div>
  );
}
