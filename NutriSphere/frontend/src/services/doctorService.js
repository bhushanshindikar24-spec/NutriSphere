import api from "./api";

export const getDoctorProfile = () => 
  api.get("/doctors/profile").then(r => r.data.data);

export const updateDoctorProfile = (data) => 
  api.put("/doctors/profile", data).then(r => r.data.data);

export const getDoctorPatients = () => 
  api.get("/assignments/doctor/patients").then(r => r.data.data);

export const getDoctorConsultations = () => 
  api.get("/medical/consultations/doctor").then(r => r.data.data);

export default {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorPatients,
  getDoctorConsultations,
};
