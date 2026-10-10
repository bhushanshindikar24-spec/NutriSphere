import api from "./api";

export const getForPatient = (patientUserId) => 
  api.get(`/medical/laboratory/patient/${patientUserId}`).then(r => r.data.data);

export const getById = (id) => 
  api.get(`/medical/laboratory/${id}`).then(r => r.data.data);

export const getValues = (id) => 
  api.get(`/medical/laboratory/${id}/values`).then(r => r.data.data);

export const createReport = (data) => 
  api.post("/medical/laboratory", data).then(r => r.data.data);

export const addValue = (id, data) => 
  api.post(`/medical/laboratory/${id}/values`, data).then(r => r.data.data);

export const deleteReport = (id) => 
  api.delete(`/medical/laboratory/${id}`).then(r => r.data.data);

export default {
  getForPatient,
  getById,
  getValues,
  createReport,
  addValue,
  deleteReport,
};
