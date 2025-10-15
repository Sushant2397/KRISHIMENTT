import React, { useEffect, useState } from 'react';
import Header from '../components/Common/Header';
import { fetchNotifications, markAllNotificationsRead } from '../services/notificationService.ts';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotifications();
      setItems(data);
    } catch (e) {
      setError(e?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      load();
    } catch (e) {
      setError(e?.message || 'Failed to mark as read');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <button onClick={handleMarkAll} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Mark all read</button>
        </div>
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="space-y-4">
          {items.map((n) => (
            <div key={n.id} className={`bg-white rounded-lg shadow p-4 border ${n.is_read ? 'border-gray-200' : 'border-green-300'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-gray-600">{new Date(n.created_at).toLocaleString()}</p>
                </div>
                {!n.is_read && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">New</span>}
              </div>
              <p className="mt-2">{n.message}</p>
              <div className="mt-3 text-sm text-gray-700">
                {n.buyer_name && <div><strong>Buyer:</strong> {n.buyer_name}</div>}
                {n.buyer_email && <div><strong>Email:</strong> <a className="text-blue-600 hover:underline" href={`mailto:${n.buyer_email}`}>{n.buyer_email}</a></div>}
                {n.buyer_phone && <div><strong>Phone:</strong> <a className="text-blue-600 hover:underline" href={`tel:${n.buyer_phone}`}>{n.buyer_phone}</a></div>}
                {n.equipment_title && <div><strong>Equipment:</strong> {n.equipment_title}</div>}
              </div>
            </div>
          ))}
          {(!loading && items.length === 0) && (
            <p className="text-gray-600">No notifications yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;

