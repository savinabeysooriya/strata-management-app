import axios from 'axios';
import { API_BASE_URL } from './auth';
import { Owner } from '../types/owner';


export const ownersService = {
  getOwners: async (): Promise<Owner[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in local storage');
      }
      const response = await axios.get(`${API_BASE_URL}/admin/owners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};