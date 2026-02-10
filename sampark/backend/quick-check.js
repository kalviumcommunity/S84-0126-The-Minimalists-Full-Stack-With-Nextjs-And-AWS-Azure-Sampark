/**
 * Quick OTP Diagnosis
 * Run: node quick-check.js <your-email>
 */

import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const email = process.argv[2]?.toLowerCase();

if (!email) {
  console.log('❌ Usage: node quick-check.js your-email@example.com');
  process.exit(1);
}

async function quickCheck() {
  console.log('\n🔍 QUICK OTP CHECK');
  console.log('==================');
  console.log('Email:', email);
  console.log('');

  try {
    // Check Redis connection
    await redis.ping();
    console.log('✅ Redis connected\n');

    // Check OTP
    const otpKey = `otp:${email}`;
    const otp = await redis.get(otpKey);
    
    if (otp) {
      console.log('✅ OTP FOUND IN REDIS!');
      console.log('📧 OTP:', otp);
      console.log('Type:', typeof otp);
      const ttl = await redis.ttl(otpKey);
      console.log('⏱️  Expires in:', Math.floor(ttl / 60), 'minutes', ttl % 60, 'seconds');
      console.log('');
      console.log('👉 USE THIS OTP TO VERIFY:', otp);
    } else {
      console.log('❌ NO OTP FOUND!');
      console.log('Possible reasons:');
      console.log('  1. OTP expired (>10 minutes old)');
      console.log('  2. Never sent (signup failed)');
      console.log('  3. Already used (gets deleted after first attempt)');
      console.log('  4. Wrong email');
      console.log('');
      console.log('💡 Solution: Click "Resend Code" or signup again');
    }
    console.log('');

    // Check pending user
    const pendingKey = `pending:user:${email}`;
    const pending = await redis.get(pendingKey);
    
    if (pending) {
      console.log('✅ Pending user data found');
      const userData = JSON.parse(pending);
      console.log('Name:', userData.name);
    } else {
      console.log('❌ No pending user data');
    }
    console.log('');

    // Check rate limit
    const rateLimitKey = `otp:ratelimit:${email}`;
    const attempts = await redis.get(rateLimitKey);
    
    if (attempts && attempts >= 3) {
      console.log('⚠️  RATE LIMITED! Used', attempts, '/ 3 attempts');
      const ttl = await redis.ttl(rateLimitKey);
      console.log('Reset in:', Math.floor(ttl / 60), 'minutes');
      console.log('💡 Wait or use a different email');
    } else {
      console.log('✅ Not rate limited (', attempts || 0, '/ 3 attempts used)');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickCheck();
