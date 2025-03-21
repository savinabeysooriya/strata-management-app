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
  }
};