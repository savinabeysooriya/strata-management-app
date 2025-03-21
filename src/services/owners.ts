import axios from 'axios';
import { API_BASE_URL } from './auth';
import { Owner } from '../types/owner';


export const ownersService = {
  getOwners: async (): Promise<Owner[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/owners`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};