import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import LaboratoryReportCard from "../../components/medical/LaboratoryReportCard";
import LabValueTable from "../../components/medical/LabValueTable";
import api from "../../services/api";

export default function LaboratoryReports() {
  const navigate = useNavigate();
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [labPanels, setLabPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);
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

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/medical/laboratory?patientId=${selectedPatientId}`);
      const items = res.data?.data || res.data || [];
      setLabPanels(items);
      if (items.length > 0) setSelectedPanel(items[0]);
    } catch (_err) {
      const fallback = [
        {
          id: 1,
          testName: "Comprehensive Metabolic Panel (CMP)",
          testDate: "2026-09-15",
          notes: "Fasting glucose, electrolytes, and liver enzymes within normal physiological limits.",
          labValues: [
            { markerName: "Fasting Glucose", value: 94, unit: "mg/dL", referenceMin: 70, referenceMax: 99, flag: "NORMAL" },
            { markerName: "Serum Creatinine", value: 0.9, unit: "mg/dL", referenceMin: 0.7, referenceMax: 1.3, flag: "NORMAL" },
            { markerName: "eGFR", value: 98, unit: "mL/min/1.73m²", referenceMin: 90, referenceMax: 120, flag: "NORMAL" },
            { markerName: "ALT (Alanine Aminotransferase)", value: 24, unit: "U/L", referenceMin: 7, referenceMax: 56, flag: "NORMAL" },
          ],
        },
        {
          id: 2,
          testName: "Lipid Panel",
          testDate: "2026-08-20",
          notes: "Mild LDL elevation, optimal triglycerides.",
          labValues: [
            { markerName: "Total Cholesterol", value: 195, unit: "mg/dL", referenceMin: 125, referenceMax: 200, flag: "NORMAL" },
            { markerName: "LDL-C (Calculated)", value: 118, unit: "mg/dL", referenceMin: 0, referenceMax: 100, flag: "HIGH", isAbnormal: true },
            { markerName: "HDL-C", value: 58, unit: "mg/dL", referenceMin: 40, referenceMax: 90, flag: "NORMAL" },
            { markerName: "Triglycerides", value: 95, unit: "mg/dL", referenceMin: 0, referenceMax: 150, flag: "NORMAL" },
          ],
        },
      ];
      setLabPanels(fallback);
      setSelectedPanel(fallback[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    if (selectedPatientId) fetchLabs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId]);

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Laboratory Bloodwork & Biomarkers</h2>
          <p className="text-muted">Biochemical panels, reference ranges, and flagged abnormal values.</p>
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
            onClick={() => navigate(`/doctor/add-laboratory?patientId=${selectedPatientId}`)}
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Plus size={16} /> Record Lab Panel
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1.5rem" }}>
        {/* Panels List */}
        <div style={{ display: "grid", gap: "1rem", height: "fit-content" }}>
          {labPanels.map((panel) => (
            <div
              key={panel.id}
              onClick={() => setSelectedPanel(panel)}
              style={{
                cursor: "pointer",
                borderRadius: "var(--radius-lg)",
                border: selectedPanel?.id === panel.id ? "2px solid var(--primary)" : "none",
              }}
            >
              <LaboratoryReportCard labReport={panel} />
            </div>
          ))}
        </div>

        {/* Selected Panel Detailed Table */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
          {selectedPanel ? (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ margin: "0 0 0.25rem 0" }}>{selectedPanel.testName}</h3>
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Sample Date: {selectedPanel.testDate}
                </span>
                {selectedPanel.notes && (
                  <p className="text-muted" style={{ margin: "0.5rem 0 0 0", fontSize: "0.85rem" }}>
                    {selectedPanel.notes}
                  </p>
                )}
              </div>

              <LabValueTable labValues={selectedPanel.labValues || []} />
            </div>
          ) : (
            <p className="text-muted" style={{ textAlign: "center", padding: "2rem" }}>
              Select a laboratory report to inspect biomarker values.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
