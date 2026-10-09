import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { KeyRound, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send reset instructions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "460px", width: "100%", margin: "0 auto" }}>
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
            Reset Password
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0 }}>
            Enter your email and we will send you a reset link
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>
            {error}
          </div>
        )}

        {submitted ? (
          <div style={{ textAlign: "center", padding: "1.5rem", background: "#ecfdf5", borderRadius: "16px", border: "1px solid #a7f3d0" }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ marginBottom: "0.5rem", color: "#065f46" }}>Check Your Inbox</h3>
            <p style={{ fontSize: "0.9rem", color: "#047857", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              If an account with <strong>{email}</strong> exists, password reset instructions have been dispatched.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@nutrisphere.com"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ padding: "0.85rem", borderRadius: "12px" }}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <Link to="/login" style={{ color: "#0284c7", fontSize: "0.9rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", fontWeight: 600 }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
