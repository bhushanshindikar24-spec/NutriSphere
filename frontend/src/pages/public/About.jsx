
import { Link } from "react-router-dom";
import { Target, Shield, Users } from "lucide-react";

export default function About() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>About NutriSphere</h1>
        <p className="text-muted" style={{ fontSize: "1.125rem", maxWidth: "650px", margin: "0 auto" }}>
          Reimagining medical dietary therapy through clinical collaboration, realistic compliance modeling, and intelligent personalization.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: "2.5rem", marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Our Mission</h2>
        <p style={{ lineHeight: 1.8, color: "var(--text-main)", marginBottom: "1.5rem" }}>
          Over 80% of chronic condition management hinges on nutritional adherence. Yet conventional diet planning fails because it assumes ideal patient behavior in an unconstrained environment. Most meal plans ignore grocery accessibility, budget realities, culinary literacy, and unpredictable schedules.
        </p>
        <p style={{ lineHeight: 1.8, color: "var(--text-main)" }}>
          NutriSphere was built to solve the compliance gap. By uniting registered physicians, licensed clinical dietitians, patients, and culinary providers into a single responsive intelligence loop, NutriSphere makes clinical dietary protocols sustainable in the real world.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "2rem" }}>
          <Target size={32} color="var(--primary)" style={{ marginBottom: "1rem" }} />
          <h3>Precision Feasibility</h3>
          <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            We quantify and predict the friction points that cause patients to abandon meal plans before failure happens.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "2rem" }}>
          <Shield size={32} color="var(--secondary)" style={{ marginBottom: "1rem" }} />
          <h3>Clinical Isolation & Privacy</h3>
          <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Diagnostic health information is strictly isolated, safeguarding clinical privacy while delivering actionable nutrition directives.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "2rem" }}>
          <Users size={32} color="#F59E0B" style={{ marginBottom: "1rem" }} />
          <h3>Full Stakeholder Alignment</h3>
          <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
            From clinical diagnosis to dietitian approval to pantry recipes and partner hotel kitchen prep — all parties coordinate seamlessly.
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <Link to="/register" className="btn btn-primary" style={{ padding: "0.875rem 2.5rem", textDecoration: "none" }}>
          Join the NutriSphere Network
        </Link>
      </div>
    </div>
  );
}
