import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook for making API requests with authentication
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { refreshToken } = useAuth();

  /**
   * Make an API request with authentication
   * @param {string} method - HTTP method (get, post, put, delete)
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request data (for POST/PUT)
   * @param {object} options - Additional axios options
   */
  const request = useCallback(
    async (method, endpoint, data = null, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const url = endpoint.startsWith('http') 
          ? endpoint 
          : `${API_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

        const response = await axios({
          method,
          url,
          data: method !== 'get' ? data : undefined,
          params: method === 'get' ? data : undefined,
          withCredentials: true,
          ...options
        });

        setLoading(false);
        return response.data;
      } catch (err) {
        // Handle error and set error message
        const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [refreshToken]
  );

  // Convenience methods
  const get = useCallback(
    (endpoint, params, options) => request('get', endpoint, params, options),
    [request]
  );

  const post = useCallback(
    (endpoint, data, options) => request('post', endpoint, data, options),
    [request]
  );

  const put = useCallback(
    (endpoint, data, options) => request('put', endpoint, data, options),
    [request]
  );

  const del = useCallback(
    (endpoint, options) => request('delete', endpoint, null, options),
    [request]
  );

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    del
  };
};

export default useApi; 