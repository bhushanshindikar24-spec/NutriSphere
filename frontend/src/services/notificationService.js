import api from "./api";

export const getNotifications = (page = 0, size = 20) => 
  api.get("/notifications", { params: { page, size } }).then(r => {
    const data = r.data?.data;
    if (data && Array.isArray(data.content)) return data.content;
    if (Array.isArray(data)) return data;
    return [];
  });

export const getMyNotifications = (page = 0, size = 20) =>
  api.get("/notifications", { params: { page, size } }).then(r => {
    const data = r.data?.data;
    if (data && Array.isArray(data.content)) return data.content;
    if (Array.isArray(data)) return data;
    return [];
  });

export const getUnreadCount = () => 
  api.get("/notifications/unread-count").then(r => (r.data?.data !== undefined ? r.data.data : 0));

export const markRead = (id) => 
  api.patch(`/notifications/${id}/read`).then(r => r.data?.data);

export const markAsRead = (id) =>
  api.patch(`/notifications/${id}/read`);

export const markAllRead = () => 
  api.patch("/notifications/read-all").then(r => r.data?.data);

export const markAllAsRead = () =>
  api.patch("/notifications/read-all");

export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`);

export const notificationService = {
  getNotifications,
  getMyNotifications,
  getUnreadCount,
  markRead,
  markAsRead,
  markAllRead,
  markAllAsRead,
  deleteNotification,
};

export default notificationService;
