
import { Link } from "react-router-dom";
import { 
  Activity, ShieldCheck, HeartPulse, Brain, Utensils, 
  Stethoscope, Users, ArrowRight, Sparkles 
} from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: "5rem 2rem",
        textAlign: "center",
        background: "radial-gradient(circle at 50% 20%, rgba(79, 70, 229, 0.12), transparent 60%)",
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--primary-light)",
            color: "var(--primary)",
            padding: "0.35rem 1rem",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
          }}>
            <Sparkles size={16} /> Precision Clinical Nutrition Intelligence
          </div>

          <h1 style={{
            fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}>
            Personalized Clinical Nutrition & Dietary Feasibility
          </h1>

          <p style={{
            fontSize: "1.125rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}>
            NutriSphere bridges patients, doctors, clinical dietitians, and culinary providers 
            with multidimensional Reality Scoring, Adaptive Diet Planning, and Nutrition Digital Twins.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/register" style={{
              background: "var(--primary)",
              color: "#fff",
              padding: "0.875rem 2rem",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: "var(--shadow-glow)",
            }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/features" style={{
              background: "var(--bg-surface)",
              color: "var(--text-main)",
              border: "1px solid var(--border-color)",
              padding: "0.875rem 2rem",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              fontWeight: 600,
            }}>
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Five Intelligence Systems */}
      <section style={{ padding: "4rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>The 5 Core Intelligence Engines</h2>
          <p className="text-muted">Evidence-based precision dietary systems designed for real human adherence</p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}>
          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Reality Score Engine</h3>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Scores dietary feasibility across 5 practical dimensions: food availability, affordability, cooking complexity, taste preferences, and busy schedules.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--secondary)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Brain size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Adaptive Diet Engine</h3>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Dynamically calculates safe alternative foods and adjusts caloric targets when patient adherence barriers occur without compromising clinical guidelines.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ background: "rgba(245, 158, 11, 0.1)", color: "#F59E0B", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <HeartPulse size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Nutrition Digital Twin</h3>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Simulates nutritional metabolic trajectories, predicting weight changes and metabolic biomarkers based on actual vs prescribed caloric deficits.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ background: "rgba(236, 72, 153, 0.1)", color: "#EC4899", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Utensils size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Home Food Mode</h3>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Patients inventory whatever is in their kitchen pantry, and the system recommends compliant, clinically aligned meals instantly.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: "2rem" }}>
            <div style={{ background: "rgba(14, 165, 233, 0.1)", color: "#0EA5E9", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Adherence Barrier Detection</h3>
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              Automatically detects deviations in food logging and triggers root-cause barrier categorization for clinician intervention.
            </p>
          </div>
        </div>
      </section>

      {/* Role-based Portals */}
      <section style={{ padding: "4rem 2rem", background: "var(--bg-surface)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Integrated Multi-Role Collaboration</h2>
            <p className="text-muted">A unified ecosystem connecting clinical health, nutrition design, daily living, and food delivery</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            <div style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <Stethoscope size={32} color="var(--primary)" style={{ marginBottom: "1rem" }} />
              <h4>Doctor Portal</h4>
              <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Diagnose clinical conditions, enter consultations, review laboratory reports, and assign patients to registered clinical dietitians.
              </p>
            </div>

            <div style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <Users size={32} color="var(--secondary)" style={{ marginBottom: "1rem" }} />
              <h4>Dietitian Portal</h4>
              <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Calculate precise macro/micronutrient requirements, author customized meal schedules, review Reality Scores, and approve diet plans.
              </p>
            </div>

            <div style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <HeartPulse size={32} color="#F59E0B" style={{ marginBottom: "1rem" }} />
              <h4>Patient Portal</h4>
              <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Effortless daily food & water logging, planned vs actual nutrient tracking, barrier logging, home food suggestions, and meal delivery.
              </p>
            </div>

            <div style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)" }}>
              <Utensils size={32} color="#8B5CF6" style={{ marginBottom: "1rem" }} />
              <h4>Hotel/Partner Portal</h4>
              <p className="text-muted" style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Manage medically curated menus, view incoming patient meal orders, update fulfillment statuses, and guarantee nutrition accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>Experience Evidence-Based Nutrition Intelligence</h2>
        <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto 2rem" }}>
          Empowering patients and clinical practitioners with data-backed feasibility and real-world nutrition plans.
        </p>
        <Link to="/register" style={{
          background: "var(--primary)",
          color: "#fff",
          padding: "0.875rem 2.5rem",
          borderRadius: "var(--radius-md)",
          textDecoration: "none",
          fontWeight: 600,
          display: "inline-block",
        }}>
          Create Your Account
        </Link>
      </section>
    </div>
  );
}
