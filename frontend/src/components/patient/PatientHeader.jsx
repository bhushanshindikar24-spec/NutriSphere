
import { User } from "lucide-react";
import Badge from "../common/Badge";

export default function PatientHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "1rem", borderRadius: "50%" }}>
            <User size={32} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-muted" style={{ margin: "0.2rem 0 0", fontSize: "0.875rem" }}>
              {profile.email} • ID #{profile.userId || profile.id}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {profile.gender && <Badge variant="neutral">{profile.gender}</Badge>}
          {profile.bloodType && <Badge variant="neutral">{profile.bloodType}</Badge>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Height</span>
          <p style={{ margin: 0, fontWeight: 600 }}>{profile.heightCm ? `${profile.heightCm} cm` : "--"}</p>
        </div>
        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Weight</span>
          <p style={{ margin: 0, fontWeight: 600 }}>{profile.weightKg ? `${profile.weightKg} kg` : "--"}</p>
        </div>
        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Allergies</span>
          <p style={{ margin: 0, fontWeight: 600, color: profile.allergies ? "#EF4444" : "inherit" }}>
            {profile.allergies || "None"}
          </p>
        </div>
        <div>
          <span className="text-muted" style={{ fontSize: "0.75rem" }}>Dietary Restrictions</span>
          <p style={{ margin: 0, fontWeight: 600 }}>{profile.dietaryRestrictions || "None"}</p>
        </div>
      </div>
    </div>
  );
}
