import api from "./api";

export const getAdherenceSummary = (patientUserId) => 
  api.get("/adherence/summary", { params: { patientUserId } }).then(r => r.data.data);

export const getBarriers = (patientUserId) => 
  api.get("/adherence/barriers", { params: { patientUserId } }).then(r => r.data.data);

export const logBarrier = (data) => 
  api.post("/adherence/barriers", data).then(r => r.data.data);

export const getBarrierAnalysis = (patientUserId) => 
  api.get("/adherence/analysis", { params: { patientUserId } }).then(r => r.data.data);

export default {
  getAdherenceSummary,
  getBarriers,
  logBarrier,
  getBarrierAnalysis,
};
