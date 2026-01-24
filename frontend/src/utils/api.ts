import axios, { AxiosInstance, AxiosError } from 'axios';

// In Next.js, expose client-side env vars via NEXT_PUBLIC_*
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const token = localStorage.getItem('token');
    
    // Skip redirect for dev-token (dev mode)
    if (token === 'dev-token') {
      // In dev mode, don't redirect on API errors
      // Just log the error and return it
      if (error.response?.status === 401) {
        console.warn('🔧 Dev mode: API returned 401, but skipping redirect');
      } else if (!error.response) {
        // Connection error (backend not running)
        console.warn('🔧 Dev mode: Backend not available, but continuing in dev mode');
      }
      return Promise.reject(error);
    }
    
    // Only redirect to login for real 401 errors (not dev mode)
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api };

