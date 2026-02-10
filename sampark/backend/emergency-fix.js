/**
 * EMERGENCY OTP FIX
 * This will store a fresh OTP for your email so you can test immediately
 */

import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const email = 'keshavyadav2005562@gmail.com';
const testOTP = '999999'; // Easy to remember

async function emergencyFix() {
  console.log('\n🚨 EMERGENCY OTP FIX');
  console.log('===================\n');

  try {
    await redis.ping();
    console.log('✅ Redis connected\n');

    // Clear any existing data
    await redis.del(`otp:${email}`);
    await redis.del(`pending:user:${email}`);
    await redis.del(`otp:ratelimit:${email}`);
    console.log('🗑️  Cleared old data\n');

    // Store fresh OTP
    await redis.setex(`otp:${email}`, 600, testOTP);
    console.log('✅ Stored fresh OTP!\n');

    // Store pending user data
    const userData = {
      name: 'Keshav Yadav',
      email: email,
      password: '$2b$10$hashedpasswordhere' // Placeholder - you'll need real password
    };
    await redis.setex(`pending:user:${email}`, 600, JSON.stringify(userData));
    console.log('✅ Stored pending user data\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 NOW YOU CAN VERIFY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', email);
    console.log('OTP:', testOTP);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  NOTE: This OTP will expire in 10 minutes\n');
    console.log('Go to your app and enter:');
    console.log('  Email: keshavyadav2005562@gmail.com');
    console.log('  OTP: 999999\n');

    // Verify it's there
    const check = await redis.get(`otp:${email}`);
    console.log('Verification check:', check ? '✅ OTP in Redis' : '❌ Failed');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

emergencyFix();
