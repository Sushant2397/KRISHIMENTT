import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/Common/DashboardCard';
import { FARMER_CARDS } from '../utils/constants';
import { getMyInquiries } from '../services/inquiryService.ts';
import jobService from '../services/jobService';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  PlusCircle, Users, Briefcase, CheckCircle, Clock, TrendingUp,
  ArrowRight, Mail, Phone, AlertCircle, RefreshCw, Inbox
} from 'lucide-react';

// ── Skeleton loader for stat cards ──────────────────────
const StatSkeleton = () => (
  <div className="stat-card">
    <div className="skeleton h-4 w-20 mb-2 skeleton-shimmer" />
    <div className="skeleton h-8 w-14 skeleton-shimmer" />
  </div>
);

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [inquiryError, setInquiryError] = useState(null);

  const handleCardClick = (cardId) => {
    switch (cardId) {
      case 'government-schemes':    navigate('/schemes');            break;
      case 'equipment-buy':         navigate('/equipment/buy');       break;
      case 'equipment-sell':        navigate('/equipment/sell');      break;
      case 'worker-applications':   navigate('/worker-applications'); break;
      case 'upload-jobs':           navigate('/upload-jobs');         break;
      case 'real-time-prices':      navigate('/market-prices');       break;
      case 'notifications':         navigate('/notifications');       break;
      case 'history':               navigate('/history');             break;
      default: break;
    }
  };

  const loadInquiries = async () => {
    setLoadingInquiries(true);
    setInquiryError(null);
    try {
      const data = await getMyInquiries();
      setInquiries(data);
    } catch (error) {
      console.error('Failed to load inquiries', error);
      setInquiryError(t('Failed to load inquiries. Please try again.'));
    } finally {
      setLoadingInquiries(false);
    }
  };

  const loadJobs = async () => {
    setLoadingJobs(true);
    setJobsError('');
    try {
      const response = await jobService.getMyJobs();
      setJobs(response.data || []);
    } catch (error) {
      setJobsError(t('Could not load your posted jobs. Please try again.'));
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadInquiries();
      loadJobs();
    }
  }, [user]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('Good morning');
    if (hour < 18) return t('Good afternoon');
    return t('Good evening');
  };

  return (
    <div className="space-y-6">

      {/* ── Welcome header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-0.5">{greeting()}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {user?.name || t('Farmer')} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('Manage your farm operations and connect with the agricultural community.')}
          </p>
        </div>
        <button
          onClick={() => navigate('/upload-jobs')}
          className="btn-primary h-10 px-5 gap-2 flex-shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          {t('Post a Job')}
        </button>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t('Active Jobs'),        value: jobs.filter(job => job.status === 'open').length, icon: Briefcase, color: 'text-primary', bg: 'bg-primary-light' },
          { label: t('Applications'),       value: jobs.reduce((total, job) => total + Number(job.applications_count || 0), 0), icon: Users, color: 'text-info', bg: 'bg-info-light' },
          { label: t('Workers Hired'),      value: jobs.reduce((total, job) => total + Number(job.accepted_applications_count || 0), 0), icon: CheckCircle, color: 'text-success', bg: 'bg-success-light' },
          { label: t('Equipment Listed'),   value: '—', icon: TrendingUp,   color: 'text-warning',     bg: 'bg-warning-light'   },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className={`w-9 h-9 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* ── Dashboard Feature Cards ── */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">{t('Quick Actions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FARMER_CARDS.map((card) => (
            <DashboardCard
              key={card.id}
              card={{
                ...card,
                title: t(card.titleKey),
                description: t(card.descriptionKey),
              }}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-base font-semibold text-foreground">{t('My Posted Jobs')}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{t('Review and update opportunities you have posted.')}</p>
          </div>
          <button onClick={loadJobs} disabled={loadingJobs} className="btn-ghost h-8 px-3 text-xs">
            {loadingJobs ? t('Loading...') : t('Refresh')}
          </button>
        </div>
        {jobsError ? (
          <div className="p-5 text-sm text-destructive" role="alert">{jobsError}</div>
        ) : loadingJobs && jobs.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">{t('Loading jobs...')}</div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">{t('No jobs posted yet.')}</div>
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((job) => (
              <div key={job.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-foreground">{job.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {job.category} · ₹{job.wage_per_day}/{t('day')} · {job.start_date} – {job.end_date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-teal">{t(job.status || 'open')}</span>
                  <button
                    onClick={() => navigate(`/upload-jobs?edit=${job.id}`)}
                    className="btn-outline h-9 px-3 text-xs"
                  >{t('Edit job')}</button>
                  <button
                    onClick={() => navigate(`/worker-applications?job=${job.id}`)}
                    className="btn-ghost h-9 px-3 text-xs"
                  >{t('Applications')}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Buyer Inquiries ── */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">{t('Buyer Inquiries')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t('Equipment interest from potential buyers')}</p>
          </div>
          <button
            onClick={loadInquiries}
            disabled={loadingInquiries}
            className="btn-ghost h-8 px-3 text-xs gap-1.5 text-muted-foreground"
            title={t('Refresh')}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingInquiries ? 'animate-spin' : ''}`} />
            {loadingInquiries ? t('Loading...') : t('Refresh')}
          </button>
        </div>

        {/* Error state */}
        {inquiryError && (
          <div className="p-4 m-4 rounded-xl bg-destructive-light border border-destructive/20
                          flex items-center gap-2.5 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {inquiryError}
            <button onClick={loadInquiries} className="ml-auto underline text-xs">{t('Retry')}</button>
          </div>
        )}

        {/* Empty state */}
        {!loadingInquiries && !inquiryError && inquiries.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{t('No inquiries yet')}</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t("When buyers express interest in your equipment, their inquiries will appear here.")}
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {loadingInquiries && (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="skeleton h-4 w-24 skeleton-shimmer" />
                <div className="skeleton h-4 w-32 skeleton-shimmer" />
                <div className="skeleton h-4 w-28 skeleton-shimmer" />
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        {!loadingInquiries && !inquiryError && inquiries.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40">
                  <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('Date')}</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('Equipment')}</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('Buyer')}</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">{t('Contact')}</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">{t('Message')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-muted/30 transition-colors duration-150">
                    <td className="py-3.5 px-5 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 font-medium text-foreground">
                      {inq.equipment_title || inq.equipment}
                    </td>
                    <td className="py-3.5 px-5 text-foreground">{inq.buyer_name}</td>
                    <td className="py-3.5 px-5 hidden sm:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <a
                          href={`mailto:${inq.buyer_email}`}
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                        >
                          <Mail className="w-3 h-3" />
                          {inq.buyer_email}
                        </a>
                        {inq.buyer_phone && (
                          <a
                            href={`tel:${inq.buyer_phone}`}
                            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            {inq.buyer_phone}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-muted-foreground hidden lg:table-cell max-w-xs">
                      <span className="line-clamp-2 text-xs" title={inq.message}>{inq.message}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
