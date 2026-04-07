import React, { createContext, useState, useCallback } from 'react';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current user
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setToken(null);
      setUser(null);
    }
  }, []);

  // Initialize auth on component mount
  React.useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Check if token is expired
      try {
        const decoded = jwtDecode(storedToken);
        const expiry = decoded.exp * 1000; // Convert to milliseconds
        const now = Date.now();

        if (expiry < now) {
          // Token expired, logout
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setToken(null);
          setUser(null);
          window.location.href = '/login';
          return;
        }

        // Set up auto logout timer
        const timeUntilExpiry = expiry - now;
        const logoutTimer = setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setToken(null);
          setUser(null);
          alert('Session expired. Please login again 🔐');
          window.location.href = '/login';
        }, timeUntilExpiry);

        // Set token and fetch user
        setToken(storedToken);
        fetchCurrentUser();

        // Cleanup timer on unmount
        return () => clearTimeout(logoutTimer);

      } catch (error) {
        // Invalid token, logout
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setUser(null);
        window.location.href = '/login';
        return;
      }
    }
  }, [fetchCurrentUser]);

  // Register
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', userData);
      const { token: authToken, user } = response.data;
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('role', user.role);
      setToken(authToken);
      setUser(user);

      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login - Combined approval + OTP flow
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      // Check response type
      if (response.data.requiresApproval) {
        return {
          success: false,
          requiresApproval: true,
          message: response.data.message
        };
      }

      if (response.data.requiresOTP) {
        return {
          success: false,
          requiresOTP: true,
          message: response.data.message
        };
      }

      // Normal login successful
      const { token: authToken, user: userData } = response.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('role', userData.role);
      setToken(authToken);
      setUser(userData);

      return { success: true, data: response.data, user: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Login with OTP
  const loginWithOTP = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login-otp', {
        email,
        password
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify OTP login
  const verifyOTPLogin = useCallback(async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/verify-login-otp', {
        email,
        otp
      });
      const { token: authToken, user: userData } = response.data;
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('role', userData.role);
      setToken(authToken);
      setUser(userData);

      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Send OTP for first login
  const sendOTP = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/send-otp', { email });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify OTP for first login
  const verifyOTP = useCallback(async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      const { token: authToken, user: userData } = response.data;
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('role', userData.role);
      setToken(authToken);
      setUser(userData);

      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Resend OTP
  const resendOTP = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const updateEcoPoints = useCallback((points) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      return {
        ...prevUser,
        ecoPoints: (prevUser.ecoPoints || 0) + points,
      };
    });
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    loginWithOTP,
    verifyOTPLogin,
    sendOTP,
    verifyOTP,
    resendOTP,
    register,
    logout,
    updateEcoPoints,
    isAuthenticated: !!token && !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
