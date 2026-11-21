import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, MapPin, Phone, Mail, Utensils, CheckCircle2, ArrowLeft, User } from "lucide-react";
import api from "../../../services/api";

// Partner kitchen profiles, loaded from admin-approved hotel accounts.
// Optional ?hotelUserId=<id> shows a single kitchen; otherwise all approved kitchens are listed.
export default function KitchenProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hotelUserId = searchParams.get("hotelUserId");
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(hotelUserId ? `/hotel/kitchens/${hotelUserId}` : "/hotel/kitchens");
        const data = res.data?.data ?? res.data;
        setKitchens(Array.isArray(data) ? data : data ? [data] : []);
      } catch (err) {
        setKitchens([]);
        setError(err.response?.data?.message || "Could not load kitchen details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hotelUserId]);

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      <div>
        <button
          onClick={() => navigate("/patient/hotel/menu")}
          className="btn btn-outline"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={16} /> Back to Hotel Menu
        </button>
      </div>

      {loading ? (
        <div className="loading-screen">Loading partner kitchens...</div>
      ) : error ? (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "#EF4444" }}>{error}</div>
      ) : kitchens.length === 0 ? (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
          No verified partner kitchens are available yet.
        </div>
      ) : (
        kitchens.map((k) => <KitchenCard key={k.userId ?? k.id} kitchen={k} />)
      )}
    </div>
  );
}

function KitchenCard({ kitchen }) {
  const row = (Icon, label, value) =>
    value ? (
      <li style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
        <Icon size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: "2px" }} />
        <span>
          <span className="text-muted">{label}: </span>
          <strong>{value}</strong>
        </span>
      </li>
    ) : null;

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)",
          color: "#ffffff",
          padding: "2.5rem",
          borderRadius: "20px",
          boxShadow: "0 14px 28px -5px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
          <span
            style={{
              background: "rgba(245, 158, 11, 0.2)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#fde68a",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Partner Culinary Facility
          </span>
          {kitchen.verificationStatus === "APPROVED" && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "#a7f3d0" }}>
              <CheckCircle2 size={14} /> License verified by NutriSphere admin
            </span>
          )}
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.75rem 0", color: "#ffffff" }}>{kitchen.hotelName}</h1>
        {kitchen.description && (
          <p style={{ maxWidth: "700px", lineHeight: 1.6, fontSize: "0.95rem", color: "#ffedd5", margin: 0 }}>{kitchen.description}</p>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "16px", borderLeft: "4px solid #d97706" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={20} color="#d97706" /> Food Safety & Licensing
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem", fontSize: "0.88rem" }}>
            {row(ShieldCheck, "FSSAI License", kitchen.licenseNumber || "Not provided")}
            {row(Utensils, "Cuisine", kitchen.cuisineType)}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "16px", borderLeft: "4px solid #0284c7" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin size={20} color="#0284c7" /> Contact & Location
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem", fontSize: "0.88rem" }}>
            {row(User, "Contact", kitchen.contactName)}
            {row(MapPin, "Address", kitchen.hotelAddress)}
            {row(Phone, "Phone", kitchen.phoneNumber)}
            {row(Mail, "Email", kitchen.email)}
          </ul>
        </div>
      </div>
    </div>
  );
}
