export async function fetchNotifications() {
  const tokensRaw = localStorage.getItem('tokens');
  if (!tokensRaw) throw new Error('Not authenticated');
  const tokens = JSON.parse(tokensRaw);
  const access = tokens?.access;
  if (!access) throw new Error('Not authenticated');

  const res = await fetch('http://localhost:8000/api/notifications/', {
    headers: { 'Authorization': `Bearer ${access}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || 'Failed to load notifications');
  }
  return res.json();
}

export async function markAllNotificationsRead() {
  const tokensRaw = localStorage.getItem('tokens');
  if (!tokensRaw) throw new Error('Not authenticated');
  const tokens = JSON.parse(tokensRaw);
  const access = tokens?.access;
  if (!access) throw new Error('Not authenticated');

  const res = await fetch('http://localhost:8000/api/notifications/mark_all_read/', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${access}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || 'Failed to mark notifications read');
  }
  return res.json();
}

