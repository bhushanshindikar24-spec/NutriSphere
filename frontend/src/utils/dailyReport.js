// Maps the backend DailyNutritionReportResponse (/food-logs/daily-report) into the
// planned/actual shape used by the nutrition progress components.
export function toPlannedVsActual(report) {
  if (!report) return null;
  return {
    date: report.reportDate,
    report,
    planned: {
      calories: report.plannedCalories || 0,
      proteinG: report.plannedProteinG || 0,
      carbsG: report.plannedCarbsG || 0,
      fatG: report.plannedFatG || 0,
      waterMl: report.plannedWaterMl || 0,
    },
    actual: {
      calories: report.actualCalories || 0,
      proteinG: report.actualProteinG || 0,
      carbsG: report.actualCarbsG || 0,
      fatG: report.actualFatG || 0,
      waterMl: report.actualWaterMl || 0,
    },
  };
}
