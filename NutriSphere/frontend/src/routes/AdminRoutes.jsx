import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminVerifications from "../pages/admin/AdminVerifications";
import AdminUsers from "../pages/admin/AdminUsers";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/verifications" element={<AdminVerifications />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
