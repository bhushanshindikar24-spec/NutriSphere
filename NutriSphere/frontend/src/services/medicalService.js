import api from "./api";

// Conditions
export const getAllConditions = () => 
  api.get("/medical/conditions").then(r => r.data.data);

export const getPatientConditions = (patientUserId) => 
  api.get(`/medical/conditions/patient/${patientUserId}`).then(r => r.data.data);

export const addPatientCondition = (data) => 
  api.post("/medical/conditions/patient", data).then(r => r.data.data);

export const removePatientCondition = (id) => 
  api.delete(`/medical/conditions/patient/${id}`).then(r => r.data.data);

export const createCondition = (data) => 
  api.post("/medical/conditions", data).then(r => r.data.data);

// Medical History
export const getMedicalHistory = (patientUserId) => 
  api.get(`/medical/history/patient/${patientUserId}`).then(r => r.data.data);

export const createMedicalHistory = (data) => 
  api.post("/medical/history", data).then(r => r.data.data);

// Reports
export const getMedicalReports = (patientUserId) => 
  api.get(`/medical/reports/patient/${patientUserId}`).then(r => r.data.data);

export default {
  getAllConditions,
  getPatientConditions,
  addPatientCondition,
  removePatientCondition,
  createCondition,
  getMedicalHistory,
  createMedicalHistory,
  getMedicalReports,
};
