import api from "./api";

export const queryAI = (data) => 
  api.post("/ai/query", data).then(r => r.data.data);

export const getAIRecommendations = (data) => 
  api.post("/ai/recommendations", data).then(r => r.data.data);

export const getAISummary = (patientUserId) => 
  api.get(`/ai/summary/${patientUserId}`).then(r => r.data.data);

export default {
  queryAI,
  getAIRecommendations,
  getAISummary,
};
