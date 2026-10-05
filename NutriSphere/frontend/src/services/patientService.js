import api from "./api";

export const getPatientProfile = () => 
  api.get("/patients/profile").then(r => r.data.data);

export const updatePatientProfile = (data) => 
  api.put("/patients/profile", data).then(r => r.data.data);

export const getPatientDashboard = () => 
  api.get("/patients/dashboard").then(r => r.data.data);

export const getPatientById = (patientId) => 
  api.get(`/patients/${patientId}`).then(r => r.data.data);

export default {
  getPatientProfile,
  updatePatientProfile,
  getPatientDashboard,
  getPatientById,
};
