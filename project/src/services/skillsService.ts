import API from './api';

// Skills-related API functions
export const skillsService = {
  // Get all skills for current user
  getMySkills: () => API.get('/labour-skills/'),

  // Get skills for a specific labour (for farmers)
  getLabourSkills: (labourId: number) => API.get(`/labour-skills/?labour_id=${labourId}`),

  // Create a new skill
  createSkill: (skillData: {
    skill_name: string;
    category: string;
    experience_level: string;
    years_of_experience: number;
    description?: string;
    certifications?: string;
  }) => API.post('/labour-skills/', skillData),

  // Update a skill
  updateSkill: (skillId: number, skillData: any) => API.put(`/labour-skills/${skillId}/`, skillData),

  // Delete a skill
  deleteSkill: (skillId: number) => API.delete(`/labour-skills/${skillId}/`),

  // Get skill categories
  getCategories: () => API.get('/labour-skills/categories/'),

  // Get experience levels
  getExperienceLevels: () => API.get('/labour-skills/experience_levels/')
};

export default skillsService;

