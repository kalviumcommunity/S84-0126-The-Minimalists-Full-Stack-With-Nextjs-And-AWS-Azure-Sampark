/**
 * Email Templates for Sampark Platform
 * All templates are in plain text format
 */

const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const APP_NAME = 'Sampark';

/**
 * OTP Verification Email Template
 * Sent when a user signs up to verify their email
 */
export const getOTPEmailTemplate = (userName: string, otp: string): { subject: string; text: string } => {
  const subject = `Your ${APP_NAME} Verification Code: ${otp}`;
  
  const text = `Hi ${userName},

Thank you for signing up with ${APP_NAME}!

Your verification code is: ${otp}

This code will expire in 10 minutes.

Please enter this code on the verification page to complete your registration.

If you didn't request this code, please ignore this email.

Security Tips:
- Never share your verification code with anyone
- ${APP_NAME} will never ask for your code via phone or email

Best regards,
The ${APP_NAME} Team

---
This is an automated email. Please do not reply to this message.
`;

  return { subject, text };
};

/**
 * Welcome Email Template
 * Sent when a new user signs up
 */
export const getWelcomeEmailTemplate = (userName: string): { subject: string; text: string } => {
  const subject = `Welcome to ${APP_NAME}! 🎉`;
  
  const text = `Hi ${userName},

Welcome to ${APP_NAME} - Your Voice Matters!

Thank you for joining our community grievance platform. We're excited to have you on board!

With ${APP_NAME}, you can:
- Submit and track grievances in your community
- Get real-time updates on your complaint status
- Help make your community a better place
- Track your grievances with unique tracking IDs

Getting Started:
1. Log in to your account at ${APP_URL}
2. Submit your first grievance by clicking "File a Grievance"
3. Track your grievances from your dashboard
4. Receive email updates when status changes

Need Help?
If you have any questions or need assistance, feel free to reach out to us.

Together, we can make a difference!

Best regards,
The ${APP_NAME} Team

---
This is an automated email. Please do not reply to this message.
`;

  return { subject, text };
};

/**
 * Grievance Confirmation Email Template
 * Sent when a user submits a new grievance
 */
export const getGrievanceConfirmationTemplate = (
  userName: string,
  grievanceDetails: {
    trackingId: string;
    title: string;
    category: string;
    location: string;
    description: string;
    priority: string;
    submittedAt: Date;
  }
): { subject: string; text: string } => {
  const subject = `Grievance Submitted Successfully - ${grievanceDetails.trackingId}`;
  
  const formattedDate = grievanceDetails.submittedAt.toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const text = `Hi ${userName},

Your grievance has been successfully registered in our system.

GRIEVANCE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tracking ID:    ${grievanceDetails.trackingId}
Title:          ${grievanceDetails.title}
Category:       ${grievanceDetails.category}
Location:       ${grievanceDetails.location}
Priority:       ${grievanceDetails.priority}
Status:         SUBMITTED
Submitted On:   ${formattedDate}

Description:
${grievanceDetails.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What happens next?
1. Our team will review your grievance
2. You'll receive email updates as the status changes
3. Track your grievance anytime at: ${APP_URL}/dashboard

Important: Save your Tracking ID (${grievanceDetails.trackingId}) for future reference.

You can view and track your grievance status at any time by logging into your account.

Thank you for helping us improve our community!

Best regards,
The ${APP_NAME} Team

---
This is an automated email. Please do not reply to this message.
`;

  return { subject, text };
};

/**
 * Status Update Email Template
 * Sent when admin updates the status of a grievance
 */
export const getStatusUpdateTemplate = (
  userName: string,
  grievanceDetails: {
    trackingId: string;
    title: string;
    oldStatus?: string;
    newStatus: string;
    comment?: string;
    updatedAt: Date;
  }
): { subject: string; text: string } => {
  const subject = `Grievance Status Updated - ${grievanceDetails.trackingId}`;
  
  const formattedDate = grievanceDetails.updatedAt.toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const statusMessages: Record<string, string> = {
    SUBMITTED: 'Your grievance has been submitted and is awaiting review.',
    UNDER_REVIEW: 'Your grievance is currently under review by our team.',
    IN_PROGRESS: 'Work has begun to address your grievance.',
    RESOLVED: 'Your grievance has been resolved! Thank you for your patience.',
    REJECTED: 'Your grievance has been reviewed and we are unable to proceed with it.',
  };

  const statusMessage = statusMessages[grievanceDetails.newStatus] || 'Status has been updated.';

  const text = `Hi ${userName},

The status of your grievance has been updated.

GRIEVANCE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tracking ID:    ${grievanceDetails.trackingId}
Title:          ${grievanceDetails.title}
${grievanceDetails.oldStatus ? `Previous Status: ${grievanceDetails.oldStatus}\n` : ''}New Status:     ${grievanceDetails.newStatus}
Updated On:     ${formattedDate}

${statusMessage}

${grievanceDetails.comment ? `ADMIN COMMENT:\n${grievanceDetails.comment}\n\n` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You can view the complete status history and details by logging into your account:
${APP_URL}/dashboard

${grievanceDetails.newStatus === 'RESOLVED' ? `We hope this resolves your concern. If you have any feedback or additional issues, please don't hesitate to submit a new grievance.\n\n` : ''}Thank you for using ${APP_NAME}!

Best regards,
The ${APP_NAME} Team

---
This is an automated email. Please do not reply to this message.
`;

  return { subject, text };
};

/**
 * Test Email Template
 * Used for testing email configuration
 */
export const getTestEmailTemplate = (): { subject: string; text: string } => {
  const subject = `${APP_NAME} - Email Configuration Test`;
  
  const text = `This is a test email from ${APP_NAME}.

If you're receiving this email, your email configuration is working correctly!

Test Details:
- Service: Gmail (Nodemailer)
- Time: ${new Date().toLocaleString('en-IN')}
- Status: ✅ Success

Best regards,
The ${APP_NAME} Team
`;

  return { subject, text };
};
