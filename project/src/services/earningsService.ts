import API from './api';

// Earnings-related API functions
export const earningsService = {
  // Get all earnings for current user
  getMyEarnings: () => API.get('/labour-earnings/'),

  // Get earnings summary with statistics
  getEarningsSummary: () => API.get('/labour-earnings/summary/'),

  // Create earning from completed job
  createEarningFromJob: (jobApplicationId: number) =>
    API.post('/labour-earnings/create_from_job/', { job_application_id: jobApplicationId }),

  // Update an earning record
  updateEarning: (earningId: number, earningData: any) =>
    API.put(`/labour-earnings/${earningId}/`, earningData),

  // Get a specific earning
  getEarning: (earningId: number) => API.get(`/labour-earnings/${earningId}/`)
};

export default earningsService;

