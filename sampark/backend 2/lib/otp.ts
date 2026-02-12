import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Log Redis configuration for debugging
console.log('🔧 Redis Configuration Check:');
console.log('   URL:', process.env.UPSTASH_REDIS_REST_URL ? '✅ Set' : '❌ Missing');
console.log('   Token:', process.env.UPSTASH_REDIS_REST_TOKEN ? '✅ Set' : '❌ Missing');

// Initialize Redis client with loaded env vars
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// OTP Configuration
const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 3;
const OTP_RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds

/**
 * Generate a random 6-digit OTP
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Store OTP in Redis with expiry
 */
export const storeOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const key = `otp:${email.toLowerCase()}`;
    const expirySeconds = OTP_EXPIRY_MINUTES * 60;
    
    console.log('┌─────────────────────────────────────────────────┐');
    console.log('│  💾 STORING OTP IN REDIS                        │');
    console.log('└─────────────────────────────────────────────────┘');
    console.log('Email:', email);
    console.log('Email (normalized):', email.toLowerCase());
    console.log('Key:', key);
    console.log('OTP to store:', otp);
    console.log('OTP Type:', typeof otp);
    console.log('Expiry:', expirySeconds, 'seconds (', OTP_EXPIRY_MINUTES, 'minutes)');
    
    await redis.setex(key, expirySeconds, otp);
    
    // Verify it was stored
    const verification = await redis.get(key);
    console.log('✅ OTP stored successfully!');
    console.log('Verification read:', verification);
    console.log('Match:', verification === otp ? '✅' : '❌');
    console.log('└─────────────────────────────────────────────────┘\n');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to store OTP:', error);
    return false;
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (email: string, providedOTP: string): Promise<boolean> => {
  try {
    const emailKey = email.toLowerCase();
    const key = `otp:${emailKey}`;
    
    console.log('\n┌─────────────────────────────────────────────────┐');
    console.log('│  🔍 REDIS OTP VERIFICATION - DETAILED DEBUG     │');
    console.log('└─────────────────────────────────────────────────┘');
    console.log('📧 Email (original):', email);
    console.log('📧 Email (lowercase):', emailKey);
    console.log('🔑 Redis Key:', key);
    console.log('');
    
    // Get stored OTP from Redis
    const storedOTP = await redis.get(key);
    
    console.log('� STORED OTP (from Redis):');
    console.log('   Value:', storedOTP);
    console.log('   Type:', typeof storedOTP);
    console.log('   Is Null:', storedOTP === null);
    console.log('   Is Undefined:', storedOTP === undefined);
    console.log('   JSON:', JSON.stringify(storedOTP));
    console.log('');
    
    console.log('📬 PROVIDED OTP (from request):');
    console.log('   Value:', providedOTP);
    console.log('   Type:', typeof providedOTP);
    console.log('   Length:', providedOTP?.length);
    console.log('   JSON:', JSON.stringify(providedOTP));
    console.log('');
    
    if (!storedOTP) {
      console.log('❌ RESULT: NO OTP FOUND IN REDIS');
      console.log('   Possible reasons:');
      console.log('   • OTP expired (>10 minutes)');
      console.log('   • OTP already used (deleted)');
      console.log('   • Wrong email address');
      console.log('   • Signup never completed');
      console.log('└─────────────────────────────────────────────────┘\n');
      return false;
    }
    
    // Convert both to strings and trim
    const storedOTPString = String(storedOTP).trim();
    const providedOTPString = String(providedOTP).trim();
    
    console.log('� AFTER STRING CONVERSION & TRIM:');
    console.log('   Stored OTP:  "' + storedOTPString + '"');
    console.log('   Provided OTP: "' + providedOTPString + '"');
    console.log('   Stored Length:', storedOTPString.length);
    console.log('   Provided Length:', providedOTPString.length);
    console.log('');
    
    // Character by character comparison
    console.log('🔤 CHARACTER BY CHARACTER:');
    const maxLen = Math.max(storedOTPString.length, providedOTPString.length);
    for (let i = 0; i < maxLen; i++) {
      const storedChar = storedOTPString[i] || '∅';
      const providedChar = providedOTPString[i] || '∅';
      const match = storedChar === providedChar ? '✓' : '✗';
      console.log(`   [${i}] Stored: "${storedChar}" (${storedChar.charCodeAt(0)}) | Provided: "${providedChar}" (${providedChar.charCodeAt(0)}) ${match}`);
    }
    console.log('');
    
    // Final comparison
    const isMatch = storedOTPString === providedOTPString;
    console.log('⚖️  FINAL COMPARISON:');
    console.log('   Match:', isMatch ? '✅ YES' : '❌ NO');
    console.log('   Strict Equal (===):', storedOTPString === providedOTPString);
    console.log('   Loose Equal (==):', storedOTPString == providedOTPString);
    console.log('');
    
    if (isMatch) {
      // OTP is correct, delete it to prevent reuse
      await redis.del(key);
      console.log('✅ RESULT: OTP VERIFIED SUCCESSFULLY');
      console.log('🗑️  OTP deleted from Redis');
      console.log('└─────────────────────────────────────────────────┘\n');
      return true;
    }
    
    console.log('❌ RESULT: OTP MISMATCH');
    console.log('   Expected: "' + storedOTPString + '"');
    console.log('   Received: "' + providedOTPString + '"');
    console.log('   💡 TIP: Check if you\'re entering the latest OTP from email');
    console.log('└─────────────────────────────────────────────────┘\n');
    return false;
    
  } catch (error) {
    console.error('\n❌ EXCEPTION in verifyOTP:');
    console.error(error);
    console.log('└─────────────────────────────────────────────────┘\n');
    return false;
  }
};

/**
 * Check rate limit for OTP sending
 */
export const checkOTPRateLimit = async (email: string): Promise<{ allowed: boolean; remaining: number }> => {
  try {
    const key = `otp:ratelimit:${email.toLowerCase()}`;
    const count = await redis.get<number>(key) || 0;
    
    if (count >= OTP_MAX_ATTEMPTS) {
      console.log(`❌ Rate limit exceeded for ${email}`);
      return { allowed: false, remaining: 0 };
    }
    
    // Increment counter
    await redis.incr(key);
    
    // Set expiry on first attempt
    if (count === 0) {
      await redis.expire(key, OTP_RATE_LIMIT_WINDOW);
    }
    
    const remaining = OTP_MAX_ATTEMPTS - (count + 1);
    console.log(`✅ Rate limit OK for ${email} (${remaining} attempts remaining)`);
    return { allowed: true, remaining };
  } catch (error) {
    console.error('❌ Failed to check rate limit:', error);
    // Allow on error to not block users
    return { allowed: true, remaining: OTP_MAX_ATTEMPTS };
  }
};

/**
 * Store pending user data temporarily
 */
export const storePendingUser = async (
  email: string,
  userData: { name: string; email: string; password: string }
): Promise<boolean> => {
  try {
    const key = `pending:user:${email.toLowerCase()}`;
    const expirySeconds = OTP_EXPIRY_MINUTES * 60;
    
    console.log('\n┌─────────────────────────────────────────────────┐');
    console.log('│  💾 STORING PENDING USER DATA                   │');
    console.log('└─────────────────────────────────────────────────┘');
    console.log('Email:', email);
    console.log('Key:', key);
    console.log('User Data (raw):', userData);
    console.log('User Data (type):', typeof userData);
    
    const jsonString = JSON.stringify(userData);
    console.log('JSON String:', jsonString);
    console.log('JSON String Length:', jsonString.length);
    
    await redis.setex(key, expirySeconds, jsonString);
    
    // Verify it was stored correctly
    const verification = await redis.get(key);
    console.log('Verification read back:', verification);
    console.log('Verification type:', typeof verification);
    console.log('✅ Pending user data stored for', email);
    console.log('└─────────────────────────────────────────────────┘\n');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to store pending user:', error);
    return false;
  }
};

/**
 * Get pending user data (and delete it to prevent reuse)
 * Only call this when you're ready to create the account!
 */
export const getPendingUser = async (
  email: string
): Promise<{ name: string; email: string; password: string } | null> => {
  try {
    const key = `pending:user:${email.toLowerCase()}`;
    
    console.log('\n┌─────────────────────────────────────────────────┐');
    console.log('│  👤 RETRIEVING PENDING USER DATA                │');
    console.log('└─────────────────────────────────────────────────┘');
    console.log('Email:', email);
    console.log('Key:', key);
    
    const data = await redis.get(key);
    
    console.log('Raw data from Redis:', data);
    console.log('Data type:', typeof data);
    console.log('Data is null:', data === null);
    console.log('Data is undefined:', data === undefined);
    
    if (!data) {
      console.log('❌ No pending user data found for', email);
      console.log('└─────────────────────────────────────────────────┘\n');
      return null;
    }
    
    // Handle different data types from Redis
    let parsedData;
    if (typeof data === 'string') {
      console.log('Parsing as JSON string...');
      parsedData = JSON.parse(data);
    } else if (typeof data === 'object') {
      console.log('Data is already an object, using directly');
      parsedData = data;
    } else {
      console.log('Attempting to parse stringified version...');
      parsedData = JSON.parse(String(data));
    }
    
    console.log('Parsed data:', parsedData);
    console.log('⚠️  NOTE: Pending user data NOT deleted yet (will delete after account creation)');
    console.log('└─────────────────────────────────────────────────┘\n');
    
    return parsedData;
  } catch (error) {
    console.error('❌ Failed to get pending user:', error);
    console.log('└─────────────────────────────────────────────────┘\n');
    return null;
  }
};

/**
 * Delete pending user data after successful account creation
 */
export const deletePendingUser = async (email: string): Promise<void> => {
  try {
    const key = `pending:user:${email.toLowerCase()}`;
    await redis.del(key);
    console.log(`✅ Deleted pending user data for ${email} after successful account creation`);
  } catch (error) {
    console.error('❌ Failed to delete pending user:', error);
  }
};

/**
 * Peek at pending user data without deleting it
 */
export const peekPendingUser = async (
  email: string
): Promise<{ name: string; email: string; password: string } | null> => {
  try {
    const key = `pending:user:${email.toLowerCase()}`;
    const data = await redis.get<string>(key);
    
    if (!data) {
      console.log(`❌ No pending user data found for ${email}`);
      return null;
    }
    
    console.log(`✅ Found pending user data for ${email} (not deleted)`);
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to peek pending user:', error);
    return null;
  }
};

/**
 * Delete OTP and pending user data
 */
export const cleanupOTPData = async (email: string): Promise<void> => {
  try {
    await redis.del(`otp:${email.toLowerCase()}`);
    await redis.del(`pending:user:${email.toLowerCase()}`);
    console.log(`✅ Cleaned up OTP data for ${email}`);
  } catch (error) {
    console.error('❌ Failed to cleanup OTP data:', error);
  }
};
