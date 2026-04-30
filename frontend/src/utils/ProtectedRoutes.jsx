import React from "react";
import { Navigate, Outlet } from "react-router";

function ProtectedRoutes() {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    return <Navigate to={import.meta.env.VITE_LOGIN_URL} replace />;
  }
  return <Outlet />;
}

export default ProtectedRoutes;
