import api from "./api";

export const getMyDigitalTwin = () => 
  api.get("/digital-twin");

export const getDigitalTwinForPatient = (patientUserId) => 
  api.get(`/digital-twin/patient/${patientUserId}`);

export const recalculateProjection = () =>
  api.post("/digital-twin/recalculate");

export const digitalTwinService = {
  getMyDigitalTwin,
  getDigitalTwinForPatient,
  recalculateProjection,
};

export default digitalTwinService;
