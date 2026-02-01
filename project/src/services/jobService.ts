import API from './api';

// Job-related API functions
export const jobService = {
  // Create a new job
  createJob: (jobData) => API.post('/jobs/', jobData),
  
  // Get all jobs for farmer (their posted jobs)
  getMyJobs: () => API.get('/jobs/'),
  
  // Get nearby jobs for labour
  getNearbyJobs: (latitude?: number, longitude?: number) => {
    const params = new URLSearchParams();
    if (latitude && longitude) {
      params.append('latitude', latitude.toString());
      params.append('longitude', longitude.toString());
    }
    return API.get(`/jobs/nearby/?${params.toString()}`);
  },
  
  // Get job details
  getJob: (jobId) => API.get(`/jobs/${jobId}/`),
  
  // Update job
  updateJob: (jobId, data) => API.put(`/jobs/${jobId}/`, data),
  
  // Delete job
  deleteJob: (jobId) => API.delete(`/jobs/${jobId}/`),
  
  // Apply for a job (labour only)
  applyForJob: (jobId, message = '', contactPhone?: string, contactName?: string) => 
    API.post(`/jobs/${jobId}/apply/`, { 
      message, 
      contact_phone: contactPhone, 
      contact_name: contactName 
    }),
  
  // Get applications for a job (farmer only)
  getJobApplications: (jobId) => API.get(`/jobs/${jobId}/applications/`),
  
  // Respond to application (accept/reject)
  respondToApplication: (jobId, applicationId, status) => 
    API.post(`/jobs/${jobId}/respond_to_application/`, {
      application_id: applicationId,
      status: status
    }),
  
  // Get labour count in area
  getLabourCount: (latitude, longitude, radius = 5) => 
    API.get('/jobs/labour_count/', {
      params: { latitude, longitude, radius }
    }),

  // Get optimal route (Dijkstra local / SLM long-distance)
  getOptimalRoute: (fromLat: number, fromLon: number, toLat: number, toLon: number, toLabel?: string) =>
    API.get('/jobs/route/', {
      params: {
        from_lat: fromLat,
        from_lon: fromLon,
        to_lat: toLat,
        to_lon: toLon,
        to_label: toLabel || 'Destination'
      }
    }),
  
  // Get job applications for labour
  getMyApplications: () => API.get('/job-applications/'),
  
  // Update application status
  updateApplication: (applicationId, data) => API.put(`/job-applications/${applicationId}/`, data)
};

export default jobService;
