
import { formatDateTime } from "../../utils/dateUtils";
import { Stethoscope, Calendar } from "lucide-react";

export default function ConsultationCard({ consultation, onViewDetails, onVerifyOtp }) {
  if (!consultation) return null;
  const isPending = (consultation.status || "PENDING").toUpperCase() === "PENDING";

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", borderRadius: "var(--radius-lg)", border: isPending ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: isPending ? "rgba(245, 158, 11, 0.15)" : "var(--primary-light)", color: isPending ? "#d97706" : "var(--primary)", padding: "0.5rem", borderRadius: "8px" }}>
            <Stethoscope size={20} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h4 style={{ margin: 0, fontSize: "1rem" }}>
                {consultation.patientName ? `${consultation.patientName} — ` : ""}
                {consultation.chiefComplaint || "Clinical Consultation"}
              </h4>
            </div>
            <span className="text-muted" style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Calendar size={12} /> {formatDateTime(consultation.consultationDate || consultation.createdAt)}
            </span>
          </div>
        </div>

        <div>
          {isPending ? (
            <span style={{ background: "rgba(245, 158, 11, 0.15)", color: "#d97706", border: "1px solid rgba(245, 158, 11, 0.35)", padding: "0.25rem 0.65rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
              PENDING OTP VERIFICATION
            </span>
          ) : (
            <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.35)", padding: "0.25rem 0.65rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700 }}>
              COMPLETED
            </span>
          )}
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

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        {isPending && onVerifyOtp && (
          <button
            onClick={() => onVerifyOtp(consultation)}
            className="btn btn-primary"
            style={{ flex: 1, fontSize: "0.8125rem", background: "#f59e0b", borderColor: "#f59e0b", color: "#ffffff" }}
          >
            Enter Patient OTP & Complete
          </button>
        )}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(consultation)}
            className="btn btn-outline"
            style={{ flex: 1, fontSize: "0.8125rem" }}
          >
            View Full Clinical Notes
          </button>
        )}
      </div>
    </div>
  );
}
