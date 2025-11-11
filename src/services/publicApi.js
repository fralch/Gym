import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://grupoviajesroxana.com/api/v1/endpoint';

// Create axios instance WITHOUT authentication interceptor
// This is used for public endpoints that don't require a token
const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Response interceptor for error handling only
publicApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default publicApi;
