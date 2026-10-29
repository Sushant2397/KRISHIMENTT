import React, { useEffect, useState } from 'react';
import { fetchNotifications, markAllNotificationsRead } from '../services/notificationService.ts';
import { useTranslation } from 'react-i18next';
import {
  Bell, CheckCheck, AlertCircle, Inbox, RefreshCw, Loader2,
  Mail, Phone, Package, User, Calendar
} from 'lucide-react';

const Notifications = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotifications();
      setItems(data);
    } catch (e) {
      setError(e?.message || t('notifications.load_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      load();
    } catch (e) {
      setError(e?.message || t('notifications.mark_error'));
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = items.filter(n => !n.is_read).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-primary" />
            {t('notifications.title') || 'Notifications'}
            {unreadCount > 0 && (
              <span className="badge-teal text-xs px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {t('Stay updated with your farm activity')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="btn-ghost h-9 px-3 text-xs gap-1.5 text-muted-foreground"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {t('Refresh')}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={markingAll}
              className="btn-outline h-9 px-4 text-xs gap-1.5"
            >
              {markingAll
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <CheckCheck className="w-3.5 h-3.5" />
              }
              {t('notifications.mark_all') || 'Mark all read'}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl
                        bg-destructive-light border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
          <button onClick={load} className="ml-auto underline text-xs">{t('Retry')}</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-4">
              <div className="flex gap-3">
                <div className="skeleton w-10 h-10 rounded-xl skeleton-shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-48 skeleton-shimmer" />
                  <div className="skeleton h-3 w-full skeleton-shimmer" />
                  <div className="skeleton h-3 w-2/3 skeleton-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              {t('No notifications')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('notifications.empty') || "You're all caught up! Notifications will appear here."}
            </p>
          </div>
        </div>
      )}

      {/* Notification list */}
      {!loading && items.length > 0 && (
        <div className="space-y-2">
          {items.map((n, i) => (
            <div
              key={n.id}
              className={`card p-4 transition-all duration-200 hover:shadow-md
                         ${!n.is_read ? 'border-primary/30 bg-primary-light/20' : ''}`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                 ${n.is_read ? 'bg-muted' : 'bg-primary-light'}`}>
                  <Bell className={`w-4.5 h-4.5 ${n.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{n.title}</h3>
                      {!n.is_read && (
                        <span className="badge-teal text-[10px] px-2 py-0.5">
                          {t('notifications.new') || 'New'}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                      {formatDate(n.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{n.message}</p>

                  {/* Metadata */}
                  {(n.buyer_name || n.buyer_email || n.buyer_phone || n.equipment_title) && (
                    <div className="mt-2.5 pt-2.5 border-t border-border flex flex-wrap gap-3 text-xs">
                      {n.buyer_name && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <User className="w-3 h-3" />
                          {t('notifications.buyer') || 'Buyer'}: <span className="text-foreground font-medium">{n.buyer_name}</span>
                        </span>
                      )}
                      {n.buyer_email && (
                        <a
                          href={`mailto:${n.buyer_email}`}
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Mail className="w-3 h-3" />
                          {n.buyer_email}
                        </a>
                      )}
                      {n.buyer_phone && (
                        <a
                          href={`tel:${n.buyer_phone}`}
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          {n.buyer_phone}
                        </a>
                      )}
                      {n.equipment_title && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Package className="w-3 h-3" />
                          {t('notifications.equipment') || 'Equipment'}: <span className="text-foreground font-medium">{n.equipment_title}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
