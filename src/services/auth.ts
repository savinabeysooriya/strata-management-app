import axios from 'axios';
import { LoginFormData } from '../types/auth';

const API_BASE_URL = 'https://localhost:44328';

export const authService = {
  login: async (credentials: LoginFormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};