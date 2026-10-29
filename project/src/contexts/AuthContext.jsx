import React, { createContext, useState, useEffect, useContext } from "react";
import { USER_ROLES } from "../utils/constants";

const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/')
    .replace(/\/$/, '');

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedTokens = localStorage.getItem("tokens");
        
        if (storedUser && storedTokens) {
          const parsedUser = JSON.parse(storedUser);
          const parsedTokens = JSON.parse(storedTokens);
          
          if (parsedUser && parsedUser.role && Object.values(USER_ROLES).includes(parsedUser.role)) {
            setUser(parsedUser);
            setTokens(parsedTokens);
          } else {
            localStorage.removeItem("user");
            localStorage.removeItem("tokens");
          }
        }
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("tokens");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (e) {
          errorData = { error: `Server error: ${res.status} ${res.statusText}` };
        }
        localStorage.removeItem("user");
        localStorage.removeItem("tokens");
        setUser(null);
        setTokens(null);
        return { error: errorData.error || errorData.detail || 'Login failed. Please check your credentials.' };
      }
      
      const data = await res.json();
      
      if (!data.user) {
        return { error: 'Invalid server response. Please try again.' };
      }
      
      const tokens = {
        access: data.access,
        refresh: data.refresh
      };
      
      if (!data.user.role || !Object.values(USER_ROLES).includes(data.user.role)) {
        return { 
          error: 'Your account is not properly configured. Please contact support.' 
        };
      }
      
      setUser(data.user);
      setTokens(tokens);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("tokens", JSON.stringify(tokens));
      
      return { user: data.user };
    } catch (error) {
      
      // Provide more specific error messages
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        return { 
          error: 'Cannot connect to server. Please make sure the backend server is running on http://localhost:8000' 
        };
      }
      
      return { error: error.message || 'An error occurred during login. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        const fieldErrors = Object.entries(data || {})
          .filter(([field]) => !['error', 'detail'].includes(field))
          .flatMap(([field, messages]) =>
            (Array.isArray(messages) ? messages : [messages])
              .filter((message) => typeof message === 'string')
              .map((message) => `${field}: ${message}`)
          );
        return { 
          error: data.error || data.detail || fieldErrors.join(' ') || 'Registration failed. Please try again.',
          details: data
        };
      }
      
      const tokens = {
        access: data.access,
        refresh: data.refresh
      };
      
      setUser(data.user);
      setTokens(tokens);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("tokens", JSON.stringify(tokens));
      
      return { user: data.user };
    } catch (error) {
      return { error: 'An error occurred during registration. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  };

  const value = {
    user,
    tokens,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
