// src/components/PrivateRoute.jsx
// Protects routes - redirects to login if user is not logged in
// Also checks role (ADMIN or STUDENT) to prevent unauthorized access

import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" />;

  // Wrong role → go to their own dashboard
  if (role && user.role !== role) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/student"} />;
  }

  return children;
}

export default PrivateRoute;
