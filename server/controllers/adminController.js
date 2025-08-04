import EducatorRequest from '../models/EducatorRequest.js';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { clerkClient } from '@clerk/express';
import jwt from 'jsonwebtoken';

// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ success: false, message: 'Username and password are required' });
        }

        const admin = await Admin.findOne({ username });
        
        if (!admin) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordValid = await admin.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { adminId: admin._id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all educator requests
export const getEducatorRequests = async (req, res) => {
    try {
        const requests = await EducatorRequest.find()
            .populate('userId', 'name email imageUrl')
            .sort({ createdAt: -1 });

        res.json({ success: true, requests });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Approve educator request
export const approveEducatorRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const adminId = req.admin.adminId;

        const request = await EducatorRequest.findById(requestId);
        
        if (!request) {
            return res.json({ success: false, message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.json({ success: false, message: 'Request already processed' });
        }

        // Update user role in Clerk
        await clerkClient.users.updateUserMetadata(request.userId, {
            publicMetadata: {
                role: 'educator',
            },
        });

        // Update request status
        request.status = 'approved';
        request.approvedBy = adminId;
        request.approvedDate = new Date();
        await request.save();

        res.json({ success: true, message: 'Educator request approved successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Reject educator request
export const rejectEducatorRequest = async (req, res) => {
    try {
        const { requestId, reason } = req.body;

        const request = await EducatorRequest.findById(requestId);
        
        if (!request) {
            return res.json({ success: false, message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.json({ success: false, message: 'Request already processed' });
        }

        // Update request status
        request.status = 'rejected';
        request.rejectionReason = reason || 'No reason provided';
        await request.save();

        res.json({ success: true, message: 'Educator request rejected successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all educators
export const getAllEducators = async (req, res) => {
    try {
        // Get all approved educator requests
        const approvedRequests = await EducatorRequest.find({ status: 'approved' })
            .populate('userId', 'name email imageUrl createdAt');

        const educators = approvedRequests.map(request => ({
            ...request.userId.toObject(),
            approvedDate: request.approvedDate
        }));

        res.json({ success: true, educators });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin dashboard data
export const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const pendingRequests = await EducatorRequest.countDocuments({ status: 'pending' });
        const totalEducators = await EducatorRequest.countDocuments({ status: 'approved' });
        
        const recentRequests = await EducatorRequest.find({ status: 'pending' })
            .populate('userId', 'name email imageUrl')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            dashboardData: {
                totalUsers,
                pendingRequests,
                totalEducators,
                recentRequests
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Create default admin (for initial setup)
export const createDefaultAdmin = async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            return res.json({ success: false, message: 'Admin already exists' });
        }

        const admin = new Admin({
            username: 'admin',
            password: 'admin123', // This will be hashed automatically
            email: process.env.ADMIN_EMAIL || 'admin@edemy.com'
        });

        await admin.save();

        res.json({ 
            success: true, 
            message: 'Default admin created successfully',
            credentials: {
                username: 'admin',
                password: 'admin123'
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};