import { formatDate, formatTime, formatDateTime, getTodayDate, getDaysAgo } from "./dateUtils";

export { formatDate, formatTime, formatDateTime, getTodayDate, getDaysAgo };

export const formatISODate = (date) => {
  if (!date) return "";
  try {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  } catch (_e) {
    return String(date);
  }
};

export const formatCalories = (cal) => {
  if (cal == null || isNaN(cal)) return "0 kcal";
  return `${Math.round(cal)} kcal`;
};

export const formatGrams = (g) => {
  if (g == null || isNaN(g)) return "0g";
  return `${Math.round(g * 10) / 10}g`;
};

export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase().replace(/_/g, " ");
};

export const formatPercent = (val) => {
  if (val == null || isNaN(val)) return "0%";
  return `${Math.round(val)}%`;
};
