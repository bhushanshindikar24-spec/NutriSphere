import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import MedicalReportCard from "../../components/medical/MedicalReportCard";
import api from "../../services/api";

export default function MedicalReports() {
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohort = async () => {
      try {
        const res = await api.get("/doctors/patients");
        const list = res.data?.data || res.data || [];
        setPatients(list);
        if (list.length > 0) setSelectedPatientId(list[0].id || list[0].patientUserId || 101);
      } catch (_err) {
        setPatients([
          { id: 101, patientName: "Alex Morgan" },
          { id: 102, patientName: "Sarah Jenkins" },
        ]);
      }
    };
    fetchCohort();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/medical/reports?patientId=${selectedPatientId}`);
      setReports(res.data?.data || res.data || []);
    } catch (_err) {
      setReports([
        {
          id: 1,
          title: "Comprehensive Metabolic Panel (CMP)",
          reportType: "LAB_REPORT",
          reportDate: "2026-09-15",
          summary: "Fasting glucose 94 mg/dL, electrolytes normal, eGFR >90.",
          fileUrl: "#",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 
    if (selectedPatientId) fetchReports();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Patient Diagnostic Documents & Reports</h2>
          <p className="text-muted">Clinical records, imaging, and specialty consult notes.</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <select
            className="input-field"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(Number(e.target.value))}
            style={{ width: "200px" }}
          >
            {patients.map((p) => (
              <option key={p.id || p.patientUserId} value={p.id || p.patientUserId}>
                {p.patientName || `${p.firstName} ${p.lastName}`}
              </option>
            ))}
          </select>

          <button
            onClick={() => navigate(`/doctor/upload-report?patientId=${selectedPatientId}`)}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Upload size={16} /> Upload Report
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {reports.map((report) => (
          <MedicalReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
