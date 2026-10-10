
import { formatDate } from "../../utils/dateUtils";
import { FileText, ExternalLink } from "lucide-react";
import Badge from "../common/Badge";

export default function MedicalReportCard({ report }) {
  if (!report) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)", padding: "0.5rem", borderRadius: "8px" }}>
            <FileText size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "0.9375rem" }}>{report.title || "Clinical Report"}</h4>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              {formatDate(report.reportDate || report.createdAt)}
            </span>
          </div>
        </div>
        <Badge variant="neutral">{report.reportType || "LAB_REPORT"}</Badge>
      </div>

      {report.summary && (
        <p className="text-muted" style={{ fontSize: "0.8125rem", margin: "0.75rem 0", lineHeight: 1.4 }}>
          {report.summary}
        </p>
      )}

      {report.fileUrl && (
        <a
          href={report.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ width: "100%", fontSize: "0.75rem", textDecoration: "none", display: "inline-flex", justifyContent: "center", alignItems: "center", gap: "0.4rem" }}
        >
          <ExternalLink size={14} /> View Attached Document
        </a>
      )}
    </div>
  );
}
