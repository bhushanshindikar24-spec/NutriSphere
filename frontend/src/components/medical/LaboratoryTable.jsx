
import DataTable from "../common/DataTable";
import Badge from "../common/Badge";

export default function LaboratoryTable({ values = [] }) {
  const columns = [
    { header: "Test / Parameter", accessor: "parameterName" },
    {
      header: "Result Value",
      render: (row) => (
        <span style={{ fontWeight: 600 }}>
          {row.value} {row.unit}
        </span>
      ),
    },
    { header: "Normal Reference Range", accessor: "normalRange" },
    {
      header: "Status",
      render: (row) => {
        const flag = row.flag?.toUpperCase() || (row.abnormal ? "ABNORMAL" : "NORMAL");
        const variant = flag === "HIGH" || flag === "ABNORMAL" ? "danger" : flag === "LOW" ? "warning" : "success";
        return <Badge variant={variant}>{flag}</Badge>;
      },
    },
  ];

  return <DataTable columns={columns} data={values} keyField="id" emptyMessage="No laboratory test results recorded." />;
}
