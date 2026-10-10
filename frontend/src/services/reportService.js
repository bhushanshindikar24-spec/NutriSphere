import api from "./api";

export const getMedicalReports = (patientUserId) => 
  api.get(`/medical/reports/patient/${patientUserId}`).then(r => r.data.data);

export const getReportById = (id) => 
  api.get(`/medical/reports/${id}`).then(r => r.data.data);

export const createReport = (data) => 
  api.post("/medical/reports", data).then(r => r.data.data);

export const uploadFile = (file, category = "medical", entityType = null, entityId = null) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);
  if (entityType) formData.append("entityType", entityType);
  if (entityId) formData.append("entityId", entityId);

  return api.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(r => r.data.data);
};

export default {
  getMedicalReports,
  getReportById,
  createReport,
  uploadFile,
};
