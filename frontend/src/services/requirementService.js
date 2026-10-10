import api from "./api";

export const calculateRequirements = (data) => 
  api.post("/nutrition/requirements/calculate", data).then(r => r.data.data);

export const saveRequirements = (data) => 
  api.post("/nutrition/requirements", data).then(r => r.data.data);

export const getForPatient = (patientUserId) => 
  api.get(`/nutrition/requirements/patient/${patientUserId}`).then(r => r.data.data);

export default {
  calculateRequirements,
  saveRequirements,
  getForPatient,
};
