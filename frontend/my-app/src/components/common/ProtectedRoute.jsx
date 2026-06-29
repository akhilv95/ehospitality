import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const redirectPath = user.role === 'patient' ? '/patient' : 
                         user.role === 'doctor' ? '/doctor' : '/admin';
    return <Navigate to={redirectPath} replace />;
    console.log("User:", user);
console.log("Role:", user?.role);
console.log("Allowed Roles:", allowedRoles);
  }

  return children;
};

export default ProtectedRoute;
