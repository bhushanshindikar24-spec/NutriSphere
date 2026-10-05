import api from "./api";

export const getAdaptiveRecommendations = (patientUserId) => 
  api.get("/adaptive/recommendations", { params: { patientUserId } });

export const getPendingRecommendations = (patientUserId) =>
  api.get("/adaptive/recommendations/pending", { params: { patientUserId } });

export const generateAdaptivePlan = (data) => 
  api.post("/adaptive/generate", data);

export const evaluatePatient = (patientUserId) =>
  api.post(`/adaptive/evaluate?patientId=${patientUserId}`);

export const reviewRecommendation = (id, data) => 
  api.post(`/adaptive/recommendations/${id}/review`, data);

export const approveRecommendation = (id) =>
  api.put(`/adaptive/recommendations/${id}/approve`);

export const rejectRecommendation = (id) =>
  api.put(`/adaptive/recommendations/${id}/reject`);

export const adaptiveService = {
  getAdaptiveRecommendations,
  getPendingRecommendations,
  generateAdaptivePlan,
  evaluatePatient,
  reviewRecommendation,
  approveRecommendation,
  rejectRecommendation,
};

export default adaptiveService;
