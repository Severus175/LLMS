import express from 'express';
import { 
    adminLogin,
    getEducatorRequests, 
    approveEducatorRequest, 
    rejectEducatorRequest, 
    getAllEducators,
    getAdminDashboard,
    createDefaultAdmin
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/adminAuth.js';

const adminRouter = express.Router();

// Public routes
adminRouter.post('/login', adminLogin);
adminRouter.post('/create-default', createDefaultAdmin); // For initial setup only

// Protected routes
adminRouter.get('/dashboard', authenticateAdmin, getAdminDashboard);
adminRouter.get('/educator-requests', authenticateAdmin, getEducatorRequests);
adminRouter.post('/approve-educator', authenticateAdmin, approveEducatorRequest);
adminRouter.post('/reject-educator', authenticateAdmin, rejectEducatorRequest);
adminRouter.get('/educators', authenticateAdmin, getAllEducators);

export default adminRouter;