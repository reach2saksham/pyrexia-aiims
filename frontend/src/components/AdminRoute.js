import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ element: Element, ...rest }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            Loading...
        </div>
    );
  }

  // Redirect if not authenticated or if the user is not an admin
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" />;
  }

  return <Element {...rest} />;
};

export default AdminRoute;