import React, { useEffect, useState } from 'react';
import Header from '../components/Common/Header';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import { Users, Clock, Calendar, MapPin, CheckCircle, XCircle, MessageSquare, Phone } from 'lucide-react';

const WorkerApplications = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [processing, setProcessing] = useState(null);

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

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerApplications;

