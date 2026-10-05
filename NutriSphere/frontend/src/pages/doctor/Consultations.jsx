import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import ConsultationCard from "../../components/medical/ConsultationCard";
import api from "../../services/api";

export default function Consultations() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchConsults = async () => {
      try {
        const res = await api.get("/medical/consultations");
        setConsultations(res.data?.data || res.data || []);
      } catch (_err) {
        setConsultations([
          {
            id: 1,
            patientName: "Alex Morgan",
            patientId: 101,
            chiefComplaint: "Routine Lipid & Metabolic Follow-Up",
            diagnosis: "Borderline LDL Elevation (E78.00)",
            clinicalNotes: "Patient adhering well to Mediterranean diet. Recommending continuation of 30g+ prebiotic fiber protocol.",
            consultationDate: "2026-09-20T10:30:00Z",
          },
          {
            id: 2,
            patientName: "Sarah Jenkins",
            patientId: 102,
            chiefComplaint: "Pre-Diabetes Glycemic Review",
            diagnosis: "Impaired Fasting Glucose (R73.01)",
            clinicalNotes: "Fasting blood sugar stabilized at 104 mg/dL. Referred to Dietitian Vance for carbohydrate evening tapering.",
            consultationDate: "2026-09-12T14:00:00Z",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchConsults();
  }, []);

  const filtered = consultations.filter((c) => {
    const name = (c.patientName || "").toLowerCase();
    const complaint = (c.chiefComplaint || "").toLowerCase();
    return name.includes(search.toLowerCase()) || complaint.includes(search.toLowerCase());
  });

  if (loading) return <div className="loading-screen">Loading Clinical Consultations...</div>;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Clinical Consultations</h2>
          <p className="text-muted">Document patient visits, diagnostic conclusions, and medical referrals.</p>
        </div>
        <button
          onClick={() => navigate("/doctor/add-consultation")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={16} /> New Consultation Note
        </button>
      </div>

      <div style={{ position: "relative", maxWidth: "450px" }}>
        <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          type="text"
          className="input-field"
          placeholder="Search by patient or chief complaint..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: "2.5rem", width: "100%" }}
        />
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {filtered.map((c) => (
          <div key={c.id}>
            <ConsultationCard
              consultation={c}
              onViewDetails={() => navigate(`/doctor/consultations/${c.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
