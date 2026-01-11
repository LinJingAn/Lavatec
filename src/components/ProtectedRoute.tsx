import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  requiredRole?: 'admin' | 'manager' | 'staff' | 'customer';
  children?: React.ReactNode;
};

const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps) => {
  const { user, dbUser, isLoading, hasRole } = useAuth();

  // Show loading spinner while auth state is being checked
  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(0, 0, 0, 0.1)",
          borderLeftColor: "#3182CE",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to unauthorized
  if (requiredRole && dbUser && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children or outlet
  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute; 