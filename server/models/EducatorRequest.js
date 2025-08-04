import mongoose from "mongoose";

const educatorRequestSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    approvedBy: {
        type: String,
        ref: 'User'
    },
    approvedDate: {
        type: Date
    },
    rejectionReason: {
        type: String
    }
}, { timestamps: true });

const EducatorRequest = mongoose.model('EducatorRequest', educatorRequestSchema);

export default EducatorRequest;