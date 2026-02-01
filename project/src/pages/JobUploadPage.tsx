import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LeafletMap from '../components/Common/LeafletMap';
import type { RouteWaypoint } from '../components/Common/LeafletMap';
import { jobService } from '../services/jobService';
import { MapPin, Users, Calendar, DollarSign, Clock, Upload, Map, Navigation } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  category: string;
  wage_per_day: string;
  duration_days: string;
  required_workers: string;
  start_date: string;
  end_date: string;
  address: string;
  latitude: string;
  longitude: string;
  radius_km: string;
}

interface Labour {
  id: number;
  name: string;
  phone: string;
  distance: number;
  latitude?: number;
  longitude?: number;
}

interface Errors {
  [key: string]: string;
}

const JobUploadPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'planting',
    wage_per_day: '',
    duration_days: '',
    required_workers: '',
    start_date: '',
    end_date: '',
    address: '',
    latitude: '',
    longitude: '',
    radius_km: '5'
  });
  
  const [availableLabours, setAvailableLabours] = useState<Labour[]>([]);
  const [labourCount, setLabourCount] = useState(0);
  const [searchRadius, setSearchRadius] = useState(5);
  const [loading, setLoading] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showMap, setShowMap] = useState(false);
  const [routeWaypoints, setRouteWaypoints] = useState<RouteWaypoint[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ total_distance_km: number; total_time_min: number; algorithm_used: string } | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Normalize and validate coordinates; auto-swap if user entered reversed order
  const normalizeCoords = (lat: number, lon: number) => {
    let normLat = lat;
    let normLon = lon;
    // If values look swapped (|lat|>90 and |lon|<=90), swap them
    if (Math.abs(normLat) > 90 && Math.abs(normLon) <= 90) {
      const tmp = normLat;
      normLat = normLon;
      normLon = tmp;
    }
    // Clamp to valid ranges
    normLat = Math.max(-90, Math.min(90, normLat));
    normLon = Math.max(-180, Math.min(180, normLon));
    return { lat: parseFloat(normLat.toFixed(6)), lon: parseFloat(normLon.toFixed(6)) };
  };

  const jobCategories = [
    { value: 'planting', label: t('Planting') },
    { value: 'harvesting', label: t('Harvesting') },
    { value: 'irrigation', label: t('Irrigation') },
    { value: 'pest_control', label: t('Pest Control') },
    { value: 'maintenance', label: t('Maintenance') },
    { value: 'transport', label: t('Transport') },
    { value: 'other', label: t('Other') }
  ];

  useEffect(() => {
    if (user?.role !== 'farmer') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'latitude' || name === 'longitude') {
      // Try to co-validate when both present
      const next = { ...formData, [name]: value } as FormData;
      const latNum = parseFloat(next.latitude as string);
      const lonNum = parseFloat(next.longitude as string);
      if (!isNaN(latNum) && !isNaN(lonNum)) {
        const { lat, lon } = normalizeCoords(latNum, lonNum);
        next.latitude = lat.toString();
        next.longitude = lon.toString();
      }
      setFormData(next);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getCurrentLocation = () => {
    setCheckingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const { lat: roundedLat, lon: roundedLon } = normalizeCoords(latitude, longitude);
          
          setFormData(prev => ({
            ...prev,
            latitude: roundedLat.toString(),
            longitude: roundedLon.toString()
          }));
          
          // Use a simple address format instead of reverse geocoding
          setFormData(prev => ({
            ...prev,
            address: `${roundedLat}, ${roundedLon}`
          }));
          
          setCheckingLocation(false);
        },
        (error: GeolocationPositionError) => {
          console.error('Error getting location:', error);
          setCheckingLocation(false);
          setErrors(prev => ({
            ...prev,
            location: t('Unable to get your location. Please enter manually.')
          }));
        }
      );
    } else {
      setCheckingLocation(false);
      setErrors(prev => ({
        ...prev,
        location: t('Geolocation is not supported by this browser.')
      }));
    }
  };

  const checkLabourAvailability = async () => {
    if (!formData.latitude || !formData.longitude) {
      setErrors(prev => ({
        ...prev,
        location: t('Please set your location first')
      }));
      return;
    }

    try {
      console.log('Checking labour availability with:', {
        latitude: formData.latitude,
        longitude: formData.longitude,
        radius: searchRadius
      });
      
      const response = await jobService.getLabourCount(
        formData.latitude,
        formData.longitude,
        searchRadius
      );
      
      console.log('Labour availability response:', response.data);
      
      setLabourCount(response.data.available_labours_count);
      setAvailableLabours(response.data.labours);
      setSearchRadius(response.data.search_radius_used);
      
      // Update form data with the actual radius used
      setFormData(prev => ({
        ...prev,
        radius_km: response.data.search_radius_used
      }));
    } catch (error: any) {
      console.error('Error checking labour availability:', error);
      console.error('Error details:', error.response?.data);
      setErrors(prev => ({
        ...prev,
        labourCheck: t('Failed to check labour availability: ') + (error.response?.data?.error || error.message)
      }));
    }
  };

  const getOptimalRoute = async (labour: Labour) => {
    if (!formData.latitude || !formData.longitude || typeof labour.latitude !== 'number' || typeof labour.longitude !== 'number') {
      setRouteError(t('Location and labour coordinates are required'));
      return;
    }
    setRouteLoading(true);
    setRouteError(null);
    setRouteWaypoints([]);
    setRouteInfo(null);
    try {
      const response = await jobService.getOptimalRoute(
        parseFloat(formData.latitude),
        parseFloat(formData.longitude),
        labour.latitude,
        labour.longitude,
        labour.name
      );
      const data = response.data as { waypoints: RouteWaypoint[]; total_distance_km: number; total_time_min: number; algorithm_used: string };
      setRouteWaypoints(data.waypoints || []);
      setRouteInfo({
        total_distance_km: data.total_distance_km,
        total_time_min: data.total_time_min,
        algorithm_used: data.algorithm_used
      });
      if (!showMap) setShowMap(true);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err && err.response && typeof (err.response as { data?: { error?: string } }).data?.error === 'string'
        ? (err.response as { data: { error: string } }).data.error
        : t('Failed to compute route');
      setRouteError(message);
    } finally {
      setRouteLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    
    if (!formData.title.trim()) newErrors.title = t('Title is required');
    if (!formData.description.trim()) newErrors.description = t('Description is required');
    if (!formData.wage_per_day || parseFloat(formData.wage_per_day) <= 0) newErrors.wage_per_day = t('Valid wage is required');
    if (!formData.duration_days || parseFloat(formData.duration_days) <= 0) newErrors.duration_days = t('Valid duration is required');
    if (!formData.required_workers || parseFloat(formData.required_workers) <= 0) newErrors.required_workers = t('Valid worker count is required');
    if (!formData.start_date) newErrors.start_date = t('Start date is required');
    if (!formData.end_date) newErrors.end_date = t('End date is required');
    if (!formData.address.trim()) newErrors.address = t('Address is required');
    if (!formData.latitude || !formData.longitude) newErrors.location = t('Location is required');
    
    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      newErrors.end_date = t('End date must be after start date');
    }
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Final coordinate normalization before submit
      const latNum = parseFloat(formData.latitude);
      const lonNum = parseFloat(formData.longitude);
      const { lat: finalLat, lon: finalLon } = normalizeCoords(latNum, lonNum);
      
      const jobData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        wage_per_day: parseFloat(formData.wage_per_day),
        duration_days: parseInt(formData.duration_days),
        required_workers: parseInt(formData.required_workers),
        start_date: formData.start_date,
        end_date: formData.end_date,
        address: formData.address.trim(),
        latitude: finalLat,
        longitude: finalLon,
        radius_km: parseFloat(formData.radius_km)
      };
      
      console.log('Creating job with data:', jobData);
      console.log('Coordinates - Latitude:', jobData.latitude, 'Longitude:', jobData.longitude);
      console.log('Coordinate precision - Lat decimal places:', jobData.latitude.toString().split('.')[1]?.length || 0);
      console.log('Coordinate precision - Lon decimal places:', jobData.longitude.toString().split('.')[1]?.length || 0);
      
      const response = await jobService.createJob(jobData);
      console.log('Job created successfully:', response.data);
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating job:', error);
      console.error('Error details:', error.response?.data);
      setErrors(prev => ({
        ...prev,
        submit: t('Failed to create job: ') + (error.response?.data?.error || error.message)
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-green-100 min-h-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Upload className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">{t('Upload Job')}</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Job Title')} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('e.g., Rice Planting Work')}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Category')} *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {jobCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Description')} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('Describe the work requirements, skills needed, etc.')}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
            
            {/* Work Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  {t('Wage per Day')} (₹) *
                </label>
                <input
                  type="number"
                  name="wage_per_day"
                  value={formData.wage_per_day}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.wage_per_day ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="500"
                />
                {errors.wage_per_day && <p className="text-red-500 text-sm mt-1">{errors.wage_per_day}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  {t('Duration')} (days) *
                </label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.duration_days ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="7"
                />
                {errors.duration_days && <p className="text-red-500 text-sm mt-1">{errors.duration_days}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline h-4 w-4 mr-1" />
                  {t('Workers Needed')} *
                </label>
                <input
                  type="number"
                  name="required_workers"
                  value={formData.required_workers}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.required_workers ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="5"
                />
                {errors.required_workers && <p className="text-red-500 text-sm mt-1">{errors.required_workers}</p>}
              </div>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {t('Start Date')} *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.start_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {t('End Date')} *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  min={formData.start_date || new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.end_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
              </div>
            </div>
            
            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-indigo-600" />
                  {t('Job Location')}
                </h3>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={checkingLocation}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {checkingLocation ? t('Getting Location...') : t('Use Current Location')}
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Address')} *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('Enter job location address')}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Latitude')}
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    step="any"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.latitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="19.0760"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('Longitude')}
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    step="any"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.longitude ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="72.8777"
                  />
                </div>
              </div>
              
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>
            
            {/* Labour Availability Check */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  {t('Labour Availability')}
                </h3>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    {showMap ? t('Hide Map') : t('Show Map')}
                  </button>
                  <button
                    type="button"
                    onClick={checkLabourAvailability}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {t('Check Availability')}
                  </button>
                </div>
              </div>
              
              {labourCount > 0 && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        {t('Available Labours')}: {labourCount}
                      </span>
                      <span className="text-sm text-gray-600">
                        {t('Search Radius')}: {searchRadius}km
                      </span>
                    </div>
                  </div>
                  
                  {availableLabours.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">{t('Nearby Labours')}:</h4>
                      <div className="space-y-2">
                        {availableLabours.slice(0, 5).map((labour, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 flex justify-between items-center flex-wrap gap-2">
                            <div>
                              <span className="font-medium">{labour.name}</span>
                              <span className="text-sm text-gray-600 ml-2">({labour.phone})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-blue-600">{labour.distance}km</span>
                              {typeof labour.latitude === 'number' && typeof labour.longitude === 'number' && (
                                <button
                                  type="button"
                                  onClick={() => getOptimalRoute(labour)}
                                  disabled={routeLoading}
                                  className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                                  title={t('Get optimal route (Dijkstra / SLM)')}
                                >
                                  <Navigation className="h-3 w-3" />
                                  {t('Get route')}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {availableLabours.length > 5 && (
                          <p className="text-sm text-gray-600">
                            {t('And')} {availableLabours.length - 5} {t('more labours available')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {routeLoading && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                      {t('Computing optimal route...')}
                    </p>
                  )}
                  {routeInfo && (
                    <div className="bg-green-50 rounded-lg p-3 mt-2 flex items-center gap-3 flex-wrap">
                      <Navigation className="h-5 w-5 text-green-600" />
                      <div className="text-sm text-green-800">
                        <span className="font-medium">{t('Optimal route')}:</span>{' '}
                        {routeInfo.total_distance_km} km, ~{routeInfo.total_time_min} min
                        {routeInfo.algorithm_used && (
                          <span className="ml-2 text-green-700">
                            ({routeInfo.algorithm_used === 'slm' ? t('Spatial Landmark Model') : routeInfo.algorithm_used === 'dijkstra' ? t("Dijkstra's algorithm") : routeInfo.algorithm_used})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {routeError && (
                    <p className="text-sm text-red-600 mt-2">{routeError}</p>
                  )}
                </div>
              )}
              
              {errors.labourCheck && (
                <p className="text-red-500 text-sm">{errors.labourCheck}</p>
              )}

              {/* Professional Map (Leaflet) */}
              {showMap && formData.latitude && formData.longitude && (
                <div className="mt-6">
                  <LeafletMap
                    center={{
                      lat: parseFloat(formData.latitude),
                      lng: parseFloat(formData.longitude)
                    }}
                    zoom={13}
                    height="420px"
                    circleRadiusKm={searchRadius}
                    routeWaypoints={routeWaypoints}
                    points={availableLabours
                      .filter(l => typeof l.latitude === 'number' && typeof l.longitude === 'number')
                      .map(l => ({
                        id: l.id,
                        lat: Number(l.latitude),
                        lng: Number(l.longitude),
                        label: l.name,
                        description: `${l.phone || ''}${l.distance ? ` • ${l.distance}km` : ''}`
                      }))}
                  />
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {t('Cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('Creating Job...')}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {t('Create Job')}
                  </>
                )}
              </button>
            </div>
            
            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobUploadPage;
