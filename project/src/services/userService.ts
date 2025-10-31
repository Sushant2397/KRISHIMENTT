import API from './api';

export const userService = {
  getAvailability: () => API.get('/auth/me/availability/'),
  setAvailability: (is_available: boolean) => API.put('/auth/me/availability/', { is_available })
};

export default userService;


