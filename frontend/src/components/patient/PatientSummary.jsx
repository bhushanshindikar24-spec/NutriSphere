
import Badge from "../common/Badge";

export default function PatientSummary({ profile, conditions = [], realityScore = null }) {
  if (!profile) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <h4 style={{ margin: "0 0 1rem", fontSize: "1rem" }}>Patient Clinical Summary</h4>

      <div style={{ display: "grid", gap: "0.75rem", fontSize: "0.875rem" }}>
        <div>
          <span className="text-muted">Diagnosed Clinical Conditions:</span>
          {conditions.length === 0 ? (
            <p style={{ margin: "0.25rem 0 0", fontStyle: "italic" }}>None diagnosed</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.25rem" }}>
              {conditions.map((c, i) => (
                <Badge key={i} variant="danger">{c.conditionName}</Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-muted">Reported Allergies:</span>
          <p style={{ margin: "0.25rem 0 0", fontWeight: 500, color: profile.allergies ? "#EF4444" : "inherit" }}>
            {profile.allergies || "None"}
          </p>
        </div>

        {realityScore != null && (
          <div>
            <span className="text-muted">Reality Adherence Score:</span>
            <p style={{ margin: "0.25rem 0 0", fontWeight: 700, color: realityScore >= 75 ? "#10B981" : "#F59E0B" }}>
              {Math.round(realityScore)} / 100
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
