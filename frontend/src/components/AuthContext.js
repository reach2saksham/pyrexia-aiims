import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL } from '../BaseUrl';

// Configure axios globally for Safari compatibility
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      // Add explicit headers for Safari
      const response = await axios.get(`${BASE_URL}/login/success`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        }
      });
      
      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.log('Auth check failed:', error.response?.status);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Delay initial auth check slightly for Safari
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);

    return () => clearTimeout(timer);
  }, [checkAuthStatus]);

  // Handle OAuth redirect completion
  useEffect(() => {
    const handleAuthRedirect = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('auth') === 'success') {
        // Force re-check auth status after OAuth redirect
        setTimeout(() => {
          checkAuthStatus();
        }, 1000);
      }
    };

    handleAuthRedirect();
  }, [checkAuthStatus]);

  const logout = async () => {
    try {
      await axios.get(`${BASE_URL}/logout`, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    checkAuthStatus,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};