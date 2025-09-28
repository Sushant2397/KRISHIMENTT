// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

// Pages
import LandingPage from "../pages/LandingPage";
import RoleSelection from "../components/Auth/RoleSelection";
import FarmerDashboard from "../pages/FarmerDashboard";
import LabourDashboard from "../pages/LabourDashboard";
import GovernmentSchemes from "../components/Common/GovernmentSchemes";
import TodoPage from "../pages/TodoPage"; // ✅ Todo page
import Login from "../pages/Login";
import Register from "../pages/Register";

// Constants
import { USER_ROLES } from "../utils/constants";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Landing & Signup */}
      <Route
        path="/"
        element={
          user && user.role ? (
            <Navigate
              to={user.role === USER_ROLES.FARMER ? "/farmer-dashboard" : "/labour-dashboard"}
              replace
            />
          ) : (
            <LandingPage onGetStarted={() => window.location.href = "/signup"} />
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/signup" 
        element={
          user ? (
            <Navigate
              to={user.role === USER_ROLES.FARMER ? "/farmer-dashboard" : "/labour-dashboard"}
              replace
            />
          ) : (
            <Register />
          )
        } 
      />
      {/* Keep the /register route for backward compatibility */}
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      
      {/* Role selection is now part of the registration flow */}
      <Route 
        path="/select-role" 
        element={
          user ? (
            <Navigate
              to={user.role === USER_ROLES.FARMER ? "/farmer-dashboard" : "/labour-dashboard"}
              replace
            />
          ) : (
            <RoleSelection />
          )
        } 
      />

      {/* Protected routes */}
      <Route
        path="/schemes"
        element={
          <ProtectedRoute>
            <GovernmentSchemes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farmer-dashboard"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.FARMER]}>
            <FarmerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/labour-dashboard"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.LABOUR]}>
            <LabourDashboard />
          </ProtectedRoute>
        }
      />

      {/* Todo page (example) */}
      <Route
        path="/todos"
        element={
          <ProtectedRoute>
            <TodoPage />
          </ProtectedRoute>
        }
      />

      {/* 404 fallback */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-xl">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

const AppRoutes = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default AppRoutes;
