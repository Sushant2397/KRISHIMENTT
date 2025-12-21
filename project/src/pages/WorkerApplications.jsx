import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import RatingModal from '../components/Common/RatingModal';
import { Users, Clock, Calendar, MapPin, CheckCircle, XCircle, MessageSquare, Phone, Star, CheckCircle2 } from 'lucide-react';

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

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const handleOpenRatingModal = (application) => {
    setSelectedApplication(application);
    setRatingModalOpen(true);
  };

  const handleRatingSubmitted = () => {
    if (selectedJob) {
      loadApplications(selectedJob);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-green-100 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            {t('Worker Applications')}
          </h1>
          <p className="text-gray-600">{t('Manage job applications from workers')}</p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600">{t('You have not posted any jobs yet.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Jobs list */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('My Jobs')}</h2>
                <div className="space-y-3">
                  {jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJob(job.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        selectedJob === job.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-600">
                        {job.applications_count || 0} {t('applications')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Applications list */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('Applications')}</h2>
                {applications.length === 0 ? (
                  <p className="text-gray-600">{t('No applications yet for this job.')}</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map(app => (
                      <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold text-gray-900">{app.labour_name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="capitalize">{app.job_title}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            app.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status || 'pending'}
                          </span>
                        </div>

                        {app.message && (
                          <div className="mb-3 text-sm text-gray-600">
                            <MessageSquare className="inline h-4 w-4 mr-1" />
                            {app.message}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {app.contact_phone || app.labour_phone || 'N/A'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {app.applied_at ? formatDate(app.applied_at) : 'N/A'}
                          </div>
                        </div>

                        {/* Rating display for completed jobs */}
                        {app.status === 'completed' && app.has_rating && app.rating && (
                          <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm font-medium text-gray-700 mb-1">
                                  {t('Your Rating')}
                                </div>
                                {renderStars(app.rating.rating)}
                              </div>
                              {app.rating.comment && (
                                <div className="text-sm text-gray-600 italic">
                                  "{app.rating.comment}"
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        {app.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleResponse(app.id, 'accepted')}
                              disabled={processing === app.id}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {t('Accept')}
                            </button>
                            <button
                              onClick={() => handleResponse(app.id, 'rejected')}
                              disabled={processing === app.id}
                              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              {t('Reject')}
                            </button>
                          </div>
                        )}

                        {/* Mark as completed button for accepted applications */}
                        {app.status === 'accepted' && (
                          <button
                            onClick={() => handleMarkCompleted(app.id)}
                            disabled={processing === app.id}
                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('Mark as Completed')}
                          </button>
                        )}

                        {/* Rate button for completed jobs without rating */}
                        {app.status === 'completed' && !app.has_rating && (
                          <button
                            onClick={() => handleOpenRatingModal(app)}
                            className="w-full flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                          >
                            <Star className="h-4 w-4 mr-2 fill-current" />
                            {t('Rate Performance')}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
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

