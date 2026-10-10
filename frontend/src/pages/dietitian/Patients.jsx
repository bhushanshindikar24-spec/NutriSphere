import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import PatientCard from "../../components/patient/PatientCard";
import api from "../../services/api";

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/dietitians/patients");
        setPatients(res.data?.data || res.data || []);
      } catch (_err) {
        setPatients([
          {
            id: 1,
            patientUserId: 101,
            patientName: "Alex Morgan",
            age: 32,
            gender: "Male",
            weightKg: 78.5,
            status: "ACTIVE",
            adherenceRate: 88,
            realityScore: 84,
            activeCondition: "Mild Dyslipidemia",
          },
          {
            id: 2,
            patientUserId: 102,
            patientName: "Sarah Jenkins",
            age: 45,
            gender: "Female",
            weightKg: 84.0,
            status: "ACTIVE",
            adherenceRate: 64,
            realityScore: 58,
            activeCondition: "Type 2 Diabetes (Pre-diabetic)",
          },
          {
            id: 3,
            patientUserId: 103,
            patientName: "Robert Chen",
            age: 58,
            gender: "Male",
            weightKg: 92.3,
            status: "ATTENTION_NEEDED",
            adherenceRate: 42,
            realityScore: 45,
            activeCondition: "Stage 1 Hypertension",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filtered = patients.filter((p) => {
    const name = (p.patientName || `${p.firstName || ""} ${p.lastName || ""}`).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesFilter =
      statusFilter === "ALL" ||
      (statusFilter === "ATTENTION" && (p.adherenceRate < 70 || p.status === "ATTENTION_NEEDED")) ||
      p.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="loading-screen">Loading Assigned Patients...</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Patient Roster</h2>
          <p className="text-muted">Monitor patient biometrics, adherence rates, and clinical nutrition plans.</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search patient name, condition, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: "2.5rem", width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {[
            { id: "ALL", label: "All Patients" },
            { id: "ATTENTION", label: "Attention Needed" },
            { id: "ACTIVE", label: "Active" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`btn btn-sm ${statusFilter === f.id ? "btn-primary" : "btn-outline"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Patients */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          No patients match the specified criteria.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {filtered.map((patient) => (
            <div
              key={patient.id || patient.patientUserId}
              className="glass-panel"
              style={{
                padding: "1.25rem",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div>
                <PatientCard patient={patient} />

                {/* Adherence and Reality Score Bar */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem", background: "rgba(255, 255, 255, 0.02)", padding: "0.75rem", borderRadius: "8px" }}>
                  <div>
                    <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Adherence</span>
                    <strong style={{ color: (patient.adherenceRate || 80) >= 75 ? "#10B981" : "#EF4444" }}>
                      {patient.adherenceRate || 80}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted" style={{ fontSize: "0.75rem", display: "block" }}>Reality Score</span>
                    <strong style={{ color: (patient.realityScore || 80) >= 70 ? "#10B981" : "#F59E0B" }}>
                      {patient.realityScore || 80} / 100
                    </strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/dietitian/patients/${patient.id || patient.patientUserId}`)}
                className="btn btn-outline"
                style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}
              >
                Open Patient Profile <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
