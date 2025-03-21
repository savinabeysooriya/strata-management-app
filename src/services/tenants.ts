import axios from 'axios';
import { API_BASE_URL } from './auth';
import { Tenant } from '../types/tenant';


export const tenantsService = {
  getTenants: async (): Promise<Tenant[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/tenants`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};