import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true, // Important! Sends cookies automatically for auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      console.log('Unauthorized - redirect to login');
    }
    return Promise.reject(error);
  }
);

export default api;