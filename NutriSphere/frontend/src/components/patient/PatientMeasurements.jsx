
import DataTable from "../common/DataTable";
import { formatDate } from "../../utils/dateUtils";

export default function PatientMeasurements({ measurements = [] }) {
  const columns = [
    { header: "Date", render: (r) => formatDate(r.measurementDate || r.createdAt) },
    { header: "Weight", render: (r) => (r.weightKg ? `${r.weightKg} kg` : "--") },
    { header: "Height", render: (r) => (r.heightCm ? `${r.heightCm} cm` : "--") },
    { header: "BMI", render: (r) => (r.bmi ? Math.round(r.bmi * 10) / 10 : "--") },
    { header: "Waist (cm)", accessor: "waistCircumferenceCm" },
    { header: "Notes", accessor: "notes" },
  ];

  return <DataTable columns={columns} data={measurements} keyField="id" emptyMessage="No physical measurements recorded yet." />;
}
