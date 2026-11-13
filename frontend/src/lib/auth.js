'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if accessToken exists or user is cached in localStorage for quick client render
    const stored = localStorage.getItem('skillority_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('skillority_user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, accessToken) => {
    setUser(userData);
    localStorage.setItem('skillority_user', JSON.stringify(userData));
    localStorage.setItem('skillority_token', accessToken);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('skillority_user');
    localStorage.removeItem('skillority_token');
    fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
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
