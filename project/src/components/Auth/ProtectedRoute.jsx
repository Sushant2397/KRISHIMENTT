import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login page with the return url
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role (case-insensitive)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toLowerCase();
    const allowedRolesLower = allowedRoles.map(role => 
      typeof role === 'string' ? role.toLowerCase() : ''
    ).filter(Boolean);
    
    if (!userRole || !allowedRolesLower.includes(userRole)) {
      // Redirect to the appropriate dashboard based on user role
      const defaultRoute = userRole === 'farmer' ? '/farmer-dashboard' : '/labour-dashboard';
      return <Navigate to={defaultRoute} replace />;
    }
  }

  // User is authenticated and has the required role
  return children;
};

export default ProtectedRoute;