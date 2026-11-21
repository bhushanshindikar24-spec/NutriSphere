// Normalizes backend LaboratoryReportResponse objects into the shape the lab UI components use.
export function normalizeLabReport(r) {
  if (!r) return r;
  return {
    ...r,
    testName: r.testName ?? r.title,
    testDate: r.testDate ?? r.reportDate,
    labValues: (r.labValues ?? r.values ?? []).map((v) => {
      const flag = v.flag ? String(v.flag).toUpperCase() : undefined;
      return {
        ...v,
        markerName: v.markerName ?? v.parameterName,
        referenceRange: v.referenceRange ?? v.normalRange,
        flag,
        isAbnormal: v.isAbnormal ?? (flag === "HIGH" || flag === "LOW" || flag === "ABNORMAL" || flag === "CRITICAL"),
      };
    }),
  };
}

export const normalizeLabReports = (list) => (Array.isArray(list) ? list.map(normalizeLabReport) : []);
