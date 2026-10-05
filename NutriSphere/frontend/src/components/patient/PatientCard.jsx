
import { User, AlertCircle } from "lucide-react";
import Badge from "../common/Badge";

export default function PatientCard({ patient, onSelect }) {
  if (!patient) return null;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "1.25rem",
        borderRadius: "var(--radius-lg)",
        cursor: onSelect ? "pointer" : "default",
        transition: "var(--transition)",
      }}
      onClick={() => onSelect && onSelect(patient)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "0.6rem", borderRadius: "50%" }}>
            <User size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1rem" }}>
              {patient.patientName || `${patient.firstName || "Patient"} ${patient.lastName || ""}`}
            </h4>
            <span className="text-muted" style={{ fontSize: "0.75rem" }}>
              ID: #{patient.patientUserId || patient.userId || patient.id}
            </span>
          </div>
        </div>

        {patient.status && <Badge variant="neutral">{patient.status}</Badge>}
      </div>

      <div style={{ display: "flex", gap: "1rem", fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.5rem 0" }}>
        {patient.age && <span>Age: {patient.age}</span>}
        {patient.gender && <span>Gender: {patient.gender}</span>}
        {patient.weightKg && <span>{patient.weightKg} kg</span>}
      </div>

      {patient.activeCondition && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "#EF4444", marginTop: "0.5rem" }}>
          <AlertCircle size={14} />
          <span>{patient.activeCondition}</span>
        </div>
      )}
    </div>
  );
}
