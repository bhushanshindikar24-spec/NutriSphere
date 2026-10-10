import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, XCircle, FileText, ExternalLink, Award, Clock, AlertCircle } from "lucide-react";
import api from "../../services/api";

export default function AdminVerifications() {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/pending-verifications");
      const list = res.data?.data || res.data || [];
      setPendingList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch pending verifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (userId, name, role) => {
    try {
      setProcessingId(userId);
      setFeedback(null);
      await api.post(`/admin/approve/${userId}`);
      setFeedback({ type: "success", text: `License for ${name} (${role}) verified and approved! Account is now ACTIVE.` });
      await fetchPending();
    } catch (err) {
      console.error("Failed to approve license", err);
      setFeedback({ type: "error", text: err.response?.data?.message || "Failed to approve license." });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId, name) => {
    const reason = window.prompt(`Enter rejection reason for ${name}:`, "Submitted license credentials could not be verified");
    if (!reason) return;
    try {
      setProcessingId(userId);
      setFeedback(null);
      await api.post(`/admin/reject/${userId}`, { reason });
      setFeedback({ type: "info", text: `Application for ${name} was rejected.` });
      await fetchPending();
    } catch (err) {
      console.error("Failed to reject application", err);
      setFeedback({ type: "error", text: err.response?.data?.message || "Failed to reject application." });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <div className="loading-screen">Loading License Verification Queue...</div>;

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "0.5rem", borderRadius: "10px", color: "var(--primary)" }}>
            <ShieldCheck size={24} />
          </div>
          <h2 style={{ margin: 0 }}>Professional License Verification Queue</h2>
        </div>
        <p className="text-muted" style={{ margin: 0 }}>
          Review submitted medical degrees, clinical licenses, certifications, and culinary permits for onboarding professionals.
        </p>
      </div>

      {feedback && (
        <div
          style={{
            background: feedback.type === "success" ? "rgba(16, 185, 129, 0.15)" : feedback.type === "error" ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
            border: `1px solid ${feedback.type === "success" ? "rgba(16, 185, 129, 0.3)" : feedback.type === "error" ? "rgba(239, 68, 68, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
            color: feedback.type === "success" ? "var(--primary)" : feedback.type === "error" ? "#ef4444" : "var(--accent)",
            padding: "1rem",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {pendingList.length === 0 ? (
        <div className="glass-panel" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "var(--radius-lg)" }}>
          <CheckCircle2 size={56} color="var(--primary)" style={{ opacity: 0.8, marginBottom: "1rem" }} />
          <h3>All Credentials Verified!</h3>
          <p style={{ maxWidth: "500px", margin: "0.5rem auto 0 auto" }}>
            There are currently no pending Doctor, Dietitian, or Culinary Kitchen license verification requests in the queue.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          {pendingList.map((app) => (
            <div
              key={app.userId}
              className="glass-panel"
              style={{
                padding: "2rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                display: "grid",
                gap: "1.25rem",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.3rem" }}>{app.fullName}</h3>
                    <span
                      style={{
                        background: app.role === "DOCTOR" ? "rgba(16, 185, 129, 0.15)" : app.role === "DIETITIAN" ? "rgba(56, 189, 248, 0.15)" : "rgba(244, 63, 94, 0.15)",
                        color: app.role === "DOCTOR" ? "var(--primary)" : app.role === "DIETITIAN" ? "#38bdf8" : "#f43f5e",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                      }}
                    >
                      {app.role}
                    </span>
                    <span style={{ background: "rgba(245, 158, 11, 0.15)", color: "var(--accent)", fontSize: "0.75rem", fontWeight: 600, padding: "0.25rem 0.6rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Clock size={12} /> PENDING ADMIN REVIEW
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Registered Email: <span style={{ color: "#e2e8f0" }}>{app.email}</span> • Phone: {app.phoneNumber || "Not provided"}
                  </div>
                </div>

                {/* Approve / Reject Actions */}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => handleApprove(app.userId, app.fullName, app.role)}
                    className="btn btn-primary"
                    disabled={processingId === app.userId}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <CheckCircle2 size={16} /> Approve & Activate
                  </button>
                  <button
                    onClick={() => handleReject(app.userId, app.fullName)}
                    className="btn btn-outline"
                    disabled={processingId === app.userId}
                    style={{ borderColor: "#ef4444", color: "#ef4444", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              </div>

              {/* Submitted Credentials Section */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", background: "rgba(255, 255, 255, 0.02)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.25rem" }}>
                    License / Registration Number
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1.05rem" }}>
                    {app.licenseNumber || "N/A"}
                  </div>
                </div>

                {app.degree && (
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.25rem" }}>
                      Degree & Medical Qualifications
                    </div>
                    <div style={{ fontWeight: 600, color: "#e2e8f0" }}>
                      {app.degree}
                    </div>
                  </div>
                )}

                {app.specialization && (
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.25rem" }}>
                      Specialization / Clinical Focus
                    </div>
                    <div style={{ fontWeight: 600, color: "var(--primary)" }}>
                      {app.specialization}
                    </div>
                  </div>
                )}

                {app.organizationName && (
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.25rem" }}>
                      Affiliated Hospital / Clinic / Facility
                    </div>
                    <div style={{ color: "#e2e8f0" }}>
                      {app.organizationName}
                    </div>
                  </div>
                )}

                {app.yearsExperience && (
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.25rem" }}>
                      Clinical Experience
                    </div>
                    <div style={{ color: "#e2e8f0" }}>
                      {app.yearsExperience} Years Practice
                    </div>
                  </div>
                )}

                {app.consultationFee && (
                  <div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.25rem" }}>
                      Consultation Fee
                    </div>
                    <div style={{ color: "#e2e8f0" }}>
                      ${app.consultationFee}
                    </div>
                  </div>
                )}
              </div>

              {/* Achievements */}
              {app.achievements && (
                <div style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.15)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                    <Award size={15} /> Submitted Clinical Achievements & Credentials:
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    {app.achievements}
                  </div>
                </div>
              )}

              {/* License Document Preview Link */}
              {app.licenseDocumentUrl && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <FileText size={16} color="var(--primary)" />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Submitted License File:</span>
                  <a
                    href={app.licenseDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--primary)", textDecoration: "underline", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                  >
                    View Document Certificate <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
