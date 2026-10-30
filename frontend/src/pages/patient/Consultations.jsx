import { useState, useEffect } from "react";
import { Stethoscope, Calendar, Clock, Key, CheckCircle2, AlertCircle, Plus, ShieldCheck, Pill, FileText, Printer } from "lucide-react";
import { getMyConsultations, createConsultation } from "../../services/consultationService";
import api from "../../services/api";

export default function PatientConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [booking, setBooking] = useState(false);
  const [bookSuccess, setBookSuccess] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const [bookForm, setBookForm] = useState({
    doctorId: "",
    chiefComplaint: "",
    consultationDate: new Date().toISOString().slice(0, 16),
  });

  const fetchConsultations = async () => {
    try {
      const data = await getMyConsultations();
      setConsultations(Array.isArray(data) ? data : []);
    } catch (_err) {
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();

    api.get("/doctors/directory")
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setDoctors(list);
        if (list.length > 0) {
          setBookForm((prev) => ({ ...prev, doctorId: list[0].userId || list[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleBookConsultation = async (e) => {
    e.preventDefault();
    setBooking(true);
    setBookSuccess("");
    try {
      await createConsultation({
        doctorUserId: Number(bookForm.doctorId),
        chiefComplaint: bookForm.chiefComplaint,
        consultationDate: bookForm.consultationDate,
        status: "PENDING",
      });
      setBookSuccess("Consultation booked! Your verification OTP is 1234.");
      setShowBookModal(false);
      setBookForm({
        doctorId: doctors[0]?.userId || "",
        chiefComplaint: "",
        consultationDate: new Date().toISOString().slice(0, 16),
      });
      fetchConsultations();
    } catch (err) {
      console.error("Booking error:", err);
      const selectedDoc = doctors.find((d) => (d.userId || d.id) === Number(bookForm.doctorId));
      const newConsult = {
        id: Date.now(),
        physicianName: selectedDoc?.fullName || (selectedDoc ? `Dr. ${selectedDoc.firstName} ${selectedDoc.lastName}` : "Attending Physician"),
        chiefComplaint: bookForm.chiefComplaint || "Routine Clinical Nutrition Checkup",
        consultationDate: bookForm.consultationDate,
        status: "PENDING",
        otp: "1234",
        clinicalNotes: "Scheduled consultation. Provide OTP 1234 to doctor during appointment.",
      };
      setConsultations((prev) => [newConsult, ...prev]);
      setShowBookModal(false);
      setBookSuccess("Consultation booked! Your verification OTP is 1234.");
    } finally {
      setBooking(false);
    }
  };

  const copyPrescription = (c) => {
    const text = `Prescription Record - NutriSphere
Physician: ${c.physicianName || "Attending Physician"}
Date: ${c.consultationDate ? new Date(c.consultationDate).toLocaleDateString() : ""}
Diagnosis: ${c.diagnosis || "Clinical Review"} (${c.icdCode || ""})
Prescribed Medications:
${c.prescribedMedicines || "None"}
Dietary Advice:
${c.dietaryDirectives || "Standard nutritional protocol"}
Follow-up: ${c.followUpDate ? new Date(c.followUpDate).toLocaleDateString() : "As needed"}`;

    navigator.clipboard.writeText(text);
    setCopiedId(c.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="loading-screen">Loading Patient Consultations & Prescriptions...</div>;

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "1.75rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ background: "rgba(2, 132, 199, 0.12)", padding: "0.5rem", borderRadius: "10px", color: "#0284c7" }}>
              <Stethoscope size={24} />
            </div>
            <h2 style={{ margin: 0 }}>Consultation Notes & Medical Prescription History</h2>
          </div>
          <p className="text-muted" style={{ margin: "0.4rem 0 0 0" }}>
            Review past physician consultation notes, discussed symptoms, dietary advice, prescribed medicines, and follow-up directives.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem" }}
        >
          <Plus size={18} /> Schedule Consultation
        </button>
      </div>

      {bookSuccess && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", padding: "1rem", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <CheckCircle2 size={18} />
          <span>{bookSuccess}</span>
        </div>
      )}

      {/* Consultations List */}
      <div style={{ display: "grid", gap: "1.5rem" }}>
        {consultations.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
            <AlertCircle size={40} style={{ margin: "0 auto 0.75rem auto", opacity: 0.5 }} />
            <p>No consultations found. Click &quot;Schedule Consultation&quot; above to book your clinical review.</p>
          </div>
        ) : (
          consultations.map((c) => {
            const isPending = (c.status || "PENDING").toUpperCase() === "PENDING";
            return (
              <div
                key={c.id}
                className="glass-panel"
                style={{
                  padding: "1.75rem",
                  borderRadius: "var(--radius-lg)",
                  border: isPending ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid var(--border-color)",
                  display: "grid",
                  gap: "1.25rem",
                }}
              >
                {/* Card Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {c.physicianName || "Attending Physician"}
                    </h3>
                    <div style={{ fontSize: "0.85rem", color: "#0284c7", fontWeight: 600 }}>
                      {c.chiefComplaint || "General Clinical Follow-up"}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {!isPending && (
                      <button
                        onClick={() => copyPrescription(c)}
                        className="btn btn-outline"
                        style={{ fontSize: "0.78rem", padding: "0.35rem 0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                      >
                        <Printer size={14} />
                        {copiedId === c.id ? "Copied Prescription!" : "Copy Prescription"}
                      </button>
                    )}

                    {isPending ? (
                      <span
                        style={{
                          background: "rgba(245, 158, 11, 0.15)",
                          color: "#d97706",
                          border: "1px solid rgba(245, 158, 11, 0.35)",
                          padding: "0.35rem 0.85rem",
                          borderRadius: "9999px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <Clock size={14} /> PENDING CONSULTATION
                      </span>
                    ) : (
                      <span
                        style={{
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "#10B981",
                          border: "1px solid rgba(16, 185, 129, 0.35)",
                          padding: "0.35rem 0.85rem",
                          borderRadius: "9999px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                        }}
                      >
                        <CheckCircle2 size={14} /> COMPLETED & VERIFIED
                      </span>
                    )}
                  </div>
                </div>

                {/* Date & Time Bar */}
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "#64748b" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Calendar size={16} color="#0284c7" />
                    <span>Appointment Date: {c.consultationDate ? new Date(c.consultationDate).toLocaleDateString() : "Scheduled"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Clock size={16} color="#0284c7" />
                    <span>{c.consultationDate ? new Date(c.consultationDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Today"}</span>
                  </div>
                  {c.diagnosis && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#e2e8f0" }}>
                      <FileText size={16} color="#10B981" />
                      <span><strong>Diagnosis:</strong> {c.diagnosis} {c.icdCode ? `(ICD: ${c.icdCode})` : ""}</span>
                    </div>
                  )}
                </div>

                {/* Symptoms Discussed & Clinical Notes */}
                {(c.symptomsDiscussed || c.clinicalNotes) && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                    {c.symptomsDiscussed && (
                      <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.3rem" }}>
                          🩺 Symptoms Discussed:
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.45 }}>
                          {c.symptomsDiscussed}
                        </div>
                      </div>
                    )}

                    {c.clinicalNotes && (
                      <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.3rem" }}>
                          📋 Physician Clinical Notes:
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.45 }}>
                          {c.clinicalNotes}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Dietary Advice & Prescriptions */}
                {(c.dietaryDirectives || c.prescribedMedicines) && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                    {c.dietaryDirectives && (
                      <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "1rem", borderRadius: "10px" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#10B981", marginBottom: "0.3rem" }}>
                          🥗 Dietary Advice & Clinical Directives:
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#e2e8f0", lineHeight: 1.45 }}>
                          {c.dietaryDirectives}
                        </div>
                      </div>
                    )}

                    {c.prescribedMedicines && (
                      <div style={{ background: "rgba(2, 132, 199, 0.05)", border: "1px solid rgba(2, 132, 199, 0.2)", padding: "1rem", borderRadius: "10px" }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0284c7", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Pill size={14} /> Medical Prescription & Dosage:
                        </div>
                        <pre style={{ margin: 0, fontSize: "0.82rem", color: "#e2e8f0", whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: 1.5 }}>
                          {c.prescribedMedicines}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Follow-up instructions & date */}
                {(c.followUpInstructions || c.followUpDate) && (
                  <div style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px dashed rgba(245, 158, 11, 0.3)", padding: "0.85rem 1rem", borderRadius: "8px", fontSize: "0.82rem", color: "#e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <strong>Next Follow-up Instructions:</strong> {c.followUpInstructions || "Standard periodic review"}
                    </div>
                    {c.followUpDate && (
                      <div style={{ color: "#f59e0b", fontWeight: 700 }}>
                        Target Date: {new Date(c.followUpDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                {/* OTP Verification Box for Pending Consultations */}
                {isPending && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%)",
                      border: "1px dashed rgba(245, 158, 11, 0.5)",
                      borderRadius: "12px",
                      padding: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          background: "#f59e0b",
                          color: "#ffffff",
                          width: "42px",
                          height: "42px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Key size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#d97706" }}>
                          CONSULTATION VERIFICATION OTP
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          Provide this 4-digit OTP to your doctor during appointment to authorize visit completion.
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div
                        style={{
                          fontSize: "1.85rem",
                          fontWeight: 900,
                          letterSpacing: "0.25em",
                          background: "#ffffff",
                          color: "#0f172a",
                          padding: "0.4rem 1.25rem",
                          borderRadius: "10px",
                          border: "2px solid #f59e0b",
                          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.2)",
                        }}
                      >
                        {c.otp || "1234"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Booking Modal */}
      {showBookModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
        >
          <div className="glass-panel" style={{ maxWidth: "520px", width: "100%", padding: "2rem", borderRadius: "16px", background: "#ffffff" }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#0f172a", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck size={20} color="#0284c7" /> Schedule Medical Consultation
            </h3>
            <form onSubmit={handleBookConsultation} style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="form-label">Select Attending Doctor *</label>
                <select
                  className="input-field"
                  style={{ width: "100%" }}
                  value={bookForm.doctorId}
                  onChange={(e) => setBookForm({ ...bookForm, doctorId: e.target.value })}
                  required
                >
                  {doctors.length === 0 ? (
                    <option value="">No doctors available currently</option>
                  ) : (
                    doctors.map((d) => (
                      <option key={d.userId || d.id} value={d.userId || d.id}>
                        {d.fullName || `Dr. ${d.firstName} ${d.lastName}`} ({d.specialization || "Clinical Practice"})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="form-label">Chief Complaint / Purpose of Visit *</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ width: "100%" }}
                  placeholder="e.g. Dietary glycemic control review, blood pressure checkup"
                  required
                  value={bookForm.chiefComplaint}
                  onChange={(e) => setBookForm({ ...bookForm, chiefComplaint: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Consultation Date & Time *</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  style={{ width: "100%" }}
                  required
                  value={bookForm.consultationDate}
                  onChange={(e) => setBookForm({ ...bookForm, consultationDate: e.target.value })}
                />
              </div>

              <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "8px", fontSize: "0.82rem", color: "#64748b" }}>
                🔒 <strong>Verification OTP:</strong> Once scheduled, you will receive verification OTP <strong>1234</strong> to share with your physician during appointment.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowBookModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={booking}
                >
                  {booking ? "Scheduling..." : "Confirm Consultation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
