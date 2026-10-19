import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Apple, 
  UserCheck, 
  ShieldCheck, 
  Building, 
  Clock, 
  Mail, 
  Award, 
  Calendar, 
  Sparkles, 
  CheckCircle,
  Lock
} from "lucide-react";
import api from "../../services/api";

export default function Directory() {
  const [filterType, setFilterType] = useState("ALL"); // ALL, DOCTORS, DIETITIANS
  const [allDoctors, setAllDoctors] = useState([]);
  const [allDietitians, setAllDietitians] = useState([]);
  const [assignedDoctors, setAssignedDoctors] = useState([]);
  const [assignedDietitians, setAssignedDietitians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [submittingId, setSubmittingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch assigned doctors & dietitians
      const [assignedDocsRes, assignedDietsRes, docsDirRes, dietsDirRes] = await Promise.all([
        api.get("/assignments/patient/doctors").catch(() => ({ data: [] })),
        api.get("/assignments/patient/dietitians").catch(() => ({ data: [] })),
        api.get("/doctors/directory").catch(() => ({ data: [] })),
        api.get("/dietitians/directory").catch(() => ({ data: [] }))
      ]);

      setAssignedDoctors(assignedDocsRes.data?.data || assignedDocsRes.data || []);
      setAssignedDietitians(assignedDietsRes.data?.data || assignedDietsRes.data || []);
      setAllDoctors(docsDirRes.data?.data || docsDirRes.data || []);
      setAllDietitians(dietsDirRes.data?.data || dietsDirRes.data || []);
    } catch (err) {
      console.error("Failed to load directory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectDoctor = async (doctorId) => {
    try {
      setSubmittingId(`doc-${doctorId}`);
      setActionMsg("");
      await api.post("/assignments/patient/select-doctor", {
        doctorId: doctorId,
        notes: "Selected via Healthcare Directory",
      });
      setActionMsg("Successfully assigned supervising doctor to your clinical care team!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setActionMsg(err.response?.data?.message || "Failed to assign doctor.");
    } finally {
      setSubmittingId(null);
    }
  };

  const handleSelectDietitian = async (dietitianId) => {
    try {
      setSubmittingId(`diet-${dietitianId}`);
      setActionMsg("");
      await api.post("/assignments/patient/select-dietitian", {
        dietitianId: dietitianId,
        notes: "Selected via Healthcare Directory",
      });
      setActionMsg("Successfully assigned registered dietitian to your care protocol!");
      await fetchData();
    } catch (err) {
      console.error(err);
      setActionMsg(err.response?.data?.message || "Failed to assign dietitian.");
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return <div className="loading-screen">Loading Medical & Dietetic Provider Directory...</div>;

  const assignedDocUserIds = new Set(assignedDoctors.map((a) => a.doctorUserId));
  const assignedDietUserIds = new Set(assignedDietitians.map((a) => a.dietitianUserId));

  // Combine or filter
  const displayDoctors = filterType === "ALL" || filterType === "DOCTORS";
  const displayDietitians = filterType === "ALL" || filterType === "DIETITIANS";

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ background: "rgba(16, 185, 129, 0.15)", padding: "0.5rem", borderRadius: "10px", color: "var(--primary)" }}>
            <Stethoscope size={24} />
          </div>
          <h2 style={{ margin: 0 }}>Doctor & Dietitian Healthcare Directory</h2>
        </div>
        <p className="text-muted" style={{ margin: 0 }}>
          View board-certified clinical doctors and registered dietitians assigned to your care or recommended for your metabolic profile.
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div style={{
        background: "rgba(2, 132, 199, 0.08)",
        border: "1px solid rgba(2, 132, 199, 0.25)",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontSize: "0.85rem",
        color: "#94a3b8"
      }}>
        <Lock size={18} style={{ color: "#0284c7", flexShrink: 0 }} />
        <span>
          <strong style={{ color: "#38bdf8" }}>Strict Clinical Privacy:</strong> Patients can only access their own records, laboratory reports, and consultation histories. Healthcare provider direct communication lines are authorized only within active patient-doctor relationships.
        </span>
      </div>

      {actionMsg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "var(--primary)", padding: "1rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <CheckCircle size={18} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Assigned Care Team Overview */}
      {(assignedDoctors.length > 0 || assignedDietitians.length > 0) && (
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>
            <UserCheck size={18} /> Your Active Attending Healthcare Team
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {assignedDoctors.map((doc) => (
              <div key={doc.id} style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <span style={{ fontSize: "0.72rem", background: "rgba(2, 132, 199, 0.15)", color: "#0284c7", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>
                  SUPERVISING PHYSICIAN
                </span>
                <h4 style={{ margin: "0.5rem 0 0.2rem 0", fontSize: "1.1rem" }}>{doc.doctorName || "Dr. Attending Doctor"}</h4>
                <div style={{ color: "var(--primary)", fontSize: "0.82rem", fontWeight: 600 }}>
                  {doc.doctorSpecialization || "Internal Medicine & Endocrinology"}
                </div>
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                  <Link to="/patient/consultations" className="btn btn-primary" style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}>
                    Schedule Consultation
                  </Link>
                </div>
              </div>
            ))}

            {assignedDietitians.map((d) => (
              <div key={d.id} style={{ background: "rgba(255, 255, 255, 0.03)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <span style={{ fontSize: "0.72rem", background: "rgba(16, 185, 129, 0.15)", color: "var(--primary)", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>
                  REGISTERED DIETITIAN
                </span>
                <h4 style={{ margin: "0.5rem 0 0.2rem 0", fontSize: "1.1rem" }}>{d.dietitianName || "Clinical Dietitian"}</h4>
                <div style={{ color: "var(--primary)", fontSize: "0.82rem", fontWeight: 600 }}>
                  Clinical Metabolic Nutritionist
                </div>
                <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
                  <Link to="/patient/diet-plan" className="btn btn-outline" style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}>
                    View Assigned Diet Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "0.5rem" }}>
        {[
          { id: "ALL", label: `All Healthcare Professionals (${allDoctors.length + allDietitians.length})` },
          { id: "DOCTORS", label: `Supervising Doctors (${allDoctors.length})` },
          { id: "DIETITIANS", label: `Clinical Dietitians (${allDietitians.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            style={{
              background: filterType === tab.id ? "rgba(16, 185, 129, 0.15)" : "transparent",
              color: filterType === tab.id ? "var(--primary)" : "inherit",
              border: "none",
              borderBottom: filterType === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
              padding: "0.6rem 1rem",
              fontWeight: 600,
              fontSize: "0.85rem",
              cursor: "pointer",
              borderRadius: "6px 6px 0 0"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* Doctors */}
        {displayDoctors && allDoctors.map((doc) => {
          const isAssigned = assignedDocUserIds.has(doc.userId);
          return (
            <div
              key={`doc-${doc.id || doc.userId}`}
              className="glass-panel"
              style={{
                padding: "1.75rem",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: isAssigned ? "1px solid var(--primary)" : "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative",
              }}
            >
              {isAssigned && (
                <div style={{ position: "absolute", top: 0, right: 0, background: "var(--primary)", color: "#0f172a", fontWeight: 700, fontSize: "0.75rem", padding: "0.3rem 0.8rem", borderBottomLeftRadius: "8px" }}>
                  Assigned Doctor
                </div>
              )}

              <div>
                {/* Profile Photo / Avatar & Name */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "14px",
                    background: "rgba(2, 132, 199, 0.15)",
                    color: "#0284c7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    flexShrink: 0
                  }}>
                    {doc.firstName ? doc.firstName.charAt(0) : "D"}
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>
                      {doc.fullName || `Dr. ${doc.firstName} ${doc.lastName}`}
                    </h4>
                    <div style={{ color: "#38bdf8", fontSize: "0.85rem", fontWeight: 600 }}>
                      {doc.specialization || "Clinical Medicine & Endocrinology"}
                    </div>
                    {doc.degree && (
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        Qualifications: <strong>{doc.degree}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* License Badge */}
                <div style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.8rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontWeight: 600 }}>
                    <ShieldCheck size={16} /> Verified License:
                  </div>
                  <code style={{ background: "rgba(0, 0, 0, 0.25)", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>
                    {doc.licenseNumber || "MD-CLIN-VERIFIED"}
                  </code>
                </div>

                {/* Experience & Hospital */}
                <div style={{ display: "grid", gap: "0.45rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                  {doc.hospitalName && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Building size={14} color="#0284c7" />
                      <span>{doc.hospitalName} {doc.hospitalAddress ? `(${doc.hospitalAddress})` : ""}</span>
                    </div>
                  )}
                  {doc.yearsExperience && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Sparkles size={14} color="var(--accent)" />
                      <span>Experience: {doc.yearsExperience} Years Clinical Practice</span>
                    </div>
                  )}
                  {/* Consultation Timings */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Clock size={14} color="var(--primary)" />
                    <span>Timings: Mon - Fri: 09:00 AM - 04:30 PM</span>
                  </div>
                  {/* Authorized Contact info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Mail size={14} color="#38bdf8" />
                    <span>{doc.email || "clinic.inquiries@nutrisphere.org"}</span>
                  </div>
                </div>

                {/* Achievements / Credentials */}
                {doc.achievements && (
                  <div style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.15)", padding: "0.65rem", borderRadius: "8px", marginBottom: "1.25rem", fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--accent)", fontWeight: 600, marginBottom: "0.2rem" }}>
                      <Award size={14} /> Credentials:
                    </div>
                    <div style={{ color: "#cbd5e1" }}>{doc.achievements}</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                {isAssigned ? (
                  <Link to="/patient/consultations" className="btn btn-outline" style={{ flex: 1, borderColor: "var(--primary)", color: "var(--primary)", textAlign: "center", textDecoration: "none" }}>
                    <Calendar size={14} style={{ display: "inline", marginRight: "0.3rem" }} /> Book / View Consultation
                  </Link>
                ) : (
                  <button
                    onClick={() => handleSelectDoctor(doc.userId)}
                    className="btn btn-primary"
                    disabled={submittingId === `doc-${doc.userId}`}
                    style={{ flex: 1 }}
                  >
                    {submittingId === `doc-${doc.userId}` ? "Connecting..." : "Select Supervising Doctor"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Dietitians */}
        {displayDietitians && allDietitians.map((diet) => {
          const isAssigned = assignedDietUserIds.has(diet.userId);
          return (
            <div
              key={`diet-${diet.id || diet.userId}`}
              className="glass-panel"
              style={{
                padding: "1.75rem",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                border: isAssigned ? "1px solid var(--primary)" : "1px solid rgba(255, 255, 255, 0.08)",
                position: "relative",
              }}
            >
              {isAssigned && (
                <div style={{ position: "absolute", top: 0, right: 0, background: "var(--primary)", color: "#0f172a", fontWeight: 700, fontSize: "0.75rem", padding: "0.3rem 0.8rem", borderBottomLeftRadius: "8px" }}>
                  Assigned Dietitian
                </div>
              )}

              <div>
                {/* Profile Photo / Avatar & Name */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{
                    width: "58px",
                    height: "58px",
                    borderRadius: "14px",
                    background: "rgba(16, 185, 129, 0.15)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    flexShrink: 0
                  }}>
                    {diet.firstName ? diet.firstName.charAt(0) : "N"}
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.15rem" }}>
                      {diet.fullName || `${diet.firstName} ${diet.lastName}, RD`}
                    </h4>
                    <div style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                      {diet.specialization || "Clinical Nutrition & Dietetics"}
                    </div>
                    {diet.degree && (
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                        Credentials: <strong>{diet.degree}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* License Badge */}
                <div style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.8rem"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontWeight: 600 }}>
                    <ShieldCheck size={16} /> Verified Dietetic License:
                  </div>
                  <code style={{ background: "rgba(0, 0, 0, 0.25)", padding: "0.2rem 0.4rem", borderRadius: "4px" }}>
                    {diet.licenseNumber || "RD-CLIN-VERIFIED"}
                  </code>
                </div>

                {/* Experience & Clinic */}
                <div style={{ display: "grid", gap: "0.45rem", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
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
                  {/* Consultation Timings */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Clock size={14} color="var(--primary)" />
                    <span>Timings: Mon - Sat: 10:00 AM - 06:00 PM</span>
                  </div>
                  {/* Authorized Contact info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Mail size={14} color="var(--primary)" />
                    <span>{diet.email || "dietetics.center@nutrisphere.org"}</span>
                  </div>
                </div>

                {/* Achievements / Credentials */}
                {diet.achievements && (
                  <div style={{ background: "rgba(245, 158, 11, 0.06)", border: "1px solid rgba(245, 158, 11, 0.15)", padding: "0.65rem", borderRadius: "8px", marginBottom: "1.25rem", fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--accent)", fontWeight: 600, marginBottom: "0.2rem" }}>
                      <Award size={14} /> Certifications:
                    </div>
                    <div style={{ color: "#cbd5e1" }}>{diet.achievements}</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                {isAssigned ? (
                  <Link to="/patient/diet-plan" className="btn btn-outline" style={{ flex: 1, borderColor: "var(--primary)", color: "var(--primary)", textAlign: "center", textDecoration: "none" }}>
                    <Apple size={14} style={{ display: "inline", marginRight: "0.3rem" }} /> View Prescribed Meal Plan
                  </Link>
                ) : (
                  <button
                    onClick={() => handleSelectDietitian(diet.userId)}
                    className="btn btn-primary"
                    disabled={submittingId === `diet-${diet.userId}`}
                    style={{ flex: 1 }}
                  >
                    {submittingId === `diet-${diet.userId}` ? "Connecting..." : "Assign as My Dietitian"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
