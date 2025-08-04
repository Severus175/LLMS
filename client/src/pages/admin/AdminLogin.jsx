import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import { Navigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, isAuthenticated } = useAdmin();

    // Redirect if already authenticated
    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const result = await login(username, password);
        
        if (result.success) {
            // Navigation will be handled by the route protection
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-100/70 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <img src={assets.logo} alt="Logo" className="w-32 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                    <p className="text-gray-500 mt-2">Sign in to access the admin dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 text-center">
                        <strong>Default Credentials:</strong><br />
                        Username: admin<br />
                        Password: admin123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;