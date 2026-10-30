import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { 
  LogOut, 
  User as UserIcon, 
  Settings as SettingsIcon,
  LayoutDashboard, 
  Apple, 
  Users, 
  ClipboardList, 
  Stethoscope, 
  Utensils, 
  ShoppingBag,
  Calculator,
  FileText,
  Activity,
  ShieldAlert,
  Dna,
  HeartPulse,
  CreditCard,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ArrowLeft
} from "lucide-react";

export default function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext) || { cartItems: [] };
  const cartCount = (cartItems || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isHotelSection = location.pathname.includes("/hotel");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getProfilePath = () => {
    switch (user?.role) {
      case "DOCTOR":
        return "/doctor/profile";
      case "DIETITIAN":
        return "/dietitian/profile";
      case "PATIENT":
      default:
        return "/patient/profile";
    }
  };

  const getSettingsPath = () => {
    switch (user?.role) {
      case "PATIENT":
        return "/patient/settings";
      default:
        return "/settings";
    }
  };

  const getHotelPath = () => {
    return user?.role === "HOTEL" ? "/hotel/menu" : "/patient/hotel/menu";
  };

  const getNavLinks = () => {
    if (!user) return [];

    // When in Hotel section, display all hotel items in the left section!
    if (isHotelSection) {
      if (user.role === "HOTEL") {
        return [
          { name: "Kitchen Dashboard", path: "/hotel/dashboard", icon: <LayoutDashboard size={18} /> },
          { name: "Orders Queue", path: "/hotel/orders", icon: <ShoppingBag size={18} /> },
          { name: "Culinary Menu", path: "/hotel/menu", icon: <Utensils size={18} /> },
          { name: "Category Management", path: "/hotel/manage-categories", icon: <ClipboardList size={18} /> },
        ];
      }
      return [
        { name: "Therapeutic Menu & Thalis", path: "/patient/hotel/menu", icon: <Utensils size={18} /> },
        { name: "Meal Plate Cart", path: "/patient/hotel/cart", icon: <ShoppingBag size={18} />, badge: cartCount > 0 ? cartCount : null },
        { name: "Express Checkout", path: "/patient/hotel/checkout", icon: <CreditCard size={18} /> },
        { name: "Live Orders & Tracking", path: "/patient/hotel/orders", icon: <Truck size={18} /> },
        { name: "Order History & Invoices", path: "/patient/hotel/order-history", icon: <FileText size={18} /> },
        { name: "Kitchen & FSSAI Standards", path: "/patient/hotel/kitchen-profile", icon: <ShieldCheck size={18} /> },
        { name: "Chef Special / Custom Request", path: "/patient/hotel/custom-request", icon: <Sparkles size={18} /> },
      ];
    }

    switch (user.role) {
      case "PATIENT":
        return [
          { name: "Dashboard", path: "/patient", icon: <LayoutDashboard size={18} /> },
          { name: "Diet Plan & Calendar", path: "/patient/diet-plan", icon: <ClipboardList size={18} /> },
          { name: "Daily Nutrition Report", path: "/patient/daily-report", icon: <FileText size={18} /> },
          { name: "Log Food & Water", path: "/patient/log-food", icon: <Apple size={18} /> },
          { name: "Nutrition Calculator", path: "/patient/nutrition-calculator", icon: <Calculator size={18} /> },
          { name: "Food Restrictions DB", path: "/patient/food-restrictions", icon: <ShieldAlert size={18} /> },
          { name: "Medical & Family History", path: "/patient/medical-history", icon: <Dna size={18} /> },
          { name: "Blood Reports & AI", path: "/patient/reports", icon: <Activity size={18} /> },
          { name: "Longitudinal Lab Trends", path: "/patient/lab-progress", icon: <HeartPulse size={18} /> },
          { name: "Consultations & Rx", path: "/patient/consultations", icon: <Stethoscope size={18} /> },
          { name: "Care Team Directory", path: "/patient/directory", icon: <Users size={18} /> },
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
          { name: "Assign Dietitian", path: "/doctor/assign-dietitian", icon: <Users size={18} /> },
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
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
        boxSizing: "border-box",
        flexShrink: 0
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
        
        {/* Top Right: Profile Symbol & Dropdown Menu */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User Profile Menu"
            aria-expanded={dropdownOpen}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: dropdownOpen ? "#e0f2fe" : "#f0f9ff",
              border: dropdownOpen ? "2px solid #0284c7" : "1.5px solid rgba(2, 132, 199, 0.28)",
              color: "#0284c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: dropdownOpen 
                ? "0 0 0 4px rgba(2, 132, 199, 0.18)" 
                : "0 2px 6px rgba(2, 132, 199, 0.12)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              padding: 0
            }}
            onMouseEnter={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.background = "#e0f2fe";
                e.currentTarget.style.borderColor = "#0284c7";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.background = "#f0f9ff";
                e.currentTarget.style.borderColor = "rgba(2, 132, 199, 0.28)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <span style={{ fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase", color: "#0284c7", lineHeight: 1 }}>
              {(user?.email || user?.firstName || "U").charAt(0).toUpperCase()}
            </span>
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: "250px",
              background: "#ffffff",
              borderRadius: "14px",
              boxShadow: "0 12px 28px -4px rgba(0, 0, 0, 0.12), 0 8px 12px -6px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e2e8f0",
              padding: "0.5rem",
              zIndex: 100,
              boxSizing: "border-box"
            }}>
              {/* User preview header */}
              <div style={{
                padding: "0.75rem 0.85rem 0.85rem",
                borderBottom: "1px solid #f1f5f9",
                marginBottom: "0.35rem"
              }}>
                <div style={{
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {user?.firstName ? `${user.firstName} ${user?.lastName || ""}` : "My Account"}
                </div>
                <div style={{
                  color: "#64748b",
                  fontSize: "0.78rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginTop: "0.15rem"
                }}>
                  {user?.email}
                </div>
                <span style={{
                  display: "inline-block",
                  marginTop: "0.45rem",
                  background: "#f0f9ff",
                  color: "#0284c7",
                  border: "1px solid rgba(2, 132, 199, 0.25)",
                  padding: "0.15rem 0.55rem",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.03em"
                }}>
                  {user?.role}
                </span>
              </div>

              {/* Option 1: My Profile */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate(getProfilePath());
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "transparent",
                  color: "#1e293b",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f9ff";
                  e.currentTarget.style.color = "#0284c7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#1e293b";
                }}
              >
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#f0f9ff",
                  color: "#0284c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <UserIcon size={16} />
                </div>
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>My Profile</span>
              </button>

              {/* Option 2: Settings */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate(getSettingsPath());
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "transparent",
                  color: "#1e293b",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f9ff";
                  e.currentTarget.style.color = "#0284c7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#1e293b";
                }}
              >
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#f8fafc",
                  color: "#475569",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <SettingsIcon size={16} />
                </div>
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Settings</span>
              </button>

              <div style={{ height: "1px", background: "#f1f5f9", margin: "0.35rem 0.5rem" }} />

              {/* Option 3: Logout */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "10px",
                  border: "none",
                  background: "transparent",
                  color: "#dc2626",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#fef2f2",
                  color: "#dc2626",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}>
                  <LogOut size={16} />
                </div>
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>Log Out</span>
              </button>
            </div>
          )}
        </div>
        </div>
      </nav>

      {/* Body with Sidebar */}
      <div style={{ display: "flex", flex: 1 }}>
        <aside style={{
          width: "260px",
          flexShrink: 0,
          borderRight: "1px solid #e2e8f0",
          background: isHotelSection ? "#fffdf9" : "#ffffff",
          padding: "1.5rem 1rem",
          position: "sticky",
          top: "64px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          alignSelf: "flex-start",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            {isHotelSection ? (
              <div style={{
                padding: "0.85rem 1rem",
                marginBottom: "1.25rem",
                background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                borderRadius: "14px",
                border: "1.5px solid #fde68a"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    boxShadow: "0 2px 6px rgba(217, 119, 6, 0.25)"
                  }}>
                    🍽️
                  </div>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#78350f" }}>
                      Hotel & Dining
                    </div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#b45309" }}>
                      Therapeutic Kitchen
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "0.68rem", color: "#92400e", marginTop: "0.35rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
                  <span>BKC Mumbai • Live FSSAI Kitchen</span>
                </div>
              </div>
            ) : (
              <div style={{ padding: "0 0.75rem 0.75rem 0.75rem", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Workspace Navigation
              </div>
            )}

            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {getNavLinks().map(link => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path} style={{ marginBottom: "0.35rem" }}>
                    <Link to={link.path} style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.7rem 1rem",
                      borderRadius: "10px",
                      textDecoration: "none",
                      color: isActive ? (isHotelSection ? "#78350f" : "#0284c7") : "#475569",
                      background: isActive ? (isHotelSection ? "#fef3c7" : "#f0f9ff") : "transparent",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.9rem",
                      borderLeft: isActive ? (isHotelSection ? "3px solid #d97706" : "3px solid #0284c7") : "3px solid transparent",
                      boxShadow: isActive ? (isHotelSection ? "0 1px 3px rgba(217, 119, 6, 0.12)" : "0 1px 3px rgba(2, 132, 199, 0.06)") : "none",
                      transition: "var(--transition)"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ color: isActive ? (isHotelSection ? "#d97706" : "#0284c7") : "#64748b", display: "flex" }}>
                          {link.icon}
                        </span>
                        <span>{link.name}</span>
                      </div>
                      {link.badge && (
                        <span style={{
                          background: isHotelSection ? "#d97706" : "#0284c7",
                          color: "#ffffff",
                          padding: "0.1rem 0.45rem",
                          borderRadius: "9999px",
                          fontSize: "0.72rem",
                          fontWeight: 800
                        }}>
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Separated lower section for Hotel / Dining */}
          {isHotelSection ? (
            <div style={{ marginTop: "auto", paddingTop: "1.25rem", borderTop: "1px solid #fde68a" }}>
              <Link
                to="/patient"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "#0369a1",
                  background: "#f0f9ff",
                  fontWeight: 700,
                  fontSize: "0.86rem",
                  border: "1.5px solid #bae6fd",
                  boxShadow: "0 2px 6px rgba(2, 132, 199, 0.08)",
                  transition: "all 0.2s ease"
                }}
              >
                <ArrowLeft size={16} />
                <span>Return to Health Portal</span>
              </Link>
            </div>
          ) : (
            user?.role === "PATIENT" && (
              <div style={{
                marginTop: "auto",
                paddingTop: "1.25rem",
                borderTop: "1.5px dashed #cbd5e1",
                display: "flex",
                flexDirection: "column",
                gap: "0.45rem"
              }}>
                <div style={{
                  padding: "0 0.35rem",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#b45309",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}>
                  <span>🌿</span>
                  <span>Culinary & Meal Services</span>
                </div>

                <Link
                  to="/patient/hotel/menu"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.8rem 1rem",
                    borderRadius: "14px",
                    textDecoration: "none",
                    color: "#78350f",
                    background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%)",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    border: "1.5px solid #fcd34d",
                    boxShadow: "0 3px 10px rgba(217, 119, 6, 0.12)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 14px rgba(217, 119, 6, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 3px 10px rgba(217, 119, 6, 0.12)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ fontSize: "1.15rem", lineHeight: 1 }}>🍽️</span>
                    <div>
                      <div style={{ color: "#78350f", fontWeight: 800, fontSize: "0.88rem" }}>Hotel & Dining</div>
                      <div style={{ color: "#b45309", fontSize: "0.69rem", fontWeight: 600 }}>Therapeutic Meals</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.72rem",
                    background: "#d97706",
                    color: "#ffffff",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                    fontWeight: 800,
                    boxShadow: "0 2px 4px rgba(217, 119, 6, 0.3)"
                  }}>
                    Order
                  </span>
                </Link>
              </div>
            )
          )}
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, minWidth: 0, padding: "2.5rem 2.5rem", background: "var(--bg-color)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
