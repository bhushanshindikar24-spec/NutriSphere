
import { Routes, Route } from "react-router-dom";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import Patients from "../pages/doctor/Patients";
import AddPatient from "../pages/doctor/AddPatient";
import PatientProfile from "../pages/doctor/PatientProfile";
import PatientProgress from "../pages/doctor/PatientProgress";
import Consultations from "../pages/doctor/Consultations";
import AddConsultation from "../pages/doctor/AddConsultation";
import ConsultationDetails from "../pages/doctor/ConsultationDetails";
import HealthConditions from "../pages/doctor/HealthConditions";
import MedicalHistory from "../pages/doctor/MedicalHistory";
import MedicalReports from "../pages/doctor/MedicalReports";
import UploadMedicalReport from "../pages/doctor/UploadMedicalReport";
import LaboratoryReports from "../pages/doctor/LaboratoryReports";
import AddLaboratoryReport from "../pages/doctor/AddLaboratoryReport";
import Profile from "../pages/doctor/Profile";
import EditProfile from "../pages/doctor/EditProfile";
import Notifications from "../pages/doctor/Notifications";

export default function DoctorRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DoctorDashboard />} />
      <Route path="/dashboard" element={<DoctorDashboard />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/add-patient" element={<AddPatient />} />
      <Route path="/patients/:id" element={<PatientProfile />} />
      <Route path="/patients/:id/progress" element={<PatientProgress />} />
      <Route path="/consultations" element={<Consultations />} />
      <Route path="/add-consultation" element={<AddConsultation />} />
      <Route path="/consultations/:id" element={<ConsultationDetails />} />
      <Route path="/conditions" element={<HealthConditions />} />
      <Route path="/medical-history" element={<MedicalHistory />} />
      <Route path="/medical-reports" element={<MedicalReports />} />
      <Route path="/upload-report" element={<UploadMedicalReport />} />
      <Route path="/laboratory-reports" element={<LaboratoryReports />} />
      <Route path="/add-laboratory" element={<AddLaboratoryReport />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}
