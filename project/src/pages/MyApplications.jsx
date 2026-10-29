import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import earningsService from '../services/earningsService';
import {
  Briefcase, Clock, Calendar, MapPin, CheckCircle2, DollarSign,
  AlertCircle, Inbox, Loader2, RefreshCw, ChevronRight
} from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   className: 'badge-warning' },
  accepted:  { label: 'Accepted',  className: 'badge-success' },
  rejected:  { label: 'Rejected',  className: 'badge-destructive' },
  completed: { label: 'Completed', className: 'badge-info' },
};

const MyApplications = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'labour') {
      navigate('/dashboard');
      return;
    }
    loadApplications();
  }, [user, navigate]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await jobService.getMyApplications();
      setApplications(res.data || []);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('N/A');
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleMarkCompleted = async (applicationId) => {
    setProcessing(applicationId);
    try {
      await jobService.updateApplication(applicationId, { status: 'completed' });
      const res = await jobService.getMyApplications();
      setApplications(res.data || []);
    } catch (e) {
      alert(t('Failed to mark as completed: ') + (e?.response?.data?.error || e?.message || 'Unknown error'));
    } finally {
      setProcessing(null);
    }
  };

  const handleCreateEarning = async (applicationId) => {
    setProcessing(applicationId);
    try {
      await earningsService.createEarningFromJob(applicationId);
      alert(t('Earning record created successfully!'));
      const res = await jobService.getMyApplications();
      setApplications(res.data || []);
    } catch (e) {
      alert(t('Failed to create earning: ') + (e?.response?.data?.error || e?.message || 'Unknown error'));
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 skeleton-shimmer" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-6 space-y-3">
              <div className="skeleton h-5 w-64 skeleton-shimmer" />
              <div className="flex gap-4">
                <div className="skeleton h-4 w-32 skeleton-shimmer" />
                <div className="skeleton h-4 w-28 skeleton-shimmer" />
                <div className="skeleton h-4 w-20 skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-primary" />
            {t('My Applications')}
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {t('Track your job applications and their status')}
          </p>
        </div>
        <button
          onClick={loadApplications}
          className="btn-ghost h-9 px-3 text-xs gap-1.5 text-muted-foreground"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t('Refresh')}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl
                        bg-destructive-light border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
          <button onClick={loadApplications} className="ml-auto underline text-xs">{t('Retry')}</button>
        </div>
      )}

      {/* Summary chips */}
      {applications.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
            const count = applications.filter(a => (a.status || 'pending') === status).length;
            if (count === 0) return null;
            return (
              <div key={status} className={`badge ${cfg.className} px-3 py-1`}>
                {cfg.label}: {count}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {applications.length === 0 && !error && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{t('No applications yet')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('You have not applied to any jobs yet.')}
            </p>
            <button
              onClick={() => navigate('/jobs')}
              className="btn-primary h-10 px-6 gap-2"
            >
              <Briefcase className="w-4 h-4" />
              {t('Browse Jobs')}
            </button>
          </div>
        </div>
      )}

      {/* Application cards */}
      {applications.length > 0 && (
        <div className="space-y-3">
          {applications.map((app, i) => {
            const status = app.status || 'pending';
            const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

            return (
              <div
                key={app.id}
                className="card p-5 animate-fade-in-up hover:shadow-md transition-all duration-200"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="text-base font-semibold text-foreground">
                        {app.job?.title || t('Job')}
                      </h3>
                      <span className={`badge ${statusCfg.className} capitalize`}>{statusCfg.label}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        {app.job?.start_date
                          ? `${formatDate(app.job.start_date)} → ${formatDate(app.job.end_date)}`
                          : t('Dates N/A')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{app.job?.address || t('Address N/A')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        {app.job?.duration_days || '—'} {t('days')}
                      </div>
                    </div>
                  </div>

                  {/* Right: wage */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-primary">
                      ₹{app.job?.wage_per_day || '—'}
                    </div>
                    <div className="text-xs text-muted-foreground">{t('per day')}</div>
                  </div>
                </div>

                {/* Actions — accepted */}
                {status === 'accepted' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <button
                      onClick={() => handleMarkCompleted(app.id)}
                      disabled={processing === app.id}
                      className="btn-primary h-9 px-5 text-sm gap-2 disabled:opacity-60"
                    >
                      {processing === app.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <CheckCircle2 className="w-4 h-4" />
                      }
                      {processing === app.id ? t('Processing...') : t('Mark as Completed')}
                    </button>
                  </div>
                )}

                {/* Actions — completed without earning */}
                {status === 'completed' && !app.has_earning && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-warning-light border border-warning/20 text-warning text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {t('No earning record found. Create one to track your payment.')}
                    </div>
                    <button
                      onClick={() => handleCreateEarning(app.id)}
                      disabled={processing === app.id}
                      className="btn-primary h-9 px-5 text-sm gap-2 disabled:opacity-60"
                    >
                      {processing === app.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <DollarSign className="w-4 h-4" />
                      }
                      {processing === app.id ? t('Creating...') : t('Create Earning Record')}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
