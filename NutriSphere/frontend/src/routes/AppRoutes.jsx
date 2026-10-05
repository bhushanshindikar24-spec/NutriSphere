import {  useContext  } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import PublicRoutes from "./PublicRoutes";
import AuthRoutes from "./AuthRoutes";
import PatientRoutes from "./PatientRoutes";
import DietitianRoutes from "./DietitianRoutes";
import DoctorRoutes from "./DoctorRoutes";
import HotelRoutes from "./HotelRoutes";

// Role-based redirect helper
const RoleBasedRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="loading-screen">Authenticating Session...</div>;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "PATIENT":
      return <Navigate to="/patient" replace />;
    case "DIETITIAN":
      return <Navigate to="/dietitian" replace />;
    case "DOCTOR":
      return <Navigate to="/doctor" replace />;
    case "HOTEL":
      return <Navigate to="/hotel" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Auth Routes */}
      <Route path="/*" element={<AuthRoutes />} />

      {/* Public Pages */}
      <Route path="/public/*" element={<PublicRoutes />} />

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
      </Route>
    </Routes>
  );
}
