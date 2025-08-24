import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Spinner from './common/Spinner';

// Usage:
// <AuthRedirect redirectTo="/register" roles={["patient"]}>
//   <UploadPrescriptionPage />
// </AuthRedirect>
export default function AuthRedirect({ children, roles, redirectTo = '/register' }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
