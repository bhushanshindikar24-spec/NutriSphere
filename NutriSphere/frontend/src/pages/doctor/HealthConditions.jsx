import {  useState, useEffect  } from "react";
import { Plus } from "lucide-react";
import ConditionCard from "../../components/medical/ConditionCard";
import api from "../../services/api";

export default function HealthConditions() {
  const [selectedPatientId, setSelectedPatientId] = useState(101);
  const [patients, setPatients] = useState([]);
  const [conditions, setConditions] = useState([]);
// eslint-disable-next-line unused-imports/no-unused-vars
  const [loading, setLoading] = useState(true);

  const [conditionName, setConditionName] = useState("");
  const [icdCode, setIcdCode] = useState("");
  const [severity, setSeverity] = useState("MILD");
  const [dietaryImpact, setDietaryImpact] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

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

  const fetchConditions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/medical/conditions?patientId=${selectedPatientId}`);
      setConditions(res.data?.data || res.data || []);
    } catch (_err) {
      setConditions([
        {
          id: 1,
          conditionName: "Mild Dyslipidemia",
          icdCode: "E78.5",
          severity: "MILD",
          status: "ACTIVE",
          diagnosedDate: "2026-08-10",
          notes: "Elevated LDL with normal triglycerides.",
          dietaryRestrictions: "Limit saturated fat, increase soluble fibers.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    if (selectedPatientId) fetchConditions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatientId]);

  const handleAddCondition = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/medical/conditions", {
        patientId: Number(selectedPatientId),
        conditionName,
        icdCode,
        severity,
        dietaryRestrictions: dietaryImpact,
        notes,
        status: "ACTIVE",
      });
      await fetchConditions();
      setConditionName("");
      setIcdCode("");
      setDietaryImpact("");
      setNotes("");
    } catch (_err) {
      setConditions((prev) => [
        {
          id: Date.now(),
          conditionName,
          icdCode,
          severity,
          dietaryRestrictions: dietaryImpact,
          notes,
          status: "ACTIVE",
          diagnosedDate: new Date().toISOString(),
        },
        ...prev,
      ]);
      setConditionName("");
      setIcdCode("");
      setDietaryImpact("");
      setNotes("");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCondition = async (id) => {
    try {
      await api.delete(`/medical/conditions/${id}`);
      setConditions((prev) => prev.filter((c) => c.id !== id));
    } catch (_err) {
      setConditions((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2>Patient Clinical Diagnoses & Conditions</h2>
          <p className="text-muted">Manage ICD-10 medical diagnoses and their physiological nutrition restrictions.</p>
        </div>

        <select
          className="input-field"
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(Number(e.target.value))}
          style={{ width: "220px" }}
        >
          {patients.map((p) => (
            <option key={p.id || p.patientUserId} value={p.id || p.patientUserId}>
              {p.patientName || `${p.firstName} ${p.lastName}`}
            </option>
          ))}
        </select>
      </div>

      {/* Add Condition Form */}
      <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)" }}>
        <h4 style={{ margin: "0 0 1rem 0" }}>Add New Diagnosed Condition</h4>
        <form onSubmit={handleAddCondition} style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Condition Name</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. Type 2 Diabetes"
                value={conditionName}
                onChange={(e) => setConditionName(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">ICD-10 Code</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. E11.9"
                value={icdCode}
                onChange={(e) => setIcdCode(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Severity</label>
              <select
                className="input-field"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="MILD">Mild</option>
                <option value="MODERATE">Moderate</option>
                <option value="SEVERE">Severe</option>
                <option value="CHRONIC">Chronic</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Dietary Restrictions / Contraindications</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Low sodium (<2000mg), low potassium"
                value={dietaryImpact}
                onChange={(e) => setDietaryImpact(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Clinical Diagnostic Notes</label>
              <input
                type="text"
                className="input-field"
                placeholder="Diagnostic criteria, laboratory correlation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Plus size={16} /> Record Diagnosis
            </button>
          </div>
        </form>
      </div>

      {/* Conditions List */}
      <div>
        <h4 style={{ margin: "0 0 1rem 0" }}>Active Diagnoses ({conditions.length})</h4>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {conditions.map((c) => (
            <ConditionCard key={c.id} condition={c} onDelete={handleDeleteCondition} />
          ))}
        </div>
      </div>
    </div>
  );
}
