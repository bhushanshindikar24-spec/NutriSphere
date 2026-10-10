import { useState, useEffect } from "react";
import { Stethoscope, Mail, Building, Award, CheckCircle, ShieldCheck, UserCheck, Sparkles, ExternalLink } from "lucide-react";
import api from "../../services/api";

export default function MyDoctor() {
  const [assignedDoctors, setAssignedDoctors] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [submittingId, setSubmittingId] = useState(null);
  const [allDietitians, setAllDietitians] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch currently assigned doctor(s)
      const assignedRes = await api.get("/assignments/patient/doctors");
      const assigned = assignedRes.data?.data || assignedRes.data || [];
      setAssignedDoctors(Array.isArray(assigned) ? assigned : []);

      // Fetch directory of verified doctors
      const dirRes = await api.get("/doctors/directory");
      const directory = dirRes.data?.data || dirRes.data || [];
      setAllDoctors(Array.isArray(directory) ? directory : []);

      // Fetch dietitians to display affiliated team
      const dietRes = await api.get("/dietitians/directory");
      const dietDirectory = dietRes.data?.data || dietRes.data || [];
      setAllDietitians(Array.isArray(dietDirectory) ? dietDirectory : []);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectDoctor = async (doctorId) => {
    try {
      setSubmittingId(doctorId);
      setActionMsg("");
      await api.post("/assignments/patient/select-doctor", {
        doctorId: doctorId,
        notes: "Selected by patient via Medical Directory",
      });
      setActionMsg("Successfully connected with your selected physician!");
      setLoading(true);
      await fetchData();
    } catch (err) {
      console.error("Failed to select doctor", err);
      setActionMsg(err.response?.data?.message || "Failed to assign doctor.");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <div className="loading-screen">Loading Medical Directory & Physicians...</div>;

  const assignedUserIds = new Set(assignedDoctors.map((a) => a.doctorUserId));

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "0.5rem", borderRadius: "10px", color: "var(--primary)" }}>
            <Stethoscope size={24} />
          </div>
          <h2 style={{ margin: 0 }}>Supervising Doctors & Clinical Specialists</h2>
        </div>
        <p className="text-muted" style={{ margin: 0 }}>
          View board-certified clinical doctors, verify their medical licenses, achievements, and degrees, and assign your attending physician.
        </p>
      </div>

      {actionMsg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--primary)", padding: "1rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <CheckCircle size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Currently Assigned Doctor Section */}
      {assignedDoctors.length > 0 && (
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem" }}>
            <UserCheck size={18} /> Currently Assigned Physician
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {assignedDoctors.map((doc) => (
              <div key={doc.id} style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.2rem" }}>{doc.doctorName || "Dr. Medical Supervisor"}</h3>
                <div style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem" }}>
                  {doc.doctorSpecialization || "Attending Medical Physician"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Assigned Date: {doc.assignedDate || "Active"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Directory of Multiple Doctors */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Verified Physicians Directory</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Showing {allDoctors.length} Verified Specialist{allDoctors.length === 1 ? "" : "s"}
          </span>
        </div>

        {allDoctors.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "var(--radius-lg)" }}>
            <Stethoscope size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p>No verified doctors found in the directory at this moment.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {allDoctors.map((doc) => {
              const isAssigned = assignedUserIds.has(doc.userId);
              return (
                <div
                  key={doc.id || doc.userId}
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
                      Assigned Doctor
                    </div>
                  )}

                  <div>
                    {/* Header: Name, Degree & Specialization */}
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
                        {doc.firstName ? doc.firstName.charAt(0) : "D"}
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>
                          {doc.fullName || `Dr. ${doc.firstName} ${doc.lastName}`}
                        </h4>
                        <div style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                          {doc.specialization || "Clinical Medicine"}
                        </div>
                        {doc.degree && (
                          <div style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 500, marginTop: "0.2rem" }}>
                            Degree: {doc.degree}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* License Badge & Number */}
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
                        <ShieldCheck size={16} /> Verified License:
                      </div>
                      <code style={{ background: "rgba(0, 0, 0, 0.2)", padding: "0.2rem 0.4rem", borderRadius: "4px", color: "#e2e8f0" }}>
                        {doc.licenseNumber || "MD-CLIN-VERIFIED"}
                      </code>
                    </div>

                    {/* Achievements */}
                    {doc.achievements && (
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
                          <Award size={14} /> Clinical Achievements & Credentials:
                        </div>
                        <div style={{ color: "#cbd5e1", lineHeight: 1.4 }}>
                          {doc.achievements}
                        </div>
                      </div>
                    )}

                    {/* Info Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                      {doc.hospitalName && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Building size={14} color="var(--primary)" />
                          <span>{doc.hospitalName} {doc.hospitalAddress ? `(${doc.hospitalAddress})` : ""}</span>
                        </div>
                      )}
                      {doc.yearsExperience && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Sparkles size={14} color="var(--accent)" />
                          <span>Experience: {doc.yearsExperience} Years Clinical Practice</span>
                        </div>
                      )}
                      {doc.email && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Mail size={14} color="var(--primary)" />
                          <span>{doc.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Affiliated Clinical Dietitians Team */}
                    {(() => {
                      const docLast = doc.lastName ? doc.lastName.toLowerCase() : "";
                      const affiliated = allDietitians.filter(
                        (d) =>
                          (docLast && d.achievements && d.achievements.toLowerCase().includes(docLast)) ||
                          (doc.hospitalName && d.clinicName && d.clinicName.toLowerCase().includes(doc.hospitalName.toLowerCase().slice(0, 10)))
                      );
                      if (affiliated.length === 0) return null;
                      return (
                        <div
                          style={{
                            background: "rgba(16, 185, 129, 0.05)",
                            border: "1px dashed rgba(16, 185, 129, 0.25)",
                            padding: "0.75rem",
                            borderRadius: "8px",
                            marginBottom: "1.25rem",
                          }}
                        >
                          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary)", marginBottom: "0.4rem" }}>
                            🌿 Clinical Dietitians Under Dr. {doc.lastName || "Physician"} ({affiliated.length}):
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                            {affiliated.map((ad) => (
                              <div
                                key={ad.id || ad.userId}
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#cbd5e1",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span>
                                  <strong>{ad.fullName || `${ad.firstName} ${ad.lastName}`}</strong> ({ad.degree || "RD"})
                                </span>
                                <span style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 600 }}>{ad.specialization}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                    {isAssigned ? (
                      <button className="btn btn-outline" disabled style={{ flex: 1, borderColor: "var(--primary)", color: "var(--primary)" }}>
                        <CheckCircle size={16} /> Currently Assigned
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectDoctor(doc.userId)}
                        className="btn btn-primary"
                        disabled={submittingId === doc.userId}
                        style={{ flex: 1 }}
                      >
                        {submittingId === doc.userId ? "Connecting..." : "Select as My Doctor"}
                      </button>
                    )}
                    {doc.licenseDocumentUrl && (
                      <a
                        href={doc.licenseDocumentUrl}
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
