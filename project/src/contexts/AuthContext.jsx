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
          
          // Only set user if it has a valid role
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
        // Clear invalid data
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
        // Clear any existing auth data on failed login
        localStorage.removeItem("user");
        localStorage.removeItem("tokens");
        setUser(null);
        setTokens(null);
        return { error: data.detail || 'Login failed. Please check your credentials.' };
      }
      
      if (!data.user || !data.tokens) {
        console.error('Invalid login response:', data);
        return { error: 'Invalid server response. Please try again.' };
      }
      
      // Validate that the user has a valid role
      if (!data.user.role || !Object.values(USER_ROLES).includes(data.user.role)) {
        console.error('Invalid or missing user role in login response:', data.user.role);
        return { 
          error: 'Your account is not properly configured. Please contact support.' 
        };
      }
      
      // Only update state and storage if we have valid data
      setUser(data.user);
      setTokens(data.tokens);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("tokens", JSON.stringify(data.tokens));
      
      return { user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'An error occurred during login. Please try again.' };
    }
  };

  const register = async (userData) => {
    console.log('Starting registration with data:', userData);
    try {
      const url = `${API_BASE_URL}/api/auth/register/`;
      console.log('Making request to:', url);
      
      const options = {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(userData),
      };
      
      console.log('Request options:', JSON.stringify(options, null, 2));
      
      const res = await fetch(url, options);
      console.log('Response status:', res.status);
      
      let data;
      try {
        data = await res.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        return { error: 'Invalid server response' };
      }
      
      if (!res.ok) {
        console.error('Registration failed with status:', res.status);
        console.error('Error details:', data);
        // If the response is not ok, return the error data
        return { 
          error: data.detail || data.message || 'Registration failed',
          status: res.status,
          response: data
        };
      }
      
      console.log('Registration successful, user data:', data.user);
      
      // If we get here, registration was successful
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      if (data.tokens) {
        setTokens(data.tokens);
        localStorage.setItem("tokens", JSON.stringify(data.tokens));
      }
      
      return { 
        success: true, 
        user: data.user,
        tokens: data.tokens
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        error: error.message || 'Network error. Please try again.',
        details: error
      };
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  };

  // The value that will be given to the context
  const value = {
    user,
    tokens,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user, // Helper to check if user is authenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
