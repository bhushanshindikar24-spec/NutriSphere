import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "radial-gradient(circle at top right, rgba(224, 242, 254, 0.8), transparent 45%), radial-gradient(circle at bottom left, rgba(240, 249, 255, 0.9), transparent 45%), #f8fafc",
      padding: "2.5rem 1rem",
      position: "relative"
    }}>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div style={{
            width: "42px",
            height: "42px",
            background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
            color: "#ffffff",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: "800",
            boxShadow: "0 4px 14px rgba(2, 132, 199, 0.3)"
          }}>
            +
          </div>
          <div style={{ textAlign: "left" }}>
            <span style={{ fontSize: "1.65rem", fontWeight: "800", color: "#0284c7", letterSpacing: "-0.02em", display: "block", lineHeight: 1.1 }}>
              NutriSphere
            </span>
            <span style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Clinical Intelligence Platform
            </span>
          </div>
        </Link>
      </div>

      <div style={{ width: "100%", maxWidth: "480px" }}>
        <Outlet />
      </div>

      <footer style={{ marginTop: "2.5rem", textAlign: "center", color: "#64748b", fontSize: "0.8rem" }}>
        &copy; {new Date().getFullYear()} NutriSphere Clinical Intelligence. HIPAA / HHS Compliant.
      </footer>
    </div>
  );
}
