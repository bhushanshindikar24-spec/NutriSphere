import { useNavigate } from "react-router-dom";
import { Award, ShieldCheck, MapPin, Phone, Clock, Utensils, HeartPulse, CheckCircle2, ArrowLeft } from "lucide-react";

export default function KitchenProfile() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "1050px", margin: "0 auto", display: "grid", gap: "2rem" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <button
          onClick={() => navigate("/patient/hotel/menu")}
          className="btn btn-outline"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <ArrowLeft size={16} /> Back to Hotel Menu
        </button>
        <span style={{
          background: "#ecfdf5",
          color: "#059669",
          border: "1px solid #a7f3d0",
          padding: "0.35rem 0.85rem",
          borderRadius: "9999px",
          fontWeight: 700,
          fontSize: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem"
        }}>
          <CheckCircle2 size={15} /> 100% FSSAI Clinical Certified
        </span>
      </div>

      {/* Hero Kitchen Card */}
      <div style={{
        background: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)",
        color: "#ffffff",
        padding: "2.5rem",
        borderRadius: "20px",
        boxShadow: "0 14px 28px -5px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(254, 243, 199, 0.1)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{
              background: "rgba(245, 158, 11, 0.2)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              color: "#fde68a",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase"
            }}>
              Partner Culinary Facility
            </span>
            <span style={{ fontSize: "0.85rem", color: "#fef3c7" }}>★ 4.9 (1,240+ Clinical Meal Reviews)</span>
          </div>

          <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.75rem 0", color: "#ffffff" }}>
            NutriSphere Central Therapeutic Kitchen
          </h1>
          <p style={{ maxWidth: "700px", lineHeight: 1.6, fontSize: "0.95rem", color: "#ffedd5", margin: 0 }}>
            Specialized clinical commercial kitchen preparing customized Indian therapeutic diets. Operated under strict supervision of ICMR-trained clinical dietitians and certified master chefs.
          </p>
        </div>
      </div>

      {/* Grid of Certifications & Info */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {/* Card 1: FSSAI & Hygiene */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "16px", borderLeft: "4px solid #d97706" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Food Safety & Regulatory</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: "0.8rem" }}>Government of India Compliant</p>
            </div>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem", fontSize: "0.88rem" }}>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">FSSAI License:</span>
              <strong>FSSAI-LIC-11524999000123</strong>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">Hygiene Audit Rating:</span>
              <strong style={{ color: "#16a34a" }}>A+ Grade (99.2%)</strong>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">Cooking Temperature:</span>
              <strong>Maintained ≥ 65°C</strong>
            </li>
            <li style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">Water Filtration:</span>
              <strong>Medical UV-RO Sterilized</strong>
            </li>
          </ul>
        </div>

        {/* Card 2: Location & Operations */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "16px", borderLeft: "4px solid #0284c7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f0f9ff", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MapPin size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Kitchen Hub & Dispatch</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: "0.8rem" }}>Express Delivery Zones</p>
            </div>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem", fontSize: "0.88rem" }}>
            <li style={{ display: "flex", gap: "0.5rem" }}>
              <MapPin size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>Plot C-59, G-Block, Bandra Kurla Complex (BKC), Mumbai, MH 400051</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={16} color="#0284c7" />
              <span>Operating Hours: <strong>07:00 AM - 10:30 PM IST (Daily)</strong></span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Phone size={16} color="#0284c7" />
              <span>Direct Kitchen Helpline: <strong>+91 98220 12345</strong></span>
            </li>
          </ul>
        </div>

        {/* Card 3: Therapeutic Sourcing */}
        <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "16px", borderLeft: "4px solid #16a34a" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeartPulse size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Sourcing Standards</h3>
              <p className="text-muted" style={{ margin: 0, fontSize: "0.8rem" }}>Therapeutic Quality Ingredients</p>
            </div>
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem", fontSize: "0.88rem" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span>100% Desi Cow A2 Bilona Ghee</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span>Cold-Pressed Mustard, Sesame & Groundnut Oils</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span>Sendha Namak (Himalayan Pink Salt) for Hypertensive Patients</span>
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span>Millets & Low-GI Grains (Jowar, Bajra, Ragi, Brown Rice)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Chef & Clinical Team */}
      <div className="glass-panel" style={{ padding: "2rem", borderRadius: "18px" }}>
        <h3 style={{ margin: "0 0 1.25rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Utensils size={20} color="#d97706" /> Culinary Leadership & Nutrition Team
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200"
              alt="Executive Chef"
              style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", border: "2px solid #d97706" }}
            />
            <div>
              <h4 style={{ margin: "0 0 0.2rem 0" }}>Chef Rajesh Deshmukh</h4>
              <p className="text-muted" style={{ margin: "0 0 0.3rem 0", fontSize: "0.82rem" }}>Executive Therapeutic Chef (20+ Yrs Exp.)</p>
              <span style={{ fontSize: "0.75rem", background: "#fef3c7", color: "#78350f", padding: "0.15rem 0.5rem", borderRadius: "6px", fontWeight: 600 }}>
                Ayurvedic & ICMR Certified
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <img
              src="https://images.unsplash.com/photo-1594824813633-4f9640825227?w=200"
              alt="Lead Dietitian"
              style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", border: "2px solid #0284c7" }}
            />
            <div>
              <h4 style={{ margin: "0 0 0.2rem 0" }}>Dr. Ananya Sharma, RD</h4>
              <p className="text-muted" style={{ margin: "0 0 0.3rem 0", fontSize: "0.82rem" }}>Chief Clinical Dietitian (AIIMS Gold Medalist)</p>
              <span style={{ fontSize: "0.75rem", background: "#f0f9ff", color: "#0284c7", padding: "0.15rem 0.5rem", borderRadius: "6px", fontWeight: 600 }}>
                Renal & Diabetic Diet Specialist
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
