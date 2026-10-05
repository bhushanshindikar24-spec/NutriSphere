
import { FlaskConical, ArrowRight } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import Badge from "../common/Badge";

export default function LaboratoryReportCard({ labReport, onViewDetails }) {
  if (!labReport) return null;

  const abnormalCount = labReport.labValues?.filter((v) => v.isAbnormal || v.flag === "HIGH" || v.flag === "LOW")?.length || 0;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", padding: "0.5rem", borderRadius: "8px" }}>
            <FlaskConical size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "0.95rem" }}>{labReport.testName || labReport.panelName || "Biochemical Panel"}</h4>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              Sampled: {formatDate(labReport.testDate || labReport.createdAt)}
            </span>
          </div>
        </div>

        {abnormalCount > 0 ? (
          <Badge variant="warning">{abnormalCount} Abnormal Values</Badge>
        ) : (
          <Badge variant="success">All Normal</Badge>
        )}
      </div>

      {labReport.notes && (
        <p className="text-muted" style={{ fontSize: "0.8rem", margin: "0.5rem 0", lineHeight: 1.4 }}>
          {labReport.notes}
        </p>
      )}

      {labReport.labValues && labReport.labValues.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", margin: "0.75rem 0" }}>
          {labReport.labValues.slice(0, 4).map((val, idx) => (
            <span
              key={idx}
              style={{
                fontSize: "0.75rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                background: val.isAbnormal ? "rgba(239, 68, 68, 0.1)" : "rgba(255, 255, 255, 0.03)",
                color: val.isAbnormal ? "#EF4444" : "var(--text-color)",
                border: "1px solid var(--border-color)",
              }}
            >
              <strong>{val.testCode || val.markerName}:</strong> {val.value} {val.unit}
            </span>
          ))}
          {labReport.labValues.length > 4 && (
            <span className="text-muted" style={{ fontSize: "0.75rem", alignSelf: "center" }}>
              +{labReport.labValues.length - 4} more
            </span>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.75rem" }}>
        {onViewDetails && (
          <button
            className="btn btn-sm btn-outline"
            onClick={() => onViewDetails(labReport)}
            style={{ fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            Full Results <ArrowRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
