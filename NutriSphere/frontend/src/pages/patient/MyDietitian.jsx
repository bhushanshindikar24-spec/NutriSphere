import { useState, useEffect } from "react";
import { UserCheck, Mail, Phone, Building, Award, CheckCircle, ShieldCheck, Sparkles, ExternalLink, Apple } from "lucide-react";
import api from "../../services/api";

export default function MyDietitian() {
  const [assignedDietitians, setAssignedDietitians] = useState([]);
  const [allDietitians, setAllDietitians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [submittingId, setSubmittingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch assigned dietitian
      const assignedRes = await api.get("/assignments/patient/dietitians");
      const assigned = assignedRes.data?.data || assignedRes.data || [];
      setAssignedDietitians(Array.isArray(assigned) ? assigned : []);

      // Fetch directory of verified dietitians
      const dirRes = await api.get("/dietitians/directory");
      const directory = dirRes.data?.data || dirRes.data || [];
      setAllDietitians(Array.isArray(directory) ? directory : []);
    } catch (err) {
      console.error("Failed to fetch dietitians", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectDietitian = async (dietitianId) => {
    try {
      setSubmittingId(dietitianId);
      setActionMsg("");
      await api.post("/assignments/patient/select-dietitian", {
        dietitianId: dietitianId,
        notes: "Selected by patient via Dietetics Directory",
      });
      setActionMsg("Successfully assigned your clinical dietitian!");
      await fetchData();
    } catch (err) {
      console.error("Failed to assign dietitian", err);
      setActionMsg(err.response?.data?.message || "Failed to assign dietitian.");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <div className="loading-screen">Loading Clinical Dietitians Directory...</div>;

  const assignedUserIds = new Set(assignedDietitians.map((a) => a.dietitianUserId));

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "0.5rem", borderRadius: "10px", color: "var(--primary)" }}>
            <Apple size={24} />
          </div>
          <h2 style={{ margin: 0 }}>Supervising Clinical Dietitians & Nutritionists</h2>
        </div>
        <p className="text-muted" style={{ margin: 0 }}>
          Connect with registered dietitians (RD) specializing in clinical dietary management, adaptive meal protocols, and metabolic optimization.
        </p>
      </div>

      {actionMsg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--primary)", padding: "1rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <CheckCircle size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Currently Assigned Dietitians */}
      {assignedDietitians.length > 0 && (
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem" }}>
            <UserCheck size={18} /> Currently Assigned Dietitian
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {assignedDietitians.map((d) => (
              <div key={d.id} style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.2rem" }}>{d.dietitianName || "Clinical Dietitian"}</h3>
                <div style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                  Clinical Prescribing Dietitian
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Assigned Date: {d.assignedDate || "Active"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directory of Dietitians */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Verified Dietitians Directory</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing {allDietitians.length} Verified Specialist{allDietitians.length === 1 ? "" : "s"}
          </span>
        </div>

        {allDietitians.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "var(--radius-lg)" }}>
            <Apple size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p>No registered dietitians currently available in the directory.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {allDietitians.map((diet) => {
              const isAssigned = assignedUserIds.has(diet.userId);
              return (
                <div
                  key={diet.id || diet.userId}
                  className="glass-panel"
                  style={{
                    padding: "1.75rem",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: isAssigned ? "1px solid var(--primary)" : "1px solid rgba(255, 255, 255, 0.08)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isAssigned && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "var(--primary)",
                        color: "#0f172a",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        padding: "0.3rem 0.8rem",
                        borderBottomLeftRadius: "8px",
                      }}
                    >
                      Assigned Dietitian
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "14px",
                          background: "rgba(16, 185, 129, 0.12)",
                          color: "var(--primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "1.2rem",
                          flexShrink: 0,
                        }}
                      >
                        {diet.firstName ? diet.firstName.charAt(0) : "N"}
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>
                          {diet.fullName || `${diet.firstName} ${diet.lastName}, RD`}
                        </h4>
                        <div style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                          {diet.specialization || "Clinical Nutrition"}
                        </div>
                        {diet.degree && (
                          <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 500, marginTop: "0.2rem" }}>
                            Credentials: {diet.degree}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* License Badge */}
                    <div
                      style={{
                        background: "rgba(16, 185, 129, 0.08)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        padding: "0.6rem 0.85rem",
                        borderRadius: "8px",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "0.8rem",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontWeight: 600 }}>
                        <ShieldCheck size={16} /> Verified Dietetic License:
                      </div>
                      <code style={{ background: "rgba(0, 0, 0, 0.2)", padding: "0.2rem 0.4rem", borderRadius: "4px", color: "#e2e8f0" }}>
                        {diet.licenseNumber || "RD-CLIN-VERIFIED"}
                      </code>
                    </div>

                    {/* Supervising Doctor Badge */}
                    {diet.achievements && diet.achievements.includes("Supervising Physician:") && (
                      <div
                        style={{
                          background: "rgba(16, 185, 129, 0.08)",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "8px",
                          marginBottom: "0.75rem",
                          fontSize: "0.8rem",
                          color: "var(--primary)",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <span>🩺</span>
                        <span>{diet.achievements.split("•")[0].trim()}</span>
                      </div>
                    )}

                    {/* Achievements */}
                    {diet.achievements && (
                      <div
                        style={{
                          background: "rgba(245, 158, 11, 0.06)",
                          border: "1px solid rgba(245, 158, 11, 0.15)",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          marginBottom: "1rem",
                          fontSize: "0.82rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--accent)", fontWeight: 600, marginBottom: "0.3rem" }}>
                          <Award size={14} /> Clinical Certifications & Focus:
                        </div>
                        <div style={{ color: "#cbd5e1", lineHeight: 1.4 }}>
                          {diet.achievements}
                        </div>
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                      {diet.clinicName && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Building size={14} color="var(--primary)" />
                          <span>{diet.clinicName}</span>
                        </div>
                      )}
                      {diet.yearsExperience && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Sparkles size={14} color="var(--accent)" />
                          <span>Experience: {diet.yearsExperience} Years Clinical Practice</span>
                        </div>
                      )}
                      {diet.email && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Mail size={14} color="var(--primary)" />
                          <span>{diet.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                    {isAssigned ? (
                      <button className="btn btn-outline" disabled style={{ flex: 1, borderColor: "var(--primary)", color: "var(--primary)" }}>
                        <CheckCircle size={16} /> Currently Assigned
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectDietitian(diet.userId)}
                        className="btn btn-primary"
                        disabled={submittingId === diet.userId}
                        style={{ flex: 1 }}
                      >
                        {submittingId === diet.userId ? "Connecting..." : "Assign as My Dietitian"}
                      </button>
                    )}
                    {diet.licenseDocumentUrl && (
                      <a
                        href={diet.licenseDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline"
                        title="View License Certificate"
                        style={{ padding: "0.5rem 0.75rem", display: "inline-flex", alignItems: "center" }}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
