
import Badge from "../common/Badge";

export default function OrderStatusBadge({ status }) {
  const getVariant = () => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "PENDING":
      case "PREPARING":
      case "OUT_FOR_DELIVERY":
        return "warning";
      case "CANCELLED":
        return "danger";
      default:
        return "neutral";
    }
  };

  return <Badge variant={getVariant()}>{status?.replace(/_/g, " ") || "UNKNOWN"}</Badge>;
}
