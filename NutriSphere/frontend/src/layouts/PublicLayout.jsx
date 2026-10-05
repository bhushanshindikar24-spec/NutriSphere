
import { Outlet, Link, useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        background: "var(--bg-surface-glass)",
        borderBottom: "1px solid var(--border-color)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <HeartPulse size={28} color="var(--primary)" />
          <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)" }}>NutriSphere</span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <Link to="/" style={{ color: "var(--text-main)", textDecoration: "none", fontWeight: 500 }}>Home</Link>
          <Link to="/features" style={{ color: "var(--text-main)", textDecoration: "none", fontWeight: 500 }}>Features</Link>
          <Link to="/about" style={{ color: "var(--text-main)", textDecoration: "none", fontWeight: 500 }}>About</Link>
          <Link to="/contact" style={{ color: "var(--text-main)", textDecoration: "none", fontWeight: 500 }}>Contact</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user ? (
            <button
              onClick={() => {
                if (user.role === "PATIENT") navigate("/patient");
                else if (user.role === "DIETITIAN") navigate("/dietitian");
                else if (user.role === "DOCTOR") navigate("/doctor");
                else if (user.role === "HOTEL") navigate("/hotel");
              }}
              style={{
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 600,
                padding: "0.5rem 1rem",
              }}>
                Sign In
              </Link>
              <Link to="/register" style={{
                background: "var(--primary)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--radius-md)",
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border-color)",
        padding: "3rem 2rem 1.5rem",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "left", marginBottom: "2rem" }}>
          <div>
            <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>NutriSphere</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Comprehensive clinical nutrition intelligence and adaptive dietary management platform.
            </p>
          </div>
          <div>
            <h4 style={{ marginBottom: "0.5rem" }}>Intelligence Systems</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Reality Score Engine</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Adaptive Diet Planning</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Nutrition Digital Twin</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Home Food Ingredient Mode</p>
          </div>
          <div>
            <h4 style={{ marginBottom: "0.5rem" }}>Portals</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Doctor Clinical Records</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Dietitian Workspace</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Patient Health Journal</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Hotel Culinary Fulfillment</p>
          </div>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
          &copy; {new Date().getFullYear()} NutriSphere Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
