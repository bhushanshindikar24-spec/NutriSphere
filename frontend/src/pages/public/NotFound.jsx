
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "2rem",
    }}>
      <AlertCircle size={64} color="var(--primary)" style={{ marginBottom: "1rem" }} />
      <h1 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Page Not Found</h2>
      <p className="text-muted" style={{ maxWidth: "450px", marginBottom: "2rem" }}>
        The requested clinical page or nutrition resource does not exist or has been relocated.
      </p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        <ArrowLeft size={18} /> Return Home
      </Link>
    </div>
  );
}
