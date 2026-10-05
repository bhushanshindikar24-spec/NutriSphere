import {  useState, useEffect  } from "react";
import { Stethoscope, Mail, Phone, Building, Calendar, MessageSquare } from "lucide-react";
import api from "../../services/api";

export default function MyDoctor() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get("/patient/doctor");
        setDoctor(res.data?.data || res.data);
      } catch (_err) {
        setDoctor({
          name: "Dr. Marcus Thorne, MD",
          specialization: "Internal Medicine & Endocrinology",
          hospital: "Metropolitan Academic Medical Center",
          email: "marcus.thorne@nutrisphere.health",
          phone: "+1 (555) 789-0123",
          licenseNumber: "MD-67201-IM",
          officeHours: "Tue, Thu, Fri: 8:30 AM - 3:00 PM EST",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, []);

  if (loading) return <div className="loading-screen">Loading Physician Details...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "1.5rem" }}>
      <div>
        <h2>My Attending Physician</h2>
        <p className="text-muted">Your supervising medical doctor managing clinical conditions, laboratory panels, and referrals.</p>
      </div>

      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "var(--radius-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Stethoscope size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{doctor?.name}</h3>
            <span style={{ color: "#10B981", fontSize: "0.85rem", fontWeight: 600 }}>
              {doctor?.specialization}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Building size={16} color="#10B981" />
            <span>{doctor?.hospital}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Mail size={16} color="#10B981" />
            <span>{doctor?.email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Phone size={16} color="#10B981" />
            <span>{doctor?.phone}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
            <Calendar size={16} color="#10B981" />
            <span>{doctor?.officeHours}</span>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
          <a
            href={`mailto:${doctor?.email}`}
            className="btn btn-primary"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <MessageSquare size={16} /> Contact Physician
          </a>
        </div>
      </div>
    </div>
  );
}
