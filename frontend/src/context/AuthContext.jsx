import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// Set base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Force axios to send credentials with every request
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to store token in localStorage as fallback
  const setTokenInLocalStorage = (token) => {
    if (token) {
      localStorage.setItem('fallback-token', token);
    } else {
      localStorage.removeItem('fallback-token');
    }
  };

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setError(null);
        console.log('Checking auth status...');
        
        // Special case for admin user (keeping for development)
        const adminToken = localStorage.getItem('admin-token');
        if (adminToken) {
          const adminUser = {
            id: 'admin-id',
            username: 'Admin',
            email: 'admin@gmail.com',
            role: 'admin'
          };
          setUser(adminUser);
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Check for fallback token and set in header if it exists
        const fallbackToken = localStorage.getItem('fallback-token');
        const headers = fallbackToken ? { Authorization: `Bearer ${fallbackToken}` } : {};

        // Try to fetch current user with cookie
        console.log('Fetching user profile...');
        const response = await axios.get(`${API_URL}/auth/me`, { 
          withCredentials: true,
          headers
        });
        
        console.log('User profile response:', response.data);
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setIsAdmin(response.data.user.email === 'admin@gmail.com');
        }
      } catch (error) {
        // Clear user state if not authenticated
        console.log('Auth check error:', error.response?.status, error.response?.data || error.message);
        
        // If token expired, try to refresh it
        if (error.response?.status === 401) {
          try {
            console.log('Attempting to refresh token...');
            const fallbackToken = localStorage.getItem('fallback-token');
            const headers = fallbackToken ? { Authorization: `Bearer ${fallbackToken}` } : {};
            
            const refreshResponse = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
              withCredentials: true,
              headers
            });
            
            console.log('Token refresh response:', refreshResponse.data);
            
            if (refreshResponse.data && refreshResponse.data.token) {
              setTokenInLocalStorage(refreshResponse.data.token);
              
              // If refresh successful, try fetching user again
              const userResponse = await axios.get(`${API_URL}/auth/me`, { 
                withCredentials: true,
                headers: { Authorization: `Bearer ${refreshResponse.data.token}` }
              });
              
              if (userResponse.data && userResponse.data.user) {
                setUser(userResponse.data.user);
                setIsAdmin(userResponse.data.user.email === 'admin@gmail.com');
                return;
              }
            }
          } catch (refreshError) {
            console.log('Token refresh failed:', refreshError.response?.data || refreshError.message);
          }
        }
        
        setUser(null);
        setIsAdmin(false);
        setTokenInLocalStorage(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      // Special case for admin user
      if (email === 'admin@gmail.com' && password === '12345678') {
        // Create mock admin user and token
        const adminUser = {
          id: 'admin-id',
          username: 'Admin',
          email: 'admin@gmail.com',
          role: 'admin'
        };
        
        localStorage.setItem('admin-token', 'admin-mock-token');
        setUser(adminUser);
        setIsAdmin(true);
        return { success: true };
      }
      
      // Regular login for non-admin users
      console.log('Logging in user:', email);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      }, { withCredentials: true });
      
      console.log('Login response:', response.data);
      
      // Handle response that includes both token and user
      const { token, user } = response.data;
      
      // Store token as fallback
      setTokenInLocalStorage(token);
      
      // Store user data in state
      setUser(user);
      setIsAdmin(user.email === 'admin@gmail.com');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'An error occurred during login');
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred during login'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Registering user:', email);
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      }, { withCredentials: true });
      
      console.log('Register response:', response.data);
      
      // Handle response that includes both token and user
      const { token, user } = response.data;
      
      // Store token as fallback
      setTokenInLocalStorage(token);
      
      // Store user data in state
      setUser(user);
      setIsAdmin(user.email === 'admin@gmail.com');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError(error.response?.data?.error || 'An error occurred during registration');
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred during registration'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Logging out user');
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      
      localStorage.removeItem('admin-token');
      localStorage.removeItem('fallback-token');
      setUser(null);
      setIsAdmin(false);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
      setError('Error during logout');
      return { success: false, error: 'Error during logout' };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      console.log('Refreshing token');
      const fallbackToken = localStorage.getItem('fallback-token');
      const headers = fallbackToken ? { Authorization: `Bearer ${fallbackToken}` } : {};
      
      const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
        withCredentials: true,
        headers
      });
      
      console.log('Refresh token response:', response.data);
      
      if (response.data && response.data.token) {
        setTokenInLocalStorage(response.data.token);
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Token refresh error:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error refreshing token' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    refreshToken,
    loading,
    isAdmin,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;