import axios from 'axios';
import { API_BASE_URL } from './auth';
import { MaintenanceRequest } from '../types/maintenanceRequests';


export const maintenanceRequestsService = {
  getMaintenanceRequests: async (): Promise<MaintenanceRequest[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/maintenance-requests`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyMaintenanceRequests: async (): Promise<MaintenanceRequest[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in local storage');
      }
      const response = await axios.get(`${API_BASE_URL}/building-member/my-requests`, {
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