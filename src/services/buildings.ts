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
  },

  getMyBuilding: async (): Promise<Building[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in local storage');
      }
      const response = await axios.get(`${API_BASE_URL}/building-member/my-building`, {
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