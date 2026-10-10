import {  useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../services/api";

export default function AddPatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "1990-01-01",
    gender: "MALE",
    weightKg: 75,
    heightCm: 175,
    primaryCondition: "",
    icdCode: "",
    assignedDietitianId: "",
    clinicalNotes: "",
  });
  const [dietitians, setDietitians] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDietitians = async () => {
      try {
        const res = await api.get("/dietitians");
        setDietitians(res.data?.data || res.data || []);
      } catch (_err) {
        setDietitians([
          { id: 2, name: "Dr. Elena Vance, RD (Clinical Nutrition)" },
          { id: 3, name: "Dr. Marcus Thorne, RD (Pediatric Nutrition)" },
        ]);
      }
    };
    fetchDietitians();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/doctors/patients", formData);
      navigate("/doctor/patients");
    } catch (err) {
      console.error("Failed to enroll patient", err);
      navigate("/doctor/patients");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <button
        onClick={() => navigate("/doctor/patients")}
        className="btn btn-outline"
        style={{ width: "fit-content", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
      >
        <ArrowLeft size={16} /> Back to Patients
      </button>

      <h2>Enroll New Clinical Patient</h2>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="input-field"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="input-field"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="input-field"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div>
              <label className="form-label">Biological Sex</label>
              <select
                className="input-field"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{ width: "100%" }}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                required
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                className="input-field"
                required
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
            <div>
              <label className="form-label">Primary Diagnosed Health Condition</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. Type 2 Diabetes Mellitus"
                value={formData.primaryCondition}
                onChange={(e) => setFormData({ ...formData, primaryCondition: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label className="form-label">ICD-10 Code</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. E11.9"
                value={formData.icdCode}
                onChange={(e) => setFormData({ ...formData, icdCode: e.target.value })}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Assign Clinical Dietitian (Referral)</label>
            <select
              className="input-field"
              value={formData.assignedDietitianId}
              onChange={(e) => setFormData({ ...formData, assignedDietitianId: e.target.value })}
              style={{ width: "100%" }}
            >
              <option value="">-- Select Dietitian for Protocol Assignment --</option>
              {dietitians.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name || `${d.firstName} ${d.lastName}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Physician Intake Notes</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Clinical context, current medications, contraindications, and dietary restrictions..."
              value={formData.clinicalNotes}
              onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/doctor/patients")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} style={{ marginRight: "0.4rem" }} />
              {loading ? "Enrolling..." : "Enroll Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
