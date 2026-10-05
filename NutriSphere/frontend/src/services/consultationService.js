import api from "./api";

export const getDoctorConsultations = () => 
  api.get("/medical/consultations").then(r => r.data?.data || r.data);

export const getPatientConsultations = (patientUserId) => 
  api.get(`/medical/consultations/patient/${patientUserId}`).then(r => r.data?.data || r.data);

export const createConsultation = (data) => 
  api.post("/medical/consultations", data).then(r => r.data?.data || r.data);

export const getConsultationById = (id) => 
  api.get(`/medical/consultations/${id}`).then(r => r.data?.data || r.data);

export default {
  getDoctorConsultations,
  getPatientConsultations,
  createConsultation,
  getConsultationById,
};
