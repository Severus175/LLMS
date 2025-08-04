import nodemailer from 'nodemailer';

const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

export const sendEducatorRequestEmail = async (userDetails) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Educator Request - Edemy Platform',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">New Educator Request</h2>
                    <p>A new user has requested to become an educator on the Edemy platform.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">User Details:</h3>
                        <p><strong>Name:</strong> ${userDetails.name}</p>
                        <p><strong>Email:</strong> ${userDetails.email}</p>
                        <p><strong>User ID:</strong> ${userDetails.userId}</p>
                        <p><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <p>Please log in to the admin panel to review and approve/reject this request.</p>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 14px;">
                            This is an automated email from the Edemy platform. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Educator request email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};