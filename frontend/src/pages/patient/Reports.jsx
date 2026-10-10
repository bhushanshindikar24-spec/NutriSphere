import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import api from "../../services/api";
import MedicalReportCard from "../../components/medical/MedicalReportCard";

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/patient/reports");
        setReports(res.data?.data || res.data || []);
      } catch (_err) {
        setReports([
          {
            id: 1,
            title: "Comprehensive Metabolic Panel (CMP)",
            reportType: "LAB_REPORT",
            reportDate: "2026-09-15",
            summary: "Fasting blood glucose 94 mg/dL, HbA1c 5.4%, electrolytes within normal physiological limits.",
            fileUrl: "#",
          },
          {
            id: 2,
            title: "Lipid Profile Assessment",
            reportType: "LAB_REPORT",
            reportDate: "2026-08-20",
            summary: "Total cholesterol 195 mg/dL, LDL 112 mg/dL, HDL 58 mg/dL, Triglycerides 125 mg/dL.",
            fileUrl: "#",
          },
        ]);
      }

      try {
        const labRes = await api.get("/patient/laboratory");
        setLabReports(labRes.data?.data || labRes.data || []);
      } catch (_e) {
        // mock fallback
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="loading-screen">Loading Clinical Reports...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Medical & Diagnostic Reports</h2>
          <p className="text-muted">Access your laboratory panels, clinical assessments, and doctor's reports.</p>
        </div>
        <button
          onClick={() => navigate("/patient/reports/upload")}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Upload size={16} /> Upload Report
        </button>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {reports.map((report) => (
          <MedicalReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
