import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdminRoute?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isAdminRoute = false }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdminRoute && !isAdmin) {
    // If it's an admin route and the user is not an admin,
    // redirect to a "not authorized" page or the home page.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;