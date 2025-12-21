import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { jobService } from '../services/jobService';
import LeafletMap from '../components/Common/LeafletMap';
import { MapPin, Users, Calendar, DollarSign, Clock, Briefcase, Filter } from 'lucide-react';

const JobListingPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    maxDistance: 50,
    minWage: '',
    maxDuration: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const jobCategories = [
    { value: '', label: t('All Categories') },
    { value: 'planting', label: t('Planting') },
    { value: 'harvesting', label: t('Harvesting') },
    { value: 'irrigation', label: t('Irrigation') },
    { value: 'pest_control', label: t('Pest Control') },
    { value: 'maintenance', label: t('Maintenance') },
    { value: 'transport', label: t('Transport') },
    { value: 'other', label: t('Other') }
  ];

  useEffect(() => {
    if (user?.role !== 'labour') {
      navigate('/dashboard');
      return;
    }
    // Prefer browser geolocation; fallback to profile/server-based
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          await loadJobs(latitude, longitude);
        },
        async () => {
          await loadJobs();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    } else {
      loadJobs();
    }
  }, [user, navigate]);

  const loadJobs = async (lat?: number, lon?: number) => {
    try {
      setLoading(true);
      const response = (typeof lat === 'number' && typeof lon === 'number')
        ? await jobService.getNearbyJobs(lat, lon)
        : await jobService.getNearbyJobs();
      setJobs(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setLoading(false);
    }
  };

  const applyForJob = async (jobId, message = '') => {
    try {
      setApplyingJob(jobId);
      let contactPhone: string | undefined = undefined;
      let contactName: string | undefined = undefined;
      try {
        contactPhone = prompt(t('Enter contact phone (optional). Leave empty to use profile phone:' )) || undefined;
        contactName = prompt(t('Enter contact name (optional):')) || undefined;
      } catch {}
      
      await jobService.applyForJob(jobId, message, contactPhone, contactName);
      
      // Reload jobs to update application status
      await loadJobs(userLocation?.lat, userLocation?.lng);
      alert(t('Application submitted successfully!'));
    } catch (error: any) {
      console.error('Error applying for job:', error);
      
      // Extract error message from response
      let errorMessage = t('Failed to apply for job. Please try again.');
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Show user-friendly error message
      alert(errorMessage);
    } finally {
      setApplyingJob(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filters.category && job.category !== filters.category) return false;
    if (filters.maxDistance && job.distance_from_user > filters.maxDistance) return false;
    if (filters.minWage && job.wage_per_day < parseFloat(filters.minWage)) return false;
    if (filters.maxDuration && job.duration_days > parseInt(filters.maxDuration)) return false;
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      planting: 'bg-green-100 text-green-800',
      harvesting: 'bg-yellow-100 text-yellow-800',
      irrigation: 'bg-blue-100 text-blue-800',
      pest_control: 'bg-red-100 text-red-800',
      maintenance: 'bg-gray-100 text-gray-800',
      transport: 'bg-purple-100 text-purple-800',
      other: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || colors.other;
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
            <Briefcase className="h-8 w-8 text-blue-600 mr-3" />
            {t('Available Jobs')}
          </h1>
          <p className="text-gray-600">
            {t('Find agricultural work opportunities near you')}
          </p>
          <div className="mt-3">
            <button
              onClick={() => {
                if (!navigator.geolocation) return;
                navigator.geolocation.getCurrentPosition(async (position) => {
                  const { latitude, longitude } = position.coords;
                  setUserLocation({ lat: latitude, lng: longitude });
                  await loadJobs(latitude, longitude);
                });
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {t('Use Current Location')}
            </button>
          </div>
        </div>

        {/* Map of nearby jobs (always visible) */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8">
          <LeafletMap
            center={userLocation ?? (jobs.length > 0 ? {
              lat: Number(jobs[0].latitude),
              lng: Number(jobs[0].longitude)
            } : { lat: 20.5937, lng: 78.9629 })}
            zoom={12}
            height="400px"
            points={jobs
              .filter((j: any) => j.latitude && j.longitude)
              .map((j: any) => ({
                id: j.id,
                lat: Number(j.latitude),
                lng: Number(j.longitude),
                label: j.title,
                description: `${j.address || ''}${j.distance_from_user ? ` • ${j.distance_from_user}km` : ''}`
              }))}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              {t('Filters')}
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              {showFilters ? t('Hide Filters') : t('Show Filters')}
            </button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Category')}
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {jobCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Max Distance')} (km)
                </label>
                <input
                  type="number"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) || 50 }))}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Min Wage')} (₹/day)
                </label>
                <input
                  type="number"
                  value={filters.minWage}
                  onChange={(e) => setFilters(prev => ({ ...prev, minWage: e.target.value }))}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Max Duration')} (days)
                </label>
                <input
                  type="number"
                  value={filters.maxDuration}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxDuration: e.target.value }))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('No jobs found')}
              </h3>
              <p className="text-gray-600">
                {t('Try adjusting your filters or check back later for new opportunities.')}
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {job.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(job.category)}`}>
                        {job.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      ₹{job.wage_per_day}
                    </div>
                    <div className="text-sm text-gray-500">{t('per day')}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {formatDate(job.start_date)} - {formatDate(job.end_date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{job.duration_days} {t('days')}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{job.required_workers} {t('workers needed')}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{job.distance_from_user}km {t('away')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span>{t('Posted by')}: {job.farmer_name}</span>
                    {job.farmer_phone && (
                      <span className="ml-4">
                        <a href={`tel:${job.farmer_phone}`} className="text-blue-600 hover:underline">
                          {job.farmer_phone}
                        </a>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        const message = prompt(t('Add a message (optional):'));
                        if (message !== null) {
                          applyForJob(job.id, message);
                        }
                      }}
                      disabled={applyingJob === job.id}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                    >
                      {applyingJob === job.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('Applying...')}
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-4 w-4 mr-2" />
                          {t('Apply Now')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {job.address && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{job.address}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListingPage;
