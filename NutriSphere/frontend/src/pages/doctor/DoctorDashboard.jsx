import { Users, Stethoscope, FilePlus } from "lucide-react";

export default function DoctorDashboard() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2>Doctor Portal</h2>
        <p className="text-muted">Clinical overview and patient assignments.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center", cursor: "pointer", transition: "var(--transition)" }} className="hover:shadow-glow">
          <Users size={48} color="var(--primary)" style={{ margin: "0 auto 1rem" }} />
          <h3>My Patients</h3>
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>View medical history and assignments</p>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center", cursor: "pointer", transition: "var(--transition)" }}>
          <Stethoscope size={48} color="var(--secondary)" style={{ margin: "0 auto 1rem" }} />
          <h3>Consultations</h3>
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>Record new clinical notes</p>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", textAlign: "center", cursor: "pointer", transition: "var(--transition)" }}>
          <FilePlus size={48} color="#F59E0B" style={{ margin: "0 auto 1rem" }} />
          <h3>Assign Dietitians</h3>
          <p className="text-muted" style={{ fontSize: "0.875rem" }}>Refer patients to clinical dietitians</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <h3>Latest Medical Reports</h3>
        <p className="text-muted mt-4">No recent reports found.</p>
      </div>
    </div>
  );
}
