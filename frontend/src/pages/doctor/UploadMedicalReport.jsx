import {  useState, useEffect  } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import api from "../../services/api";

export default function UploadMedicalReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState(preselectedPatientId);
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("LAB_REPORT");
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/doctors/patients");
        const list = res.data?.data || res.data || [];
        setPatients(list);
        if (!patientId && list.length > 0) setPatientId(list[0].id || list[0].patientUserId);
      } catch (_err) {
        setPatients([
          { id: 101, patientName: "Alex Morgan" },
          { id: 102, patientName: "Sarah Jenkins" },
        ]);
        if (!patientId) setPatientId("101");
      }
    };
    fetchPatients();
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("patientId", patientId);
      formData.append("title", title);
      formData.append("reportType", reportType);
      formData.append("reportDate", reportDate);
      formData.append("summary", summary);
      if (file) formData.append("file", file);

      await api.post("/medical/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/doctor/medical-reports");
    } catch (err) {
      console.error("Failed to upload report", err);
      navigate("/doctor/medical-reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/doctor/medical-reports")}
        className="btn btn-outline"
        style={{ marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Reports
      </button>

      <h2>Upload Diagnostic Clinical Document</h2>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)", marginTop: "1rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
          <div>
            <label className="form-label">Patient</label>
            <select
              className="input-field"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              style={{ width: "100%" }}
              required
            >
              {patients.map((p) => (
                <option key={p.id || p.patientUserId} value={p.id || p.patientUserId}>
                  {p.patientName || `${p.firstName} ${p.lastName}`} (ID: #{p.id || p.patientUserId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Document Title</label>
            <input
              type="text"
              className="input-field"
              required
              placeholder="e.g. 12-Lead ECG & Echocardiogram Summary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Document Category</label>
              <select
                className="input-field"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="LAB_REPORT">Biochemical / Lab Report</option>
                <option value="CLINICAL_NOTE">Consultation Summary</option>
                <option value="DIAGNOSTIC_IMAGING">Imaging / Ultrasound</option>
                <option value="PATHOLOGY">Pathology / Biopsy</option>
              </select>
            </div>

            <div>
              <label className="form-label">Date of Report</label>
              <input
                type="date"
                className="input-field"
                required
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Clinical Interpretation & Findings</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Summary of findings, reference range variances, and clinical implications..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="form-label">Attach File (PDF, PNG, JPG)</label>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ width: "100%", padding: "0.5rem 0" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/doctor/medical-reports")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Upload size={16} style={{ marginRight: "0.4rem" }} />
              {loading ? "Uploading..." : "Save & Attach Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
