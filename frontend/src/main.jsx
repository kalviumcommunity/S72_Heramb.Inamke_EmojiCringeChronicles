import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Set up axios defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
axios.defaults.withCredentials = true;

// Set up axios interceptor for token refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Redirect to login page after authentication failure
const redirectToLogin = () => {
  window.location.href = '/login';
};

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Only try to refresh if it's an auth error and we haven't tried refreshing this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is in progress, add request to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        await axios.post(`${API_URL}/auth/refresh-token`);
        
        // If refresh successful, retry all queued requests
        processQueue(null);
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, reject all queued requests
        processQueue(refreshError);
        
        // Clear local storage in case there's any remaining auth data
        localStorage.removeItem('admin-token');

        // Redirect to login page only if it's not a login request that failed
        if (!originalRequest.url.includes('/auth/login') && 
            !originalRequest.url.includes('/auth/register')) {
          redirectToLogin();
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// Add a request interceptor to ensure the API URL is correctly set
axios.interceptors.request.use(
  config => {
    // Ensure credentials are sent with every request
    config.withCredentials = true;
    
    // If the URL doesn't already include the API_URL and isn't an absolute URL
    if (!config.url.includes('://') && !config.url.startsWith(API_URL)) {
      config.url = `${API_URL}${config.url.startsWith('/') ? '' : '/'}${config.url}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);