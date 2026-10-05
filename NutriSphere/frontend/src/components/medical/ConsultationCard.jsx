
import { formatDateTime } from "../../utils/dateUtils";
import { Stethoscope, Calendar } from "lucide-react";

export default function ConsultationCard({ consultation, onViewDetails }) {
  if (!consultation) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "0.5rem", borderRadius: "8px" }}>
            <Stethoscope size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>
              {consultation.chiefComplaint || "Clinical Consultation"}
            </h4>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Calendar size={12} /> {formatDateTime(consultation.consultationDate || consultation.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {consultation.diagnosis && (
        <div style={{ margin: "0.75rem 0", fontSize: "0.875rem" }}>
          <strong>Diagnosis:</strong> {consultation.diagnosis}
        </div>
      )}

      {consultation.clinicalNotes && (
        <p className="text-muted" style={{ fontSize: "0.8125rem", lineHeight: 1.5, margin: "0.5rem 0 1rem" }}>
          {consultation.clinicalNotes}
        </p>
      )}

      {onViewDetails && (
        <button
          onClick={() => onViewDetails(consultation)}
          className="btn btn-outline"
          style={{ width: "100%", fontSize: "0.8125rem" }}
        >
          View Full Clinical Notes
        </button>
      )}
    </div>
  );
}
