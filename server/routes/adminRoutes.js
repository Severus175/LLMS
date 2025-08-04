import express from 'express';
import { 
    getEducatorRequests, 
    approveEducatorRequest, 
    rejectEducatorRequest, 
    getAllEducators,
    getAdminDashboard 
} from '../controllers/adminController.js';
import { protectAdmin } from '../middlewares/authMiddleware.js';

const adminRouter = express.Router();

// Get admin dashboard data
adminRouter.get('/dashboard', protectAdmin, getAdminDashboard);

// Get all educator requests
adminRouter.get('/educator-requests', protectAdmin, getEducatorRequests);

// Approve educator request
adminRouter.post('/approve-educator', protectAdmin, approveEducatorRequest);

// Reject educator request
adminRouter.post('/reject-educator', protectAdmin, rejectEducatorRequest);

// Get all educators
adminRouter.get('/educators', protectAdmin, getAllEducators);

export default adminRouter;