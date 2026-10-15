import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Users, Search, CheckCircle, ArrowLeft, ShieldCheck, Award, Building, Sparkles, UserCheck } from "lucide-react";
import api from "../../services/api";

export default function AssignDietitian() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [dietitians, setDietitians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [assigningId, setAssigningId] = useState(null);
  const [referralNotes, setReferralNotes] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, dietitiansRes] = await Promise.all([
          api.get("/doctors/patients").catch(() => ({ data: [] })),
          api.get("/dietitians/directory").catch(() => ({ data: [] })),
        ]);

        const patientList = patientsRes.data?.data || patientsRes.data || [];
        setPatients(Array.isArray(patientList) ? patientList : []);

        const dietitianList = dietitiansRes.data?.data || dietitiansRes.data || [];
        setDietitians(Array.isArray(dietitianList) ? dietitianList : []);

        if (!selectedPatientId && patientList.length > 0) {
          const firstId = patientList[0].patientUserId || patientList[0].id;
          setSelectedPatientId(String(firstId));
        }
      } catch (err) {
        console.error("Failed to load clinical data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPatientId]);

  const handleAssign = async (dietitianId) => {
    if (!selectedPatientId) {
      setMessage({ type: "error", text: "Please select a patient to assign this dietitian to." });
      return;
    }

    setAssigningId(dietitianId);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/assignments/doctor/assign-dietitian", {
        patientId: Number(selectedPatientId),
        dietitianId: Number(dietitianId),
        notes: referralNotes || "Doctor referral for therapeutic nutritional protocol",
      });

      setMessage({
        type: "success",
        text: `Successfully assigned Dietitian (ID: #${dietitianId}) to patient!`,
      });

      // Update local state if patient list contains assignedDietitian
      setPatients((prev) =>
        prev.map((p) => {
          if (String(p.patientUserId || p.id) === String(selectedPatientId)) {
            const diet = dietitians.find((d) => String(d.userId || d.id) === String(dietitianId));
            return {
              ...p,
              assignedDietitian: diet?.fullName || diet?.name || `Dietitian #${dietitianId}`,
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error("Failed to assign dietitian", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to assign dietitian. Please try again.",
      });
    } finally {
      setAssigningId(null);
    }
  };

  const filteredDietitians = dietitians.filter((d) => {
    const term = search.toLowerCase();
    const name = (d.fullName || d.name || `${d.firstName || ""} ${d.lastName || ""}`).toLowerCase();
    const spec = (d.specialization || "").toLowerCase();
    const clinic = (d.clinicName || "").toLowerCase();
    const idStr = String(d.userId || d.id || "");
    return name.includes(term) || spec.includes(term) || clinic.includes(term) || idStr.includes(term);
  });

  const selectedPatient = patients.find(
    (p) => String(p.patientUserId || p.id) === String(selectedPatientId)
  );

  if (loading) {
    return <div className="loading-screen">Loading Dietitian Directory & Patient Roster...</div>;
  }

  return (
    <div style={{ maxWidth: "1150px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.75rem", fontSize: "0.85rem" }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 style={{ margin: "0 0 0.35rem 0", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Users size={26} color="var(--primary)" /> Assign Clinical Dietitian
          </h2>
          <p className="text-muted" style={{ margin: 0 }}>
            Refer patients to verified clinical nutritionists and dietitians with verified Dietitian IDs.
          </p>
        </div>

        <Link to="/doctor/patients" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
          View All Patients
        </Link>
      </div>

      {/* Status Alert Banner */}
      {message.text && (
        <div
          style={{
            background: message.type === "success" ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)",
            border: `1px solid ${message.type === "success" ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
            color: message.type === "success" ? "#10B981" : "#EF4444",
            padding: "1rem 1.25rem",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontWeight: 600,
          }}
        >
          <CheckCircle size={20} />
          <span>{message.text}</span>
        </div>
      )}

      {/* Patient Selection & Referral Configuration Panel */}
      <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem", color: "#0f172a" }}>
          1. Select Target Patient for Referral
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", alignItems: "flex-end" }}>
          <div>
            <label className="form-label">Patient</label>
            <select
              className="input-field"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              style={{ width: "100%" }}
            >
              {patients.length === 0 ? (
                <option value="">No patients available in census</option>
              ) : (
                patients.map((p) => {
                  const pId = p.patientUserId || p.id;
                  const name = p.patientName || `${p.firstName || "Patient"} ${p.lastName || ""}`;
                  return (
                    <option key={pId} value={pId}>
                      [ID: #{pId}] {name} {p.activeCondition ? `— ${p.activeCondition}` : ""}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          <div>
            <label className="form-label">Clinical Referral Instructions / Dietary Guidelines</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Strict low glycemic index, restrict sodium to <2000mg"
              value={referralNotes}
              onChange={(e) => setReferralNotes(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {selectedPatient && (
          <div style={{ marginTop: "1rem", padding: "0.85rem 1rem", background: "rgba(2, 132, 199, 0.05)", borderRadius: "8px", border: "1px solid rgba(2, 132, 199, 0.15)", display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem" }}>
            <div>
              <span className="text-muted">Target Patient: </span>
              <strong>{selectedPatient.patientName || `Patient #${selectedPatient.patientUserId || selectedPatient.id}`}</strong>
            </div>
            <div>
              <span className="text-muted">Current Dietitian: </span>
              <strong style={{ color: selectedPatient.assignedDietitian ? "#0284c7" : "#64748b" }}>
                {selectedPatient.assignedDietitian || "None Assigned"}
              </strong>
            </div>
            <div>
              <span className="text-muted">Condition: </span>
              <strong>{selectedPatient.activeCondition || "Clinical Supervision"}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Dietitians Directory Section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.2rem" }}>
              2. Choose from Verified Dietitians Directory
            </h3>
            <span className="text-muted" style={{ fontSize: "0.85rem" }}>
              Showing {filteredDietitians.length} of {dietitians.length} credentialed practitioners
            </span>
          </div>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              className="input-field"
              placeholder="Filter by ID, name, specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "2.4rem", width: "100%", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        {filteredDietitians.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", borderRadius: "var(--radius-lg)" }}>
            <Users size={40} style={{ opacity: 0.3, marginBottom: "0.75rem" }} />
            <p style={{ margin: 0 }}>No dietitians found matching the query.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
            {filteredDietitians.map((diet) => {
              const dietId = diet.userId || diet.id;
              const isCurrent =
                selectedPatient &&
                selectedPatient.assignedDietitian &&
                selectedPatient.assignedDietitian.toLowerCase().includes(
                  (diet.fullName || diet.lastName || "").toLowerCase()
                );

              return (
                <div
                  key={dietId}
                  className="glass-panel"
                  style={{
                    padding: "1.5rem",
                    borderRadius: "var(--radius-lg)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: isCurrent ? "2px solid #0284c7" : "1px solid var(--border-color)",
                    background: isCurrent ? "rgba(2, 132, 199, 0.02)" : "#ffffff",
                    position: "relative",
                  }}
                >
                  {/* Top Bar with Prominent Dietitian ID */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: "rgba(2, 132, 199, 0.1)",
                          color: "#0284c7",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                        }}
                      >
                        {diet.firstName ? diet.firstName.charAt(0) : "D"}
                      </div>
                      <div>
                        <h4 style={{ margin: "0 0 0.2rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                          {diet.fullName || `Dr. ${diet.firstName || ""} ${diet.lastName || ""}`.trim()}
                        </h4>
                        <div style={{ color: "#0284c7", fontSize: "0.82rem", fontWeight: 600 }}>
                          {diet.specialization || "Clinical Dietetics & Nutrition"}
                        </div>
                      </div>
                    </div>

                    {/* Highly Visible Dietitian ID Badge */}
                    <div
                      style={{
                        background: "#0284c7",
                        color: "#ffffff",
                        padding: "0.3rem 0.65rem",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        letterSpacing: "0.03em",
                        boxShadow: "0 2px 6px rgba(2, 132, 199, 0.25)",
                      }}
                    >
                      Dietitian ID: #{dietId}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div style={{ display: "grid", gap: "0.6rem", fontSize: "0.82rem", color: "#64748b", marginBottom: "1.25rem" }}>
                    {diet.clinicName && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Building size={14} color="#0284c7" />
                        <span>{diet.clinicName} {diet.clinicAddress ? `(${diet.clinicAddress})` : ""}</span>
                      </div>
                    )}

                    {diet.licenseNumber && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <ShieldCheck size={14} color="#10B981" />
                        <span>License: <strong>{diet.licenseNumber}</strong></span>
                      </div>
                    )}

                    {diet.yearsExperience && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Sparkles size={14} color="#f59e0b" />
                        <span>{diet.yearsExperience} Years Clinical Experience</span>
                      </div>
                    )}

                    {diet.achievements && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", background: "rgba(245, 158, 11, 0.05)", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
                        <Award size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ color: "#475569" }}>{diet.achievements}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div style={{ marginTop: "auto" }}>
                    {isCurrent ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.4rem",
                          padding: "0.6rem",
                          borderRadius: "8px",
                          background: "rgba(2, 132, 199, 0.08)",
                          color: "#0284c7",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        <UserCheck size={16} /> Currently Assigned to Patient
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAssign(dietId)}
                        disabled={assigningId === dietId || !selectedPatientId}
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                          fontSize: "0.85rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        {assigningId === dietId ? "Assigning Referral..." : `Assign Dietitian (ID: #${dietId})`}
                      </button>
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
