'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and synchronize session with backend
  const verifySession = useCallback(async () => {
    try {
      const stored = localStorage.getItem('skillority_user');
      const token = localStorage.getItem('skillority_token');

      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem('skillority_user');
        }
      }

      // If token exists, fetch live user profile to verify validity
      if (token) {
        const res = await api.get('/auth/me');
        if (res.data && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('skillority_user', JSON.stringify(res.data.user));
        } else if (res.error && res.status === 401) {
          setUser(null);
          localStorage.removeItem('skillority_user');
          localStorage.removeItem('skillority_token');
        }
      }
    } catch {
      // Fail safely to cached state or null
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const loginUser = (userData, accessToken) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillority_user', JSON.stringify(userData));
      if (accessToken) {
        localStorage.setItem('skillority_token', accessToken);
      }
    }
  };

  const logoutUser = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Ignore network errors during logout
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('skillority_user');
        localStorage.removeItem('skillority_token');
      }
    }
  };

  const refreshUser = async () => {
    const res = await api.get('/auth/me');
    if (res.data && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('skillority_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
