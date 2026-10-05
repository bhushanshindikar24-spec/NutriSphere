export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const formatISODate = (date) => {
  if (!date) return "";
  try {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  } catch (_e) {
    return String(date);
  }
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch (_e) {
    return dateStr;
  }
};

export const formatTime = (timeStr) => {
  if (!timeStr) return "-";
  try {
    if (timeStr.includes("T")) {
      const d = new Date(timeStr);
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
    return timeStr.slice(0, 5);
  } catch (_e) {
    return timeStr;
  }
};

export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "-";
  return `${formatDate(dateTimeStr)} at ${formatTime(dateTimeStr)}`;
};

export const getDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
};
