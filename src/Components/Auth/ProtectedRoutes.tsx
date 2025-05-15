import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const user_info = JSON.parse(localStorage.getItem("AuthToken") || "null");
  console.log(user_info== null)
  const currentTime = new Date().getTime();

  if (user_info != null ) {
    console.log(user_info.expiry)
    if (currentTime > user_info.expiry) {
      localStorage.removeItem("AuthToken");
      console.log("Session expired. Please log in again.");
      localStorage.setItem("toastMessage", "Session expired. Please log in again.");
    }
    else {
      console.log("Token valid:", user_info.token);
    }
  } 
    const user = JSON.parse(localStorage.getItem("AuthToken") || "null");
    const isAuthenticated = !!user;
    console.log(isAuthenticated)
    const hasRole = user && allowedRoles.includes(user.role);
    console.log(hasRole)
    
    if (!isAuthenticated || !hasRole) {
      if (!localStorage.getItem("toastMessage")) {
        localStorage.setItem("toastMessage", "Unauthorized access. Please log in.");
      }
      return <Navigate to="/login" replace />;
    }

  return <Outlet />;
};

export default ProtectedRoute;
