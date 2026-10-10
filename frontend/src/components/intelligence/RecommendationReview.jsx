import {  useState  } from "react";
import { Check, X, Edit2, Sparkles } from "lucide-react";
import { capitalize } from "../../utils/formatters";

export default function RecommendationReview({
  recommendations = [],
  onApprove,
  onReject,
  onModify,
  isProcessing = false,
}) {
  const [selectedRec, setSelectedRec] = useState(null);
  const [editNotes, setEditNotes] = useState("");

  const handleOpenModify = (rec) => {
    setSelectedRec(rec);
    setEditNotes(rec.recommendationText || rec.reason || "");
  };

  const handleSaveModify = () => {
    if (onModify && selectedRec) {
      onModify(selectedRec.id, { ...selectedRec, notes: editNotes });
    }
    setSelectedRec(null);
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)" }}>
        No pending AI or adaptive recommendations for review.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <Sparkles size={18} color="var(--primary)" />
        <h4 style={{ margin: 0, fontSize: "1rem" }}>
          Clinical Review Queue ({recommendations.length} Pending)
        </h4>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="glass-panel"
            style={{
              padding: "1.25rem",
              borderRadius: "var(--radius-md)",
              borderLeft: "4px solid var(--primary)",
              display: "grid",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "var(--primary)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {capitalize(rec.adaptationType || rec.type || "Adaptive Modification")}
                </span>
                <h5 style={{ margin: "0.25rem 0 0 0", fontSize: "1rem" }}>
                  {rec.title || rec.recommendationText || "Plan Adjustment"}
                </h5>
              </div>

              {rec.confidenceScore != null && (
                <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>
                  {Math.round(rec.confidenceScore * (rec.confidenceScore <= 1 ? 100 : 1))}% AI Confidence
                </span>
              )}
            </div>

            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {rec.rationale || rec.reason || rec.description || "Heuristic adaptation triggered by compliance drop."}
            </p>

            {rec.proposedChanges && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  display: "grid",
                  gap: "0.25rem",
                }}
              >
                <strong>Proposed Adjustments:</strong>
                {typeof rec.proposedChanges === "object" ? (
                  Object.entries(rec.proposedChanges).map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="text-muted">{capitalize(k)}:</span>
                      <span>{String(v)}</span>
                    </div>
                  ))
                ) : (
                  <span>{String(rec.proposedChanges)}</span>
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                paddingTop: "0.5rem",
                borderTop: "1px solid var(--border-color)",
              }}
            >
              <button
                className="btn btn-sm btn-outline"
                onClick={() => handleOpenModify(rec)}
                disabled={isProcessing}
                style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <Edit2 size={14} /> Modify
              </button>

              {onReject && (
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onReject(rec.id)}
                  disabled={isProcessing}
                  style={{
                    fontSize: "0.8rem",
                    color: "#EF4444",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <X size={14} /> Reject
                </button>
              )}

              {onApprove && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onApprove(rec.id)}
                  disabled={isProcessing}
                  style={{ fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                >
                  <Check size={14} /> Approve & Apply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modify Modal */}
      {selectedRec && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: "1.75rem",
              borderRadius: "var(--radius-lg)",
              maxWidth: "500px",
              width: "90%",
              display: "grid",
              gap: "1rem",
            }}
          >
            <h4 style={{ margin: 0 }}>Modify Recommendation</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: "0.85rem" }}>
              Tailor this AI-suggested adjustment before finalizing into the active diet plan.
            </p>

            <textarea
              className="input-field"
              rows={4}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Enter modified instructions or rationale..."
              style={{ width: "100%" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button className="btn btn-outline" onClick={() => setSelectedRec(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveModify}>
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
