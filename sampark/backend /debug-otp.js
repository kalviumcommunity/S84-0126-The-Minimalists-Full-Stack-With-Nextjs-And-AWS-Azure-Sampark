#!/usr/bin/env node

/**
 * OTP Debug Tool
 * 
 * This script helps diagnose OTP verification issues by:
 * 1. Checking Redis connection
 * 2. Viewing stored OTPs
 * 3. Manually testing OTP storage/retrieval
 * 
 * Usage: node debug-otp.js <email>
 */

import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const email = process.argv[2];

if (!email) {
  console.log('Usage: node debug-otp.js <email>');
  process.exit(1);
}

async function debugOTP() {
  console.log('🔍 OTP Debug Tool');
  console.log('================\n');
  console.log('Email:', email);
  console.log('Redis URL:', process.env.UPSTASH_REDIS_REST_URL ? 'Set ✅' : 'Not set ❌');
  console.log('Redis Token:', process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set ✅' : 'Not set ❌');
  console.log('');

  try {
    // Test Redis connection
    console.log('Testing Redis connection...');
    await redis.ping();
    console.log('✅ Redis connection successful\n');

    // Check OTP
    const otpKey = `otp:${email.toLowerCase()}`;
    console.log(`Checking OTP key: ${otpKey}`);
    const otp = await redis.get(otpKey);
    console.log('Stored OTP:', otp || 'Not found ❌');
    
    if (otp) {
      const ttl = await redis.ttl(otpKey);
      console.log(`TTL: ${ttl} seconds (${Math.floor(ttl / 60)} minutes)\n`);
    }

    // Check pending user
    const pendingKey = `pending:user:${email.toLowerCase()}`;
    console.log(`Checking pending user key: ${pendingKey}`);
    const pendingUser = await redis.get(pendingKey);
    
    if (pendingUser) {
      console.log('✅ Pending user data found');
      const ttl = await redis.ttl(pendingKey);
      console.log(`TTL: ${ttl} seconds (${Math.floor(ttl / 60)} minutes)`);
      
      try {
        const userData = JSON.parse(pendingUser);
        console.log('User data:', { 
          name: userData.name, 
          email: userData.email,
          hasPassword: !!userData.password 
        });
      } catch (e) {
        console.log('User data:', pendingUser);
      }
    } else {
      console.log('❌ No pending user data found');
    }
    console.log('');

    // Check rate limit
    const rateLimitKey = `otp:ratelimit:${email.toLowerCase()}`;
    console.log(`Checking rate limit key: ${rateLimitKey}`);
    const attempts = await redis.get(rateLimitKey);
    console.log('Attempts used:', attempts || '0/3');
    
    if (attempts) {
      const ttl = await redis.ttl(rateLimitKey);
      console.log(`Resets in: ${Math.floor(ttl / 60)} minutes\n`);
    }

    // List all keys for this email
    console.log('\n📋 All keys for this email:');
    const allKeys = await redis.keys(`*${email.toLowerCase()}*`);
    console.log(allKeys.length > 0 ? allKeys : 'No keys found');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugOTP();
