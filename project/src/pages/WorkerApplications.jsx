import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import RatingModal from '../components/Common/RatingModal';
import {
  Users, Clock, Calendar, MapPin, CheckCircle, XCircle, MessageSquare,
  Phone, Star, CheckCircle2, Briefcase, Inbox, Loader2, ChevronRight
} from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   className: 'badge-warning' },
  accepted:  { label: 'Accepted',  className: 'badge-success' },
  rejected:  { label: 'Rejected',  className: 'badge-destructive' },
  completed: { label: 'Completed', className: 'badge-info' },
};

const WorkerApplications = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [processing, setProcessing] = useState(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      navigate('/dashboard');
      return;
    }
    loadMyJobs();
  }, [user, navigate]);

  const loadMyJobs = async () => {
    try {
      setLoading(true);
      const res = await jobService.getMyJobs();
      setJobs(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedJob(res.data[0].id);
      }
    } catch (e) {
      console.error('Failed to load jobs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJob) loadApplications(selectedJob);
  }, [selectedJob]);

  const loadApplications = async (jobId) => {
    try {
      const res = await jobService.getJobApplications(jobId);
      setApplications(res.data || []);
    } catch (e) {
      console.error('Failed to load applications', e);
      setApplications([]);
    }
  };

  const handleResponse = async (applicationId, status) => {
    if (!selectedJob) return;
    setProcessing(applicationId);
    try {
      await jobService.respondToApplication(selectedJob, applicationId, status);
      await loadApplications(selectedJob);
    } catch (e) {
      alert(t('Failed to respond to application'));
    } finally {
      setProcessing(null);
    }
  };

  const handleMarkCompleted = async (applicationId) => {
    if (!selectedJob) return;
    setProcessing(applicationId);
    try {
      await jobService.updateApplication(applicationId, { status: 'completed' });
      await loadApplications(selectedJob);
    } catch (e) {
      alert(t('Failed to mark as completed'));
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const handleOpenRatingModal = (application) => {
    setSelectedApplication(application);
    setRatingModalOpen(true);
  };

  const handleRatingSubmitted = () => {
    if (selectedJob) loadApplications(selectedJob);
  };

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`}
        />
      ))}
      <span className="ml-1 text-xs text-muted-foreground">({rating}/5)</span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">{t('Loading applications...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-primary" />
          {t('Worker Applications')}
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {t('Manage job applications from workers')}
        </p>
      </div>

      {/* Empty — no jobs */}
      {jobs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">{t('No jobs posted yet')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('You have not posted any jobs yet.')}
            </p>
            <button
              onClick={() => navigate('/upload-jobs')}
              className="btn-primary h-10 px-6 gap-2"
            >
              {t('Post a Job')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Jobs sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">
                {t('My Jobs')}
              </h2>
              <div className="space-y-1.5">
                {jobs.map(job => {
                  const isSelected = selectedJob === job.id;
                  return (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJob(job.id)}
                      className={`w-full text-left px-3 py-3 rounded-xl border transition-all duration-200
                                  ${isSelected
                                    ? 'border-primary/30 bg-primary-light text-primary font-semibold'
                                    : 'border-border hover:border-primary/20 hover:bg-muted/40'
                                  }`}
                    >
                      <div className="text-sm font-medium truncate">{job.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {job.applications_count || 0} {t('applications')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Applications panel */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="p-5 border-b border-border">
                <h2 className="text-base font-semibold text-foreground">{t('Applications')}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {applications.length} {t('total')}
                </p>
              </div>

              {applications.length === 0 ? (
                <div className="empty-state py-12">
                  <div className="empty-state-icon">
                    <Inbox className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">{t('No applications yet')}</h3>
                  <p className="text-sm text-muted-foreground">{t('No applications yet for this job.')}</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {applications.map(app => {
                    const status = app.status || 'pending';
                    const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
                    return (
                      <div
                        key={app.id}
                        className="border border-border rounded-xl p-4 hover:shadow-sm
                                   transition-all duration-200"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-sm text-foreground">{app.labour_name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5 capitalize">{app.job_title}</div>
                          </div>
                          <span className={`badge ${statusCfg.className} capitalize`}>
                            {statusCfg.label}
                          </span>
                        </div>

                        {/* Message */}
                        {app.message && (
                          <div className="mb-3 p-2.5 rounded-lg bg-muted/40 flex gap-2 text-sm text-muted-foreground">
                            <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                            <span className="text-xs leading-relaxed">{app.message}</span>
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            {app.contact_phone || app.labour_phone || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {app.applied_at ? formatDate(app.applied_at) : 'N/A'}
                          </div>
                        </div>

                        {/* Rating display */}
                        {status === 'completed' && app.has_rating && app.rating && (
                          <div className="mb-3 p-3 rounded-xl bg-success-light border border-success/20">
                            <div className="text-xs font-medium text-success mb-1.5">{t('Your Rating')}</div>
                            {renderStars(app.rating.rating)}
                            {app.rating.comment && (
                              <p className="text-xs text-muted-foreground mt-1.5 italic">
                                "{app.rating.comment}"
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        {status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleResponse(app.id, 'accepted')}
                              disabled={processing === app.id}
                              className="flex-1 btn-primary h-8 text-xs gap-1.5 disabled:opacity-60"
                            >
                              {processing === app.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <CheckCircle className="w-3.5 h-3.5" />
                              }
                              {t('Accept')}
                            </button>
                            <button
                              onClick={() => handleResponse(app.id, 'rejected')}
                              disabled={processing === app.id}
                              className="flex-1 h-8 px-4 rounded-xl text-xs font-medium gap-1.5
                                         bg-destructive text-destructive-foreground
                                         hover:bg-destructive/90 transition-colors duration-150
                                         flex items-center justify-center disabled:opacity-60"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              {t('Reject')}
                            </button>
                          </div>
                        )}

                        {status === 'accepted' && (
                          <button
                            onClick={() => handleMarkCompleted(app.id)}
                            disabled={processing === app.id}
                            className="w-full btn-primary h-8 text-xs gap-1.5 disabled:opacity-60"
                          >
                            {processing === app.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <CheckCircle2 className="w-3.5 h-3.5" />
                            }
                            {t('Mark as Completed')}
                          </button>
                        )}

                        {status === 'completed' && !app.has_rating && (
                          <button
                            onClick={() => handleOpenRatingModal(app)}
                            className="w-full h-8 px-4 rounded-xl text-xs font-medium gap-1.5
                                       bg-warning text-warning-foreground
                                       hover:bg-warning/90 transition-colors duration-150
                                       flex items-center justify-center"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {t('Rate Performance')}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        jobApplication={selectedApplication}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};

export default WorkerApplications;
