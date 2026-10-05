import api from "./api";

export const assignPatient = (data) => 
  api.post("/assignments", data).then(r => r.data.data);

export const getDoctorPatients = () => 
  api.get("/assignments/doctor/patients").then(r => r.data.data);

export const getDietitianPatients = () => 
  api.get("/assignments/dietitian/patients").then(r => r.data.data);

export const getPatientProviders = () => 
  api.get("/assignments/patient/providers").then(r => r.data.data);

export default {
  assignPatient,
  getDoctorPatients,
  getDietitianPatients,
  getPatientProviders,
};
