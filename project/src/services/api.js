import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor → add token
API.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('tokens');
    
    if (tokens) {
      try {
        const parsedTokens = JSON.parse(tokens);
        
        if (parsedTokens.access) {
          config.headers.Authorization = `Bearer ${parsedTokens.access}`;
        }
      } catch {
        localStorage.removeItem('tokens');
      }
    }
    
    // Remove Content-Type header for FormData to let axios set it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//
// 🔹 AUTH APIs
//
export const login = (data) => API.post('/auth/login/', data);
export const register = (data) => API.post('/auth/register/', data);

//
// 🔹 DASHBOARD APIs
//
export const fetchSchemes = () => API.get('/schemes/');
export const fetchPrices = () => API.get('/market/prices/');
export const fetchJobs = () => API.get('/jobs/');
export const fetchEquipment = () => API.get('/equipment/');
export const fetchNotifications = () => API.get('/notifications/');
export const fetchHistory = () => API.get('/history/');

//
// 🔹 EQUIPMENT APIs
//
export const createEquipmentListing = (data) => API.post('/equipment/', data);
export const updateEquipmentListing = (id, data) => API.put(`/equipment/${id}/`, data);

//
// 🔹 JOB APIs
//
export const createJob = (data) => API.post('/jobs/', data);
export const getJobs = () => API.get('/jobs/');
export const getNearbyJobs = () => API.get('/jobs/nearby/');
export const getJob = (jobId) => API.get(`/jobs/${jobId}/`);
export const updateJob = (jobId, data) => API.put(`/jobs/${jobId}/`, data);
export const deleteJob = (jobId) => API.delete(`/jobs/${jobId}/`);
export const applyForJob = (jobId, data) => API.post(`/jobs/${jobId}/apply/`, data);
export const getJobApplications = (jobId) => API.get(`/jobs/${jobId}/applications/`);
export const respondToApplication = (jobId, data) => API.post(`/jobs/${jobId}/respond_to_application/`, data);
export const getLabourCount = (params) => API.get('/jobs/labour_count/', { params });
export const getMyJobApplications = () => API.get('/job-applications/');
export const updateJobApplication = (applicationId, data) => API.put(`/job-applications/${applicationId}/`, data);

//
// 🔹 TODOS APIs (from earlier example)
//
export const todosApi = {
  getAll: () => API.get('/todos/').then((res) => res.data),
  get: (id) => API.get(`/todos/${id}/`).then((res) => res.data),
  create: (todo) => API.post('/todos/', todo).then((res) => res.data),
  update: (id, todo) => API.put(`/todos/${id}/`, todo).then((res) => res.data),
  remove: (id) => API.delete(`/todos/${id}/`).then((res) => res.data),
};

export default API;
