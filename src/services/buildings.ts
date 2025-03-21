import axios from 'axios';
import { API_BASE_URL } from './auth';
import { Building } from '../types/building';

export const buildingsService = {
  getBuildings: async (): Promise<Building[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/buildings`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};