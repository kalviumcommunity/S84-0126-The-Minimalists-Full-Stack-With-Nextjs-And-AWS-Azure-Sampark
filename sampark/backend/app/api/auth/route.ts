import express from 'express';
import prisma from '../../../lib/prisma.js';
import { hashPassword, comparePassword, generateToken, verifyTokenSimple } from '../../../lib/auth.js';
import { sendEmail } from '../../../lib/mailer.js';
import { getWelcomeEmailTemplate, getOTPEmailTemplate } from '../../../lib/email-templates.js';
import { 
  generateOTP, 
  storeOTP, 
  verifyOTP, 
  checkOTPRateLimit, 
  storePendingUser, 
  getPendingUser,
  deletePendingUser,
  peekPendingUser,
  cleanupOTPData 
} from '../../../lib/otp.js';

const router = express.Router();

// Cookie configuration for both development and production
const getCookieConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    ...(isProduction ? {} : { domain: "localhost" }) // domain only in development
  };
};

// Signup - Step 1: Send OTP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check rate limit
    const rateLimit = await checkOTPRateLimit(email);
    if (!rateLimit.allowed) {
      return res.status(429).json({ 
        message: "Too many OTP requests. Please try again later.",
        remainingAttempts: 0
      });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log('\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
    console.log('┃  📧 OTP GENERATED FOR SIGNUP                ┃');
    console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
    console.log('Email:', email);
    console.log('Email (lowercase):', email.toLowerCase());
    console.log('OTP:', otp);
    console.log('OTP Type:', typeof otp);
    console.log('OTP Length:', otp.length);
    console.log('Redis Key Will Be:', `otp:${email.toLowerCase()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Hash password before storing
    const hashedPassword = await hashPassword(password);

    // Store OTP and pending user data
    console.log('💾 Storing OTP in Redis...');
    await storeOTP(email, otp);
    console.log('💾 Storing pending user data in Redis...');
    await storePendingUser(email, { name, email: email.toLowerCase(), password: hashedPassword });

    // Send OTP email
    const emailTemplate = getOTPEmailTemplate(name, otp);
    const emailSent = await sendEmail(email, emailTemplate.subject, emailTemplate.text);

    if (!emailSent) {
      // Clean up if email fails
      await cleanupOTPData(email);
      return res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }

    console.log(`✅ OTP sent to ${email}`);

    return res.status(200).json({ 
      message: "Verification code sent to your email",
      email: email,
      remainingAttempts: rateLimit.remaining
    });
  } catch (err) {
    const error = err as Error;
    console.error('Signup error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Signup - Step 2: Verify OTP and Create Account
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 OTP VERIFICATION REQUEST');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Received Data:', JSON.stringify({ email, otp }, null, 2));
    console.log('Email:', email);
    console.log('Email Type:', typeof email);
    console.log('Email Length:', email?.length);
    console.log('Email Lowercase:', email?.toLowerCase());
    console.log('');
    console.log('OTP:', otp);
    console.log('OTP Type:', typeof otp);
    console.log('OTP Length:', otp?.length);
    console.log('OTP String:', String(otp));
    console.log('OTP Trimmed:', String(otp).trim());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (!email || !otp) {
      console.log('❌ VALIDATION FAILED: Email or OTP missing\n');
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Verify OTP
    console.log('🔐 Calling verifyOTP function...');
    const isValid = await verifyOTP(email, otp);
    console.log('🔐 OTP Verification Result:', isValid ? '✅ VALID' : '❌ INVALID');
    console.log('');
    
    if (!isValid) {
      console.log('❌ VERIFICATION FAILED: Returning 400 error\n');
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Get pending user data
    console.log('👤 Fetching pending user data...');
    const pendingUser = await getPendingUser(email);
    console.log('👤 Pending User Data:', pendingUser ? '✅ Found' : '❌ Not found');
    
    if (!pendingUser) {
      console.log('❌ NO PENDING USER: Returning 400 error\n');
      return res.status(400).json({ message: "Verification session expired. Please sign up again." });
    }

    // Create user account
    console.log('📝 Creating user account in database...');
    let newUser;
    try {
      newUser = await prisma.user.create({ 
        data: { 
          name: pendingUser.name, 
          email: pendingUser.email, 
          password: pendingUser.password 
        } 
      });
      console.log('✅ User account created successfully:', newUser.email);
    } catch (createError) {
      console.error('❌ Failed to create user account:', createError);
      // Don't delete pending user data if account creation fails
      // User can try verification again
      return res.status(500).json({ message: "Failed to create account. Please try again." });
    }

    // ONLY delete pending user data AFTER successful account creation
    await deletePendingUser(email);
    console.log('🗑️  Pending user data cleaned up');

    // Auto-login after verification
    const token = generateToken(newUser.id);
    res.cookie("token", token, getCookieConfig());

    // Send welcome email (non-blocking)
    const emailTemplate = getWelcomeEmailTemplate(newUser.name);
    sendEmail(newUser.email, emailTemplate.subject, emailTemplate.text)
      .then((success) => {
        if (success) {
          console.log(`✅ Welcome email sent to ${newUser.email}`);
        }
      })
      .catch((error) => {
        console.error(`❌ Failed to send welcome email to ${newUser.email}:`, error);
      });

    console.log(`✅ User account created and verified: ${newUser.email}`);

    return res.status(201).json({ 
      message: "Email verified successfully",
      user: { 
        id: newUser.id, 
        name: newUser.name, 
        email: newUser.email, 
        role: newUser.role 
      } 
    });
  } catch (err) {
    const error = err as Error;
    console.error('OTP verification error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check rate limit
    const rateLimit = await checkOTPRateLimit(email);
    if (!rateLimit.allowed) {
      return res.status(429).json({ 
        message: "Too many OTP requests. Please try again after 1 hour.",
        remainingAttempts: 0
      });
    }

    // Get pending user data WITHOUT deleting it
    const pendingUser = await peekPendingUser(email);
    if (!pendingUser) {
      return res.status(400).json({ message: "No pending signup found. Please sign up again." });
    }

    // Generate new OTP
    const otp = generateOTP();
    console.log(`📧 Resent OTP for ${email}: ${otp}`); // Debug log

    // Store new OTP (pending user data stays intact)
    await storeOTP(email, otp);

    // Send OTP email
    const emailTemplate = getOTPEmailTemplate(pendingUser.name, otp);
    const emailSent = await sendEmail(email, emailTemplate.subject, emailTemplate.text);

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }

    console.log(`✅ OTP resent to ${email}`);

    return res.status(200).json({ 
      message: "New verification code sent to your email",
      remainingAttempts: rateLimit.remaining
    });
  } catch (err) {
    const error = err as Error;
    console.error('Resend OTP error:', error);
    return res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields required" });

    // Find user with case-insensitive email
    const user = await prisma.user.findFirst({ 
      where: { 
        email: {
          equals: email,
          mode: 'insensitive'
        }
      } 
    });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);
    res.cookie("token", token, getCookieConfig());

    return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ message: error.message });
  }
});

//logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});

//to verify
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = verifyTokenSimple(token) as { userId: string };
    
    // Fetch user data from database
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true }
    });
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
