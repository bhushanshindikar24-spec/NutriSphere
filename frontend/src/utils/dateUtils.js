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
    return d.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (_e) {
    return dateStr;
  }
};

export const formatTime = (timeStr) => {
  if (!timeStr) return "-";
  try {
    if (timeStr.includes("T")) {
      const d = new Date(timeStr);
      return d.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) + " IST";
    }
    // If format is like "08:30" or "08:30 AM"
    return timeStr.includes("IST") ? timeStr : `${timeStr} IST`;
  } catch (_e) {
    return timeStr;
  }
};

export const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return "-";
  return `${formatDate(dateTimeStr)}, ${formatTime(dateTimeStr)}`;
};

export const getDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
};
