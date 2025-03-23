import axios from 'axios';
import { API_BASE_URL } from './auth';
import { Tenant } from '../types/tenant';


export const tenantsService = {
  getTenants: async (): Promise<Tenant[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in local storage');
      }
      const response = await axios.get(`${API_BASE_URL}/admin/tenants`, {
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