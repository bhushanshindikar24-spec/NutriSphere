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
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg-color)" }}>
      {/* Navbar */}
      <nav style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0.9rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <div style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)",
              color: "#ffffff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.35rem",
              fontWeight: "800",
              boxShadow: "0 4px 12px rgba(2, 132, 199, 0.28)"
            }}>
              +
            </div>
            <div>
              <span style={{ fontSize: "1.35rem", fontWeight: "800", color: "#0284c7", letterSpacing: "-0.02em" }}>
                NutriSphere
              </span>
              <p style={{ margin: 0, fontSize: "0.68rem", color: "#64748b", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Clinical Intelligence
              </p>
            </div>
          </Link>

          <span style={{ 
            background: "#f0f9ff", 
            color: "#0284c7", 
            padding: "0.25rem 0.75rem", 
            borderRadius: "9999px", 
            fontSize: "0.75rem",
            fontWeight: 700,
            border: "1px solid rgba(2, 132, 199, 0.2)",
            letterSpacing: "0.04em"
          }}>
            {user?.role}
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{
              background: "#f0f9ff",
              border: "1px solid rgba(2, 132, 199, 0.2)",
              color: "#0284c7",
              padding: "0.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <UserIcon size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a" }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.75rem" }}>
                {user?.email}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#475569",
              fontSize: "0.875rem",
              fontWeight: 600,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              transition: "var(--transition)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ef4444";
              e.currentTarget.style.color = "#ef4444";
              e.currentTarget.style.background = "#fef2f2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.color = "#475569";
              e.currentTarget.style.background = "#ffffff";
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
          width: "260px",
          borderRight: "1px solid #e2e8f0",
          background: "#ffffff",
          padding: "1.75rem 1rem"
        }}>
          <div style={{ padding: "0 0.75rem 0.75rem 0.75rem", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Workspace Navigation
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {getNavLinks().map(link => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path} style={{ marginBottom: "0.35rem" }}>
                  <Link to={link.path} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.7rem 1rem",
                    borderRadius: "10px",
                    textDecoration: "none",
                    color: isActive ? "#0284c7" : "#475569",
                    background: isActive ? "#f0f9ff" : "transparent",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.9rem",
                    borderLeft: isActive ? "3px solid #0284c7" : "3px solid transparent",
                    boxShadow: isActive ? "0 1px 3px rgba(2, 132, 199, 0.06)" : "none",
                    transition: "var(--transition)"
                  }}>
                    <span style={{ color: isActive ? "#0284c7" : "#64748b", display: "flex" }}>
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: "2.5rem 2.5rem", background: "var(--bg-color)", overflowY: "auto" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
