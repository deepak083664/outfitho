import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    // Remove trailing slash if present, then append /api if not already there
    const cleanUrl = envUrl.replace(/\/$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  return 'https://outfitho.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor for better error handling and logging
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log API errors for debugging
    console.error('API Error Response:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    if (error.response?.status === 401) {
      // Handle unauthorized (token expired)
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      // Redirect to login if needed, or reload to trigger route reload
    }

    return Promise.reject(error);
  }
);

export default api;
