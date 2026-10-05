
import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "radial-gradient(circle at top right, rgba(79, 70, 229, 0.15), transparent 40%), var(--bg-color)",
      padding: "2rem 1rem",
    }}>
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 style={{ color: "var(--primary)", fontSize: "2.25rem", fontWeight: 700, margin: 0 }}>
            NutriSphere
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Personalized Clinical Nutrition & Dietary Intelligence
          </p>
        </Link>
      </div>

      <div style={{ width: "100%", maxWidth: "440px" }}>
        <Outlet />
      </div>

      <footer style={{ marginTop: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem" }}>
        &copy; {new Date().getFullYear()} NutriSphere Platform. Clinical Decision Support System.
      </footer>
    </div>
  );
}
