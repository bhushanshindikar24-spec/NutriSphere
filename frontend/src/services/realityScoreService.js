import api from "./api";

export const calculateRealityScore = (patientUserId, dietPlanId) => 
  api.post("/reality-score/calculate", null, { params: { patientUserId, dietPlanId } }).then(r => r.data.data);

export const getRealityScoreHistory = (patientUserId) => 
  api.get("/reality-score/history", { params: { patientUserId } }).then(r => r.data.data);

export default {
  calculateRealityScore,
  getRealityScoreHistory,
};
