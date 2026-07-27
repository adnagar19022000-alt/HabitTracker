import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Track if the user was already authenticated when this route mounted
  const wasAuthOnMount = useRef(isAuthenticated);

  useEffect(() => {
    // Only show if they were already authenticated when hitting this route
    if (!isLoading && wasAuthOnMount.current) {
      toast.info("Please logout before going back to the login page", {
        toastId: "logout-warning", // Prevents duplicate toasts!
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
