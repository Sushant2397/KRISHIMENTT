import API from './api';

// Rating-related API functions
export const ratingService = {
  // Create a rating for a completed job application
  createRating: (jobApplicationId: number, rating: number, comment?: string) =>
    API.post('/labour-ratings/', {
      job_application: jobApplicationId,
      rating: rating,
      comment: comment || ''
    }),

  // Get ratings for a specific labour
  getLabourRatings: (labourId: number) =>
    API.get(`/labour-ratings/labour_ratings/?labour_id=${labourId}`),

  // Get average rating for current user (if labour)
  getMyAverageRating: () =>
    API.get('/labour-ratings/my_average_rating/'),

  // Get all ratings given by current user (if farmer)
  getMyGivenRatings: () =>
    API.get('/labour-ratings/'),

  // Get a specific rating
  getRating: (ratingId: number) =>
    API.get(`/labour-ratings/${ratingId}/`),

  // Update a rating
  updateRating: (ratingId: number, rating: number, comment?: string) =>
    API.put(`/labour-ratings/${ratingId}/`, {
      rating: rating,
      comment: comment || ''
    })
};

export default ratingService;

