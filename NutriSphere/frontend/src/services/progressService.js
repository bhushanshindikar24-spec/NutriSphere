import api from "./api";

export const recordMeasurement = (data) => 
  api.post("/nutrition/progress/measurements", data).then(r => r.data.data);

export const getMeasurements = (patientUserId) => 
  api.get(`/nutrition/progress/measurements/${patientUserId}`).then(r => r.data.data);

export const getProgress = (patientUserId) => 
  api.get(`/nutrition/progress/${patientUserId}`).then(r => r.data.data);

export default {
  recordMeasurement,
  getMeasurements,
  getProgress,
};
