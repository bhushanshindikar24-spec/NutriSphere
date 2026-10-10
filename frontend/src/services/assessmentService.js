import api from "./api";

export const getPatientAssessments = (patientUserId) => 
  api.get(`/nutrition/assessments/patient/${patientUserId}`).then(r => r.data?.data || r.data);

export const createAssessment = (data) => 
  api.post("/nutrition/assessments", data).then(r => r.data?.data || r.data);

export const getAssessmentById = (id) => 
  api.get(`/nutrition/assessments/${id}`).then(r => r.data?.data || r.data);

export default {
  getPatientAssessments,
  createAssessment,
  getAssessmentById,
};
