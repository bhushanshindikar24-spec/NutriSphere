import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, User as UserIcon, LayoutDashboard, Apple, Users, ClipboardList, Stethoscope, Utensils, ShoppingBag } from "lucide-react";

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case "PATIENT":
        return [
          { name: "Dashboard", path: "/patient", icon: <LayoutDashboard size={18} /> },
          { name: "My Diet Plan", path: "/patient/diet-plan", icon: <ClipboardList size={18} /> },
          { name: "Log Food & Water", path: "/patient/log-food", icon: <Apple size={18} /> },
          { name: "Doctors & Specialists", path: "/patient/doctor", icon: <Stethoscope size={18} /> },
          { name: "Clinical Dietitians", path: "/patient/dietitian", icon: <Users size={18} /> },
          { name: "Culinary Kitchen", path: "/patient/hotel/menu", icon: <Utensils size={18} /> },
          { name: "Home Food Mode", path: "/patient/home-food", icon: <Apple size={18} /> },
          { name: "Digital Twin", path: "/patient/digital-twin", icon: <ClipboardList size={18} /> },
          { name: "Orders", path: "/patient/hotel/orders", icon: <ShoppingBag size={18} /> },
        ];
      case "DIETITIAN":
        return [
          { name: "Dashboard", path: "/dietitian", icon: <LayoutDashboard size={18} /> },
          { name: "Patients", path: "/dietitian/patients", icon: <Users size={18} /> },
          { name: "Diet Plans", path: "/dietitian/plans", icon: <ClipboardList size={18} /> },
          { name: "Plan Approvals", path: "/dietitian/approvals", icon: <ClipboardList size={18} /> },
          { name: "Adaptive Engine", path: "/dietitian/adaptive", icon: <Apple size={18} /> },
        ];
      case "DOCTOR":
        return [
          { name: "Dashboard", path: "/doctor", icon: <LayoutDashboard size={18} /> },
          { name: "My Patients", path: "/doctor/patients", icon: <Users size={18} /> },
          { name: "Consultations", path: "/doctor/consultations", icon: <Stethoscope size={18} /> },
        ];
      case "HOTEL":
        return [
          { name: "Dashboard", path: "/hotel", icon: <LayoutDashboard size={18} /> },
          { name: "Orders Queue", path: "/hotel/orders", icon: <ShoppingBag size={18} /> },
          { name: "Culinary Menu", path: "/hotel/menu", icon: <Utensils size={18} /> },
        ];
      case "ADMIN":
        return [
          { name: "Overview", path: "/admin", icon: <LayoutDashboard size={18} /> },
          { name: "License Verifications", path: "/admin/verifications", icon: <Stethoscope size={18} /> },
          { name: "Users Directory", path: "/admin/users", icon: <Users size={18} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{
        background: "var(--bg-surface-glass)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.6rem" }}>🌿</span>
            <div>
              <h1 style={{ margin: 0, color: "var(--text-main)", fontSize: "1.35rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
                Healthy<span style={{ color: "var(--primary)" }}>One</span>
              </h1>
              <p style={{ margin: 0, fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Clinical Nutrition OS
              </p>
            </div>
          </div>
          <span style={{ 
            background: "var(--primary-light)", 
            color: "var(--primary)", 
            padding: "0.2rem 0.65rem", 
            borderRadius: "9999px", 
            fontSize: "0.75rem",
            fontWeight: 700,
            border: "1px solid rgba(16, 185, 129, 0.2)"
          }}>
            {user?.role}
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ background: "var(--bg-color)", padding: "0.5rem", borderRadius: "50%" }}>
              <UserIcon size={20} className="text-muted" />
            </div>
            <div>
              <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{user?.email}</div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid var(--border-color)",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--text-main)",
              transition: "var(--transition)"
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Body with Sidebar */}
      <div style={{ display: "flex", flex: 1 }}>
        <aside style={{
          width: "250px",
          borderRight: "1px solid var(--border-color)",
          background: "var(--bg-surface)",
          padding: "2rem 1rem"
        }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {getNavLinks().map(link => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path} style={{ marginBottom: "0.5rem" }}>
                  <Link to={link.path} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-md)",
                    textDecoration: "none",
                    color: isActive ? "var(--primary)" : "var(--text-main)",
                    background: isActive ? "var(--primary-light)" : "transparent",
                    fontWeight: isActive ? 600 : 500,
                    transition: "var(--transition)"
                  }}>
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: "2rem", background: "var(--bg-color)", overflowY: "auto" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
