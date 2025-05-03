//src/app/(DashboardLayout)/context/AuthContext.jsx
'use client';
import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('USER');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser.user);
        } catch (error) {
          console.error('USER data parsing error:', error);
          localStorage.removeItem('USER');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const value = {
    user,
    isLoading,
    setUser: (userData) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('USER', JSON.stringify({
          token: 'demo_token',
          user: userData
        }));
      }
      setUser(userData);
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('USER');
      }
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}