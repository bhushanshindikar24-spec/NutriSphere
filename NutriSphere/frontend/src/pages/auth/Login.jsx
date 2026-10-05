import {  useState, useContext  } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Sparkles, User, Stethoscope, Utensils, Award } from "lucide-react";

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
      setError(err.response?.data?.message || "Failed to login. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail) => {
    setFormData({ email: roleEmail, password: "password" });
    setError("");
    setIsLoading(true);
    try {
      await login(roleEmail, "password");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login. Ensure backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-card" style={{ maxWidth: "440px", width: "100%", margin: "0 auto" }}>
        <div className="text-center mb-6">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <div style={{ background: "var(--primary-light)", padding: "1rem", borderRadius: "50%", color: "var(--primary)" }}>
              <LogIn size={32} />
            </div>
          </div>
          <h2>Welcome to NutriSphere</h2>
          <p className="text-muted">Clinical Nutrition & Dietary Intelligence Platform</p>
        </div>

        {error && (
          <div style={{ color: "#EF4444", background: "rgba(239, 68, 68, 0.1)", padding: "0.75rem", borderRadius: "8px", textAlign: "center", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="name@nutrisphere.com"
              style={{ width: "100%" }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "1.25rem" }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
              style={{ width: "100%" }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
          <span className="text-muted" style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <Sparkles size={14} color="var(--primary)" /> One-Click Clinical Demo Access
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => handleQuickLogin("patient@nutrisphere.com")}
              className="btn btn-sm btn-outline"
              disabled={isLoading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", fontSize: "0.75rem" }}
            >
              <User size={13} /> Patient
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("dietitian@nutrisphere.com")}
              className="btn btn-sm btn-outline"
              disabled={isLoading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", fontSize: "0.75rem" }}
            >
              <Award size={13} /> Dietitian
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("doctor@nutrisphere.com")}
              className="btn btn-sm btn-outline"
              disabled={isLoading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", fontSize: "0.75rem" }}
            >
              <Stethoscope size={13} /> Doctor
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("hotel@nutrisphere.com")}
              className="btn btn-sm btn-outline"
              disabled={isLoading}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", fontSize: "0.75rem" }}
            >
              <Utensils size={13} /> Hotel Kitchen
            </button>
          </div>
        </div>

        <p className="text-center text-muted" style={{ marginTop: "1.25rem", fontSize: "0.85rem", textAlign: "center" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
