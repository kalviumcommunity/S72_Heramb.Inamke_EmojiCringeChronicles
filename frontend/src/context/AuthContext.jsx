import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Set up axios defaults
  const setupAxiosDefaults = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      setupAxiosDefaults(token);
      setUser(user);
      setIsAdmin(user.email === 'admin@gmail.com');
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Special case for admin user
      if (email === 'admin@gmail.com' && password === '12345678') {
        // Create mock admin user and token
        const adminUser = {
          id: 'admin-id',
          username: 'Admin',
          email: 'admin@gmail.com',
          role: 'admin'
        };
        const mockToken = 'admin-mock-token';
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(adminUser));
        setupAxiosDefaults(mockToken);
        setUser(adminUser);
        setIsAdmin(true);
        return { success: true };
      }
      
      // Regular login for non-admin users
      const response = await axios.post('https://emojicringechronicles.onrender.com/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setupAxiosDefaults(token);
      setUser(user);
      setIsAdmin(email === 'admin@gmail.com');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred during login'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('https://emojicringechronicles.onrender.com/api/auth/register', {
        username,
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setupAxiosDefaults(token);
      setUser(user);
      setIsAdmin(email === 'admin@gmail.com');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred during registration'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setupAxiosDefaults(null);
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin
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