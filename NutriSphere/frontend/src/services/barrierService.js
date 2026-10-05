import api from "./api";

export const reportBarrier = (data) => 
  api.post("/adherence/barriers", data);

export const getPatientBarriers = (patientUserId) => 
  api.get("/adherence/barriers", { params: { patientUserId } });

export const getMyBarriers = () =>
  api.get("/adherence/barriers/my");

export const resolveBarrier = (id) =>
  api.put(`/adherence/barriers/${id}/resolve`);

export const barrierService = {
  reportBarrier,
  getPatientBarriers,
  getMyBarriers,
  resolveBarrier,
};

export default barrierService;
