import React, { useEffect, useState } from 'react';
import Header from '../components/Common/Header';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import earningsService from '../services/earningsService';
import { Briefcase, Clock, Calendar, MapPin, CheckCircle2, DollarSign } from 'lucide-react';

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
    const load = async () => {
      try {
        setLoading(true);
        const res = await jobService.getMyApplications();
        setApplications(res.data || []);
      } catch (e) {
        setError(e?.response?.data?.error || e?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const handleMarkCompleted = async (applicationId) => {
    setProcessing(applicationId);
    try {
      await jobService.updateApplication(applicationId, { status: 'completed' });
      // Reload applications
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
      // Reload applications
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
            {t('My Applications')}
          </h1>
          <p className="text-gray-600">{t('Track your job applications and their status')}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 mb-6">{error}</div>
        )}

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600">{t('You have not applied to any jobs yet.')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="text-xl font-semibold text-gray-900">{app.job?.title || t('Job')}</div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" />
                        {app.job?.start_date ? `${formatDate(app.job.start_date)} - ${formatDate(app.job.end_date)}` : t('Dates N/A')}</div>
                      <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />
                        {app.job?.address || t('Address N/A')}</div>
                      <div className="flex items-center"><Clock className="h-4 w-4 mr-2" />
                        {t('Status')}: <span className={`ml-1 font-medium capitalize px-2 py-1 rounded ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          app.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>{app.status || 'pending'}</span></div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right md:ml-4">
                    <div className="text-2xl font-bold text-green-600">₹{app.job?.wage_per_day || '-'}</div>
                    <div className="text-sm text-gray-500">{t('per day')}</div>
                  </div>
                </div>
                {app.status === 'accepted' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleMarkCompleted(app.id)}
                      disabled={processing === app.id}
                      className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {processing === app.id ? t('Processing...') : t('Mark as Completed')}
                    </button>
                  </div>
                )}
                {app.status === 'completed' && !app.has_earning && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800">
                        {t('No earning record found. Create one to track your payment.')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCreateEarning(app.id)}
                      disabled={processing === app.id}
                      className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      {processing === app.id ? t('Creating...') : t('Create Earning Record')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;


