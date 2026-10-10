import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background Soft Curved Shapes */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-10%",
        width: "50vw",
        height: "60vh",
        background: "radial-gradient(circle, rgba(224, 242, 254, 0.7) 0%, rgba(240, 249, 255, 0) 70%)",
        pointerEvents: "none"
      }} />

      <div className="auth-card" style={{ maxWidth: "460px", width: "100%", margin: "0 auto" }}>
        {/* Brand Icon & Heading */}
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", marginBottom: "1.25rem" }}>
            <div style={{
              width: "38px",
              height: "38px",
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              color: "#ffffff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              fontWeight: "800",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.28)"
            }}>
              +
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0284c7", letterSpacing: "-0.02em" }}>
              NutriSphere
            </span>
          </Link>

          <h2 style={{ fontSize: "1.65rem", fontWeight: "800", margin: "0 0 0.4rem 0", color: "#0f172a" }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>
            Enter your credentials to access your clinical portal
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "1.25rem" }}>
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Mail size={15} color="#0284c7" /> Email Address
            </label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="doctor@nutrisphere.com"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label className="form-label" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Lock size={15} color="#0284c7" /> Password
              </label>
              <Link to="/forgot-password" style={{ fontSize: "0.82rem", color: "#0284c7", textDecoration: "none", fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.85rem", fontSize: "1rem", borderRadius: "12px", gap: "0.5rem" }}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: "1.75rem", textAlign: "center", borderTop: "1px solid #f1f5f9", paddingTop: "1.25rem" }}>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#0284c7", textDecoration: "none", fontWeight: 700 }}>
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
