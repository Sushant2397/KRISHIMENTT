import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/Common/DashboardCard';
import { LABOUR_CARDS } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import userService from '../services/userService';
import ratingService from '../services/ratingService';
import jobService from '../services/jobService';
import {
  Star, Briefcase, CheckCircle, TrendingUp, ToggleLeft, ToggleRight,
  AlertCircle, Loader2, Search
} from 'lucide-react';

const LabourDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const [totalRatings, setTotalRatings] = useState(0);
  const [applicationsSent, setApplicationsSent] = useState(0);
  const [jobsCompleted, setJobsCompleted] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await userService.getAvailability();
        setIsAvailable(!!res.data.is_available);
      } catch (e) {
        setIsAvailable(null);
      }

      try {
        const ratingRes = await ratingService.getMyAverageRating();
        setAverageRating(ratingRes.data.average_rating);
        setTotalRatings(ratingRes.data.total_ratings);
      } catch (e) {
        setAverageRating(null);
      }

      try {
        const applicationsRes = await jobService.getMyApplications();
        const applications = applicationsRes.data || [];
        setApplicationsSent(applications.length);
        setJobsCompleted(applications.filter(a => a.status === 'completed').length);
      } catch (e) {
        setApplicationsSent(0);
        setJobsCompleted(0);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleCardClick = (cardId) => {
    switch (cardId) {
      case 'find-jobs':           navigate('/jobs');            break;
      case 'government-schemes':  navigate('/schemes');         break;
      case 'my-applications':     navigate('/my-applications'); break;
      case 'skills':              navigate('/skills');           break;
      case 'earnings':            navigate('/earnings');         break;
      case 'notifications':       navigate('/notifications');   break;
      default: break;
    }
  };

  const handleToggleAvailability = async () => {
    if (isAvailable === null || availabilityLoading) return;
    const next = !isAvailable;
    setAvailabilityLoading(true);
    setAvailabilityError('');
    setIsAvailable(next); // optimistic
    try {
      await userService.setAvailability(next);
    } catch (e) {
      setIsAvailable(!next); // revert
      setAvailabilityError(t('Failed to update availability. Please try again.'));
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('Good morning');
    if (hour < 18) return t('Good afternoon');
    return t('Good evening');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">{t('Loading your dashboard...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Welcome + Availability toggle ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-0.5">{greeting()}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {user?.name || t('Worker')} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('Find job opportunities and grow your agricultural career.')}
          </p>
        </div>

        {/* Availability toggle */}
        <div className={`flex-shrink-0 rounded-2xl border p-4 min-w-[200px]
                         ${isAvailable
                           ? 'bg-success-light border-success/20'
                           : 'bg-muted border-border'
                         }`}>
          <div className="text-xs font-medium text-muted-foreground mb-1.5">{t('Availability')}</div>
          <div className={`text-sm font-semibold mb-3 ${isAvailable ? 'text-success' : 'text-muted-foreground'}`}>
            {isAvailable ? t('Active — accepting jobs') : t('Inactive')}
          </div>
          <button
            onClick={handleToggleAvailability}
            disabled={isAvailable === null || availabilityLoading}
            className={`w-full flex items-center justify-center gap-2 h-9 rounded-xl text-sm font-medium
                        transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                        disabled:opacity-60 disabled:cursor-not-allowed
                        ${isAvailable
                          ? 'bg-success text-success-foreground hover:bg-success/90'
                          : 'bg-primary text-primary-foreground hover:bg-primary-hover'
                        }`}
          >
            {availabilityLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : isAvailable
                ? <><ToggleRight className="w-4 h-4" />{t('Set Inactive')}</>
                : <><ToggleLeft className="w-4 h-4" />{t('Set Active')}</>
            }
          </button>
          {availabilityError && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              {availabilityError}
            </p>
          )}
        </div>
      </div>

      {/* ── Activity Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: t('Applications Sent'),
            value: applicationsSent,
            icon: Briefcase,
            bg: 'bg-primary-light',
            color: 'text-primary',
            action: () => navigate('/my-applications'),
            actionLabel: t('View All'),
          },
          {
            label: t('Jobs Completed'),
            value: jobsCompleted,
            icon: CheckCircle,
            bg: 'bg-success-light',
            color: 'text-success',
            action: () => navigate('/my-applications'),
            actionLabel: t('View History'),
          },
          {
            label: t('Your Rating'),
            value: averageRating !== null ? averageRating.toFixed(1) : '—',
            icon: Star,
            bg: 'bg-warning-light',
            color: 'text-warning',
            sub: averageRating !== null
              ? `${totalRatings} ${totalRatings === 1 ? t('rating') : t('ratings')}`
              : t('No ratings yet'),
            action: null,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                {stat.action && (
                  <button
                    onClick={stat.action}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    {stat.actionLabel}
                  </button>
                )}
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="stat-number">{stat.value}</span>
                  {stat.label === t('Your Rating') && averageRating !== null && (
                    <Star className="w-4 h-4 text-warning fill-warning" />
                  )}
                </div>
                <div className="stat-label mt-0.5">{stat.label}</div>
                {stat.sub && (
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.sub}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Find Jobs CTA ── */}
      <div className="card-sand rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center
                       justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground mb-1">{t('Looking for work?')}</h3>
          <p className="text-sm text-muted-foreground">{t('Browse available farm jobs near your location.')}</p>
        </div>
        <button
          onClick={() => navigate('/jobs')}
          className="btn-primary h-10 px-6 gap-2 flex-shrink-0"
        >
          <Search className="w-4 h-4" />
          {t('Browse Jobs')}
        </button>
      </div>

      {/* ── Quick actions grid ── */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">{t('Quick Actions')}</h2>
        {LABOUR_CARDS && LABOUR_CARDS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {LABOUR_CARDS.map((card) => (
              <DashboardCard
                key={card.id}
                card={{
                  ...card,
                  title: t(card.titleKey),
                  description: t(card.descriptionKey),
                }}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-state-icon">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{t('No actions available')}</h3>
            <p className="text-sm text-muted-foreground">{t('No dashboard items available at the moment.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabourDashboard;
