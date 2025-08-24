import axios from 'axios';

// Normalize API base URL
const normalize = (url) => url.replace(/\/$/, '');
const fromEnvUrl = process.env.REACT_APP_API_URL ? normalize(process.env.REACT_APP_API_URL) + '/api' : null; // preferred (no /api in var)
const legacyEnvUrl = process.env.REACT_APP_API_BASE_URL || null; // legacy support (already includes /api)

let baseURL = legacyEnvUrl || fromEnvUrl;

if (!baseURL) {
  if (process.env.NODE_ENV === 'production') {
    // In production with no env, use relative path (assumes reverse proxy or same-origin)
    baseURL = '/api';
  } else {
    baseURL = 'http://localhost:5000/api';
  }
}

// Create a custom Axios instance
const api = axios.create({ baseURL });

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
