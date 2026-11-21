import api from "./api";

export const getDoctorPatients = () =>
  api.get("/assignments/doctor/patients").then((r) => r.data.data);

export const getDietitianPatients = () =>
  api.get("/assignments/dietitian/patients").then((r) => r.data.data);

export const getPatientDoctors = () =>
  api.get("/assignments/patient/doctors").then((r) => r.data.data);

export const getPatientDietitians = () =>
  api.get("/assignments/patient/dietitians").then((r) => r.data.data);

export default {
  getDoctorPatients,
  getDietitianPatients,
  getPatientDoctors,
  getPatientDietitians,
};
