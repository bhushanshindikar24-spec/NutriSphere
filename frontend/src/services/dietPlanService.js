import api from "./api";

export const getPatientDietPlans = (patientUserId) => 
  api.get(`/nutrition/diet-plans/patient/${patientUserId}`).then(r => r.data.data);

export const getApprovedDietPlan = (patientUserId) => 
  api.get(`/nutrition/diet-plans/patient/${patientUserId}/approved`).then(r => r.data.data);

export const getMyDietPlans = () => 
  api.get("/nutrition/diet-plans/my").then(r => r.data.data);

export const getDietitianPlans = () => 
  api.get("/nutrition/diet-plans/dietitian").then(r => r.data.data);

export const getDietPlanById = (id) => 
  api.get(`/nutrition/diet-plans/${id}`).then(r => r.data.data);

export const createDietPlan = (data) => 
  api.post("/nutrition/diet-plans", data).then(r => r.data.data);

export const approveDietPlan = (id, data) => 
  api.post(`/nutrition/diet-plans/${id}/approve`, data || {}).then(r => r.data.data);

export const addMealToPlan = (id, data) => 
  api.post(`/nutrition/diet-plans/${id}/meals`, data).then(r => r.data.data);

export default {
  getPatientDietPlans,
  getApprovedDietPlan,
  getMyDietPlans,
  getDietitianPlans,
  getDietPlanById,
  createDietPlan,
  approveDietPlan,
  addMealToPlan,
};
