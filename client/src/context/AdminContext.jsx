import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Check if admin is already logged in
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            // Verify token by making a request
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (data.success) {
                setIsAuthenticated(true);
                const adminData = JSON.parse(localStorage.getItem('adminData'));
                setAdmin(adminData);
            } else {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminData');
            }
        } catch (error) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
                username,
                password
            });

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminData', JSON.stringify(data.admin));
                setIsAuthenticated(true);
                setAdmin(data.admin);
                toast.success('Login successful');
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            toast.error('Login failed');
            return { success: false, message: 'Login failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setIsAuthenticated(false);
        setAdmin(null);
        toast.success('Logged out successfully');
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const value = {
        isAuthenticated,
        admin,
        loading,
        login,
        logout,
        getAuthHeaders,
        backendUrl
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};