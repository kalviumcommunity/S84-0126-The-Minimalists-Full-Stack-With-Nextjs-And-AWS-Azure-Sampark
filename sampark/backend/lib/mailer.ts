import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Create transporter
let transporter: Transporter | null = null;

/**
 * Get email configuration from environment
 */
const getEmailConfig = () => {
  return {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'Sampark Team',
    enabled: process.env.EMAIL_ENABLED !== 'false',
  };
};

/**
 * Initialize email transporter
 */
export const initializeMailer = () => {
  const config = getEmailConfig();
  
  // Debug logging
  console.log('📧 Email configuration check:');
  console.log('   EMAIL_USER:', config.user ? `${config.user.substring(0, 10)}...` : 'NOT SET');
  console.log('   EMAIL_PASS:', config.pass ? '***HIDDEN***' : 'NOT SET');
  console.log('   EMAIL_FROM:', config.from);
  console.log('   EMAIL_ENABLED:', config.enabled);

  if (!config.user || !config.pass) {
    console.warn('⚠️  Email credentials not configured. Email notifications will be disabled.');
    console.warn('   EMAIL_USER:', config.user ? 'present' : 'MISSING');
    console.warn('   EMAIL_PASS:', config.pass ? 'present' : 'MISSING');
    console.warn('   Set EMAIL_USER and EMAIL_PASS in .env file to enable emails.');
    return;
  }

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    console.log('✅ Email service initialized successfully');
    
    // Verify connection
    transporter.verify((error) => {
      if (error) {
        console.error('❌ Email service verification failed:', error.message);
        transporter = null;
      } else {
        console.log('📧 Email service ready to send emails');
      }
    });
  } catch (error) {
    console.error('❌ Failed to initialize email service:', error);
    transporter = null;
  }
};

/**
 * Send an email
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string
): Promise<boolean> => {
  const config = getEmailConfig();
  
  // Check if emails are enabled
  if (!config.enabled) {
    console.log('📧 Email disabled in config, skipping email to:', to);
    return false;
  }

  // Check if transporter is initialized
  if (!transporter) {
    console.warn('⚠️  Email service not initialized. Skipping email to:', to);
    return false;
  }

  try {
    const mailOptions = {
      from: `"${config.from}" <${config.user}>`,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to:', to);
    console.log('   Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email to:', to);
    console.error('   Error:', error);
    return false;
  }
};

/**
 * Test email configuration
 */
export const testEmailConfig = async (): Promise<boolean> => {
  if (!transporter) {
    console.error('❌ Email transporter not initialized');
    return false;
  }

  try {
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return false;
  }
};
