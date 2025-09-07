// axiosConfig.js
import axios from 'axios';
import { BASE_URL } from '../BaseUrl';

// Set global defaults for all axios requests
axios.defaults.withCredentials = true;
axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor to ensure credentials are always included
axios.interceptors.request.use(
  (config) => {
    // Ensure credentials are always included
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Only redirect to login if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle other common errors
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }
    
    if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default axios;