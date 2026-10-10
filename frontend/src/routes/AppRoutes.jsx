import {  useContext  } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Home from "../pages/public/Home";
import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import PatientRoutes from "./PatientRoutes";
import DietitianRoutes from "./DietitianRoutes";
import DoctorRoutes from "./DoctorRoutes";
import HotelRoutes from "./HotelRoutes";
import AdminRoutes from "./AdminRoutes";

// Role-based redirect helper
const RoleBasedRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading-screen">Authenticating Session...</div>;
  if (!user) return <Home />;

  switch (user.role) {
    case "PATIENT":
      return <Navigate to="/patient" replace />;
    case "DIETITIAN":
      return <Navigate to="/dietitian" replace />;
    case "DOCTOR":
      return <Navigate to="/doctor" replace />;
    case "HOTEL":
      return <Navigate to="/hotel" replace />;
    case "ADMIN":
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root Landing Page / Role-Based Redirect */}
      <Route path="/" element={<RoleBasedRedirect />} />
      <Route path="/home" element={<Home />} />

      {/* Public Pages */}
      <Route path="/public/*" element={<PublicRoutes />} />

      {/* Auth Routes */}
      <Route path="/*" element={<AuthRoutes />} />

      {/* Unauthorized fallback */}
      <Route
        path="/unauthorized"
        element={
          <div className="page-container" style={{ padding: "3rem", textAlign: "center" }}>
            <h2>Unauthorized Access</h2>
            <p className="text-muted">You do not possess clinical credentials to access this department.</p>
          </div>
        }
      />

      {/* Protected App Layout with Role Subtrees */}
      <Route element={<MainLayout />}>
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute roles={["PATIENT"]}>
              <PatientRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dietitian/*"
          element={
            <ProtectedRoute roles={["DIETITIAN"]}>
              <DietitianRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute roles={["DOCTOR"]}>
              <DoctorRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hotel/*"
          element={
            <ProtectedRoute roles={["HOTEL"]}>
              <HotelRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
