import {  useState  } from "react";
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
      <div className="glass-panel auth-card">
        <div className="text-center mb-6">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <div style={{ background: "var(--primary-light)", padding: "1rem", borderRadius: "50%", color: "var(--primary)" }}>
              <KeyRound size={32} />
            </div>
          </div>
          <h2>Reset Password</h2>
          <p className="text-muted">Enter your email and we will send you a reset link</p>
        </div>

        {error && (
          <div style={{ color: "#EF4444", textAlign: "center", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        {submitted ? (
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <CheckCircle size={48} color="#10B981" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ marginBottom: "0.5rem" }}>Check Your Inbox</h3>
            <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              If an account with {email} exists, password reset instructions have been dispatched.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <Link to="/login" style={{ color: "var(--primary)", fontSize: "0.875rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
