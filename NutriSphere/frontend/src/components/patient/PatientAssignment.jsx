import {  useState  } from "react";
import { UserCheck } from "lucide-react";

export default function PatientAssignment({ onAssign, dietitians = [] }) {
  const [selectedDietitian, setSelectedDietitian] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign({
      dietitianUserId: selectedDietitian,
      patientEmail,
      notes,
    });
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "var(--radius-lg)" }}>
      <h4 style={{ margin: "0 0 1rem", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <UserCheck size={18} color="var(--primary)" /> Assign Patient to Dietitian
      </h4>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Patient Email</label>
          <input
            type="email"
            className="form-input"
            required
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            placeholder="patient@example.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Select Registered Dietitian</label>
          <select
            className="form-input"
            required
            value={selectedDietitian}
            onChange={(e) => setSelectedDietitian(e.target.value)}
          >
            <option value="">-- Choose a dietitian --</option>
            {dietitians.map((d) => (
              <option key={d.id} value={d.id}>
                {d.firstName} {d.lastName} ({d.specialization || "Clinical Nutrition"})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Clinical Referral Instructions</label>
          <textarea
            className="form-input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Patient diagnosed with Type 2 Diabetes; requires low-glycemic dietary prescription."
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Confirm Referral & Assignment
        </button>
      </form>
    </div>
  );
}
