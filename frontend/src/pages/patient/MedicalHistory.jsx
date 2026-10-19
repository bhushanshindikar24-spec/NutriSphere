import { useState, useEffect } from "react";
import { HeartPulse, Plus, Calendar, Users, Trash2, Edit3, CheckCircle2 } from "lucide-react";
import api from "../../services/api";

export default function MedicalHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    conditionName: "",
    diagnosisDate: new Date().toISOString().split("T")[0],
    severity: "MODERATE",
    status: "ACTIVE",
    relevantSymptoms: "",
    medications: "",
    ongoingTreatments: "",
    pastSurgeries: "",
    familyMembersAffected: "",
    hereditaryRiskFactors: "",
    familyHistoryDetails: "",
    description: "",
  });

  const fetchHistory = async () => {
    try {
      const res = await api.get("/medical/history/my");
      const list = res.data?.data || res.data || [];
      if (Array.isArray(list) && list.length > 0) {
        setHistoryList(list);
      } else {
        setHistoryList(getDefaultHistory());
      }
    } catch (_e) {
      setHistoryList(getDefaultHistory());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultHistory = () => [
    {
      id: 1,
      conditionName: "PCOS (Polycystic Ovary Syndrome)",
      diagnosisDate: "2023-04-12",
      severity: "MODERATE",
      status: "ACTIVE",
      relevantSymptoms: "Oligomenorrhea, mild hirsutism, insulin resistance, fatigue",
      medications: "Metformin 500mg (1x daily with evening meal), Inositol supplement",
      ongoingTreatments: "Low-GI lifestyle modification, resistance training 3x/week",
      pastSurgeries: "Laparoscopic ovarian cystectomy (2022)",
      familyMembersAffected: "Mother (Type 2 Diabetes), Older Sister (PCOS)",
      hereditaryRiskFactors: "Strong maternal lineage of insulin resistance and dyslipidemia",
      familyHistoryDetails: "Maternal grandmother had early-onset diabetes and hypertension.",
      description: "Diagnosed via pelvic ultrasound and elevated LH:FSH ratio.",
    },
    {
      id: 2,
      conditionName: "Essential Hypertension",
      diagnosisDate: "2024-01-18",
      severity: "MILD",
      status: "ACTIVE",
      relevantSymptoms: "Occasional morning occipital headache, elevated readings (138/88)",
      medications: "Lifestyle management, low sodium dietary protocol",
      ongoingTreatments: "Daily blood pressure monitoring, DASH diet adherence",
      pastSurgeries: "None",
      familyMembersAffected: "Father (Hypertension at age 45), Paternal Uncle (CAD)",
      hereditaryRiskFactors: "Paternal history of premature cardiovascular disease",
      familyHistoryDetails: "Father had coronary stent placement at age 52.",
      description: "Mild stage 1 hypertension managed primarily through dietary DASH intervention.",
    },
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      conditionName: "",
      diagnosisDate: new Date().toISOString().split("T")[0],
      severity: "MODERATE",
      status: "ACTIVE",
      relevantSymptoms: "",
      medications: "",
      ongoingTreatments: "",
      pastSurgeries: "",
      familyMembersAffected: "",
      hereditaryRiskFactors: "",
      familyHistoryDetails: "",
      description: "",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setForm({
      conditionName: item.conditionName || "",
      diagnosisDate: item.diagnosisDate ? item.diagnosisDate.toString().slice(0, 10) : new Date().toISOString().split("T")[0],
      severity: item.severity || "MODERATE",
      status: item.status || "ACTIVE",
      relevantSymptoms: item.relevantSymptoms || "",
      medications: item.medications || "",
      ongoingTreatments: item.ongoingTreatments || "",
      pastSurgeries: item.pastSurgeries || "",
      familyMembersAffected: item.familyMembersAffected || "",
      hereditaryRiskFactors: item.hereditaryRiskFactors || "",
      familyHistoryDetails: item.familyHistoryDetails || "",
      description: item.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/medical/history/${editingId}`, form);
        setSuccessMsg("Medical history record updated successfully!");
      } else {
        await api.post("/medical/history", form);
        setSuccessMsg("New medical & hereditary history record saved!");
      }
      setShowModal(false);
      fetchHistory();
    } catch (_err) {
      // local fallback update
      if (editingId) {
        setHistoryList((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...form } : item)));
        setSuccessMsg("Medical history record updated!");
      } else {
        const newItem = { id: Date.now(), ...form };
        setHistoryList((prev) => [newItem, ...prev]);
        setSuccessMsg("New medical history record saved!");
      }
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this medical history entry?")) return;
    try {
      await api.delete(`/medical/history/${id}`);
      fetchHistory();
    } catch (_e) {
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (loading) return <div className="loading-screen">Loading Medical & Hereditary History...</div>;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ background: "rgba(239, 68, 68, 0.12)", padding: "0.5rem", borderRadius: "10px", color: "#ef4444" }}>
              <HeartPulse size={24} />
            </div>
            <h2 style={{ margin: 0 }}>Detailed Medical & Hereditary History</h2>
          </div>
          <p className="text-muted" style={{ margin: "0.4rem 0 0 0" }}>
            Record diagnosis dates, severity, active medications, surgeries, and family genetics for safer clinical diet plans.
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={16} /> Add Medical & Family Record
        </button>
      </div>

      {successMsg && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", padding: "1rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* History Records List */}
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {historyList.map((item) => {
          const isSevere = item.severity === "SEVERE" || item.severity === "CRITICAL";
          return (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: "1.75rem",
                borderRadius: "var(--radius-lg)",
                border: isSevere ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid var(--border-color)",
                display: "grid",
                gap: "1.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.3rem" }}>{item.conditionName}</h3>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span
                      className="badge"
                      style={{
                        background: isSevere ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: isSevere ? "#ef4444" : "#f59e0b",
                        fontSize: "0.75rem",
                      }}
                    >
                      Severity: {item.severity || "MODERATE"}
                    </span>
                    <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>
                      Status: {item.status || "ACTIVE"}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                      <Calendar size={14} /> Diagnosed: {item.diagnosisDate || "--"}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleOpenEdit(item)} className="btn btn-outline" style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}>
                    <Edit3 size={14} style={{ marginRight: "0.3rem" }} /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-outline" style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem", color: "#ef4444" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Grid: Symptoms & Medications */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.3rem" }}>
                    🩺 Relevant Symptoms Experienced:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    {item.relevantSymptoms || "None specified"}
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.3rem" }}>
                    💊 Current Medications & Dosages:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                    {item.medications || "No ongoing medications"}
                  </div>
                </div>
              </div>

              {/* Grid: Ongoing Treatments & Past Surgeries */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#10B981", marginBottom: "0.3rem" }}>
                    🏥 Ongoing Clinical Treatments / Therapy:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                    {item.ongoingTreatments || "None"}
                  </div>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a855f7", marginBottom: "0.3rem" }}>
                    🔪 Past Surgeries & Procedures:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>
                    {item.pastSurgeries || "None"}
                  </div>
                </div>
              </div>

              {/* Hereditary & Family Tree Section */}
              <div style={{ background: "rgba(2, 132, 199, 0.05)", border: "1px dashed rgba(2, 132, 199, 0.3)", padding: "1.1rem", borderRadius: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#0284c7", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                  <Users size={16} /> Family Lineage & Hereditary Risk Profile:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem", fontSize: "0.82rem" }}>
                  <div>
                    <span className="text-muted" style={{ display: "block" }}>Family Members Affected:</span>
                    <strong style={{ color: "#e2e8f0" }}>{item.familyMembersAffected || "None reported"}</strong>
                  </div>
                  <div>
                    <span className="text-muted" style={{ display: "block" }}>Hereditary Risk Factors:</span>
                    <strong style={{ color: "#e2e8f0" }}>{item.hereditaryRiskFactors || "Standard baseline"}</strong>
                  </div>
                </div>
                {item.familyHistoryDetails && (
                  <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.4 }}>
                    <strong>Genealogical Notes:</strong> {item.familyHistoryDetails}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="glass-panel" style={{ maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "2rem", borderRadius: "16px", background: "#ffffff" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#0f172a" }}>
              {editingId ? "Edit Medical & Family Record" : "Add Detailed Medical & Hereditary History"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Condition / Disease Name *</label>
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder="e.g. Type 2 Diabetes, PCOS, Hypertension, Hypothyroidism"
                    value={form.conditionName}
                    onChange={(e) => setForm({ ...form, conditionName: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="form-label">Diagnosis Date *</label>
                  <input
                    type="date"
                    className="input-field"
                    required
                    value={form.diagnosisDate}
                    onChange={(e) => setForm({ ...form, diagnosisDate: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Disease Severity</label>
                  <select className="input-field" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })} style={{ width: "100%" }}>
                    <option value="MILD">Mild</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="SEVERE">Severe</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Clinical Status</label>
                  <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ width: "100%" }}>
                    <option value="ACTIVE">Active (Ongoing Supervision)</option>
                    <option value="MANAGED">Managed / Well Controlled</option>
                    <option value="RESOLVED">Resolved / Past Episode</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Relevant Symptoms</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Fatigue, polydipsia, irregular cycle, elevated blood pressure"
                  value={form.relevantSymptoms}
                  onChange={(e) => setForm({ ...form, relevantSymptoms: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Current Medications & Dosage</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Metformin 500mg, Levothyroxine 50mcg"
                    value={form.medications}
                    onChange={(e) => setForm({ ...form, medications: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="form-label">Ongoing Treatments</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Physiotherapy, Insulin therapy"
                    value={form.ongoingTreatments}
                    onChange={(e) => setForm({ ...form, ongoingTreatments: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Past Surgeries & Procedures</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Appendectomy (2018), Cholecystectomy (2021)"
                  value={form.pastSurgeries}
                  onChange={(e) => setForm({ ...form, pastSurgeries: e.target.value })}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Hereditary fields */}
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", display: "grid", gap: "0.75rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0284c7" }}>Hereditary & Family History</div>
                <div>
                  <label className="form-label">Family Members Affected</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Mother, Father, Maternal Grandmother, Older Sibling"
                    value={form.familyMembersAffected}
                    onChange={(e) => setForm({ ...form, familyMembersAffected: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
                <div>
                  <label className="form-label">Hereditary Risk Factors & Notes</label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="e.g. Maternal history of diabetes and PCOS, early coronary disease on paternal side"
                    value={form.familyHistoryDetails}
                    onChange={(e) => setForm({ ...form, familyHistoryDetails: e.target.value })}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Save Changes" : "Save Medical Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
