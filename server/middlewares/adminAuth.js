import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.json({ success: false, message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.json({ success: false, message: 'Access denied. Admin role required.' });
        }

        const admin = await Admin.findById(decoded.adminId);
        
        if (!admin) {
            return res.json({ success: false, message: 'Admin not found.' });
        }

        req.admin = decoded;
        next();
    } catch (error) {
        res.json({ success: false, message: 'Invalid token.' });
    }
};