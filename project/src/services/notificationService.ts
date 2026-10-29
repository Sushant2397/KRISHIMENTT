import API from './api';

export async function fetchNotifications() {
  const response = await API.get('/notifications/');
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await API.post('/notifications/mark_all_read/');
  return response.data;
}

