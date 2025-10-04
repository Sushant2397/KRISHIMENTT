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

  const API_BASE_URL = 'http://localhost:8000';

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
            console.warn('Invalid user role in stored user:', parsedUser?.role);
            localStorage.removeItem("user");
            localStorage.removeItem("tokens");
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
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
      const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Login failed:', data);
        localStorage.removeItem("user");
        localStorage.removeItem("tokens");
        setUser(null);
        setTokens(null);
        return { error: data.error || 'Login failed. Please check your credentials.' };
      }
      
      if (!data.user) {
        console.error('Invalid login response:', data);
        return { error: 'Invalid server response. Please try again.' };
      }
      
      const tokens = {
        access: data.access,
        refresh: data.refresh
      };
      
      if (!data.user.role || !Object.values(USER_ROLES).includes(data.user.role)) {
        console.error('Invalid or missing user role in login response:', data.user.role);
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
      console.error('Login error:', error);
      return { error: 'An error occurred during login. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error('Registration failed:', data);
        return { 
          error: data.error || 'Registration failed. Please try again.',
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
      console.error('Registration error:', error);
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