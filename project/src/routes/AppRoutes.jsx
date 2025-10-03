// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/Auth/ProtectedRoute";
import MainLayout from "../components/Layout/MainLayout";

// Pages
import LandingPage from "../pages/LandingPage";
import RoleSelection from "../components/Auth/RoleSelection";
import FarmerDashboard from "../pages/FarmerDashboard";
import LabourDashboard from "../pages/LabourDashboard";
import GovernmentSchemes from "../components/Common/GovernmentSchemes.tsx";
import TodoPage from "../pages/TodoPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Constants
import { USER_ROLES } from "../utils/constants";

// Layout wrapper for authenticated routes
const AuthenticatedLayout = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          user && user.role ? (
            <Navigate
              to={user.role === USER_ROLES.FARMER ? "/dashboard" : "/dashboard"}
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
              to={user.role === USER_ROLES.FARMER ? "/dashboard" : "/dashboard"}
              replace
            />
          ) : (
            <Register />
          )
        } 
      />
      {/* Keep the /register route for backward compatibility */}
      <Route path="/register" element={<Navigate to="/signup" replace />} />
      
      {/* Role selection is part of the registration flow */}
      <Route 
        path="/select-role" 
        element={
          user ? (
            user.role ? (
              <Navigate
                to={
                  user.role === USER_ROLES.FARMER 
                    ? "/farmer-dashboard" 
                    : "/labour-dashboard"
                }
                replace
              />
            ) : (
              <RoleSelection />
            )
          ) : (
            <Navigate to="/login" state={{ from: "/select-role" }} replace />
          )
        } 
      />

      {/* Authenticated Routes with Layout */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/dashboard" element={user?.role === USER_ROLES.FARMER ? <FarmerDashboard /> : <LabourDashboard />} />
        <Route path="/schemes" element={<GovernmentSchemes />} />
        <Route path="/todo" element={<TodoPage />} />
        
        {/* Role-specific routes */}
        <Route path="/farmer-dashboard" element={
          <ProtectedRoute requiredRole={USER_ROLES.FARMER}>
            <FarmerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/labour-dashboard" element={
          <ProtectedRoute requiredRole={USER_ROLES.LABOUR}>
            <LabourDashboard />
          </ProtectedRoute>
        } />
      </Route>

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
