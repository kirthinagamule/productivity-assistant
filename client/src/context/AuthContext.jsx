import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { socketService } from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and verify authentication state on mount
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data?.user) {
        setUser(res.data.user);
        socketService.connect();
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Authentication session invalid:', err.message);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Log in user
   */
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, tokens } = res.data;

      localStorage.setItem('token', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }

      setUser(userData);
      socketService.connect();
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Register new user
   */
  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { user: userData, tokens } = res.data;

      localStorage.setItem('token', tokens.accessToken);
      if (tokens.refreshToken) {
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }

      setUser(userData);
      socketService.connect();
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Change password
   */
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    try {
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  /**
   * Log out user
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore server logout errors on client-side teardown
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      socketService.disconnect();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        changePassword,
        logout,
        checkAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
