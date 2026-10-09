import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";

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


  return (
    <div className="auth-container">
      <div className="glass-panel auth-card" style={{ maxWidth: "440px", width: "100%", margin: "0 auto" }}>
        <div className="text-center mb-6">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <div style={{ background: "var(--primary-light)", padding: "1rem", borderRadius: "50%", color: "var(--primary)" }}>
              <LogIn size={32} />
            </div>
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "800", margin: "0 0 0.4rem 0" }}>
            Welcome to Healthy<span style={{ color: "var(--primary)" }}>One</span>
          </h2>
          <p className="text-muted" style={{ fontSize: "0.9rem", margin: 0 }}>
            Clinical Nutrition & Dietary Intelligence Platform
          </p>
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

        <p className="text-center text-muted" style={{ marginTop: "1.25rem", fontSize: "0.85rem", textAlign: "center" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
