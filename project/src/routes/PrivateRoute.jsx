import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // optional loading state

  if (!user) {
    return <Navigate to="/login" />; // redirect if not logged in
  }

  return children;
};

export default PrivateRoute;
