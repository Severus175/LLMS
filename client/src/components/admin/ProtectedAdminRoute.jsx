import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import Loading from '../student/Loading';

const ProtectedAdminRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAdmin();

    if (loading) {
        return <Loading />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;