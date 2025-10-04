import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Update with your actual API URL

export interface Equipment {
  id: string;
  title: string;
  price: number;
  description: string;
  category: 'Tractors' | 'Irrigation' | 'Seeds' | 'Fertilizers' | 'Tools' | 'Other';
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  images: string[];
  location: string;
  postedDate: string;
  seller: {
    name: string;
    rating: number;
  };
}

export const getEquipmentListings = async (): Promise<Equipment[]> => {
  try {
    const response = await axios.get(`${API_URL}/equipment`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment listings:', error);
    return [];
  }
};

export const createEquipmentListing = async (equipment: Omit<Equipment, 'id' | 'postedDate' | 'seller'>): Promise<Equipment> => {
  try {
    // Get user info from local storage or auth context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const newListing = {
      ...equipment,
      postedDate: new Date().toISOString(),
      seller: {
        name: user.name || 'Anonymous',
        rating: 4.5, // Default rating
      },
    };

    const response = await axios.post(`${API_URL}/equipment`, newListing);
    return response.data;
  } catch (error) {
    console.error('Error creating equipment listing:', error);
    throw error;
  }
};
