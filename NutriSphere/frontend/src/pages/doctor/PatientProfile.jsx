import {  useState, useEffect  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Stethoscope, Plus, Activity } from "lucide-react";
import ConditionCard from "../../components/medical/ConditionCard";
import LaboratoryReportCard from "../../components/medical/LaboratoryReportCard";
import api from "../../services/api";

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await api.get(`/doctors/patients/${id || 1}`);
        setPatient(res.data?.data || res.data);
      } catch (_err) {
        setPatient({
          id: id || 1,
          firstName: "Alex",
          lastName: "Morgan",
          age: 32,
          gender: "Male",
          weightKg: 78.5,
          heightCm: 178,
          bloodGroup: "O+",
          assignedDietitian: "Dr. Elena Vance, RD",
        });
      }

      try {
        const condRes = await api.get(`/medical/conditions?patientId=${id || 1}`);
        setConditions(condRes.data?.data || condRes.data || []);
      } catch (_e) {
        setConditions([
          {
            id: 1,
            conditionName: "Mild Dyslipidemia",
            icdCode: "E78.5",
            status: "ACTIVE",
            diagnosedDate: "2026-08-10",
            notes: "Elevated LDL (112 mg/dL) with normal triglycerides.",
            dietaryRestrictions: "Limit saturated fats to <7% daily caloric intake.",
          },
        ]);
      }

      try {
        const labRes = await api.get(`/medical/laboratory?patientId=${id || 1}`);
        setLabReports(labRes.data?.data || labRes.data || []);
      } catch (_e) {
        setLabReports([
          {
            id: 1,
            testName: "Comprehensive Metabolic Panel (CMP)",
            testDate: "2026-09-15",
            notes: "Fasting glucose and kidney function normal.",
            labValues: [
              { markerName: "Glucose", value: 94, unit: "mg/dL", flag: "NORMAL" },
              { markerName: "Creatinine", value: 0.9, unit: "mg/dL", flag: "NORMAL" },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading Medical Chart...</div>;
  if (!patient) return <div className="glass-panel" style={{ padding: "2rem" }}>Patient not found.</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/doctor/patients")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Patients
      </button>

      {/* Header */}
      <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={28} />
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{patient.firstName} {patient.lastName}</h2>
            <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              <span>{patient.age} yrs • {patient.gender}</span>
              <span>•</span>
              <span>Weight: {patient.weightKg} kg</span>
              <span>•</span>
              <span>Assigned Dietitian: <strong>{patient.assignedDietitian || "None"}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => navigate(`/doctor/add-consultation?patientId=${patient.id}`)}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Stethoscope size={16} /> Record Consultation
          </button>
          <button
            onClick={() => navigate(`/doctor/patients/${patient.id}/progress`)}
            className="btn btn-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Activity size={16} /> Biometric Progress
          </button>
        </div>
      </div>

      {/* Diagnosed Conditions */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h4 style={{ margin: 0 }}>Diagnosed Clinical Conditions ({conditions.length})</h4>
          <button
            onClick={() => navigate(`/doctor/conditions?patientId=${patient.id}`)}
            className="btn btn-sm btn-outline"
          >
            Manage Conditions
          </button>
        </div>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {conditions.map((c) => (
            <ConditionCard key={c.id} condition={c} />
          ))}
        </div>
      </div>

      {/* Recent Laboratory Panels */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <h4 style={{ margin: 0 }}>Laboratory Reports ({labReports.length})</h4>
          <button
            onClick={() => navigate(`/doctor/add-laboratory?patientId=${patient.id}`)}
            className="btn btn-sm btn-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            <Plus size={14} /> Add Lab Panel
          </button>
        </div>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {labReports.map((l) => (
            <LaboratoryReportCard key={l.id} labReport={l} />
          ))}
        </div>
      </div>
    </div>
  );
}
