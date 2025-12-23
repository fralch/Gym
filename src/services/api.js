import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the API
const BASE_URL = 'https://grupoviajesroxana.com/api/v1/endpoint';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout (increased for file uploads)
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Only set Content-Type if not already explicitly set in the request config
      if (!config.headers['Content-Type']) {
        // Check if data is FormData by checking for _parts property (React Native)
        const isFormData = config.data && (
          config.data instanceof FormData ||
          (config.data._parts !== undefined)
        );

        // Only set application/json for non-FormData requests
        if (!isFormData) {
          config.headers['Content-Type'] = 'application/json';
        }
        // For FormData, leave Content-Type undefined to let the browser/runtime set it
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');
        // You might want to navigate to login screen here
        console.error('Unauthorized - Please login again');
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Forbidden:', error.response.data.error);
      }

      // Handle 422 Validation errors
      if (error.response.status === 422) {
        console.error('Validation errors:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
