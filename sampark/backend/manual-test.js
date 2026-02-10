/**
 * Manual OTP Test - Store and Verify
 * This bypasses the signup and directly tests Redis OTP storage
 */

import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const email = process.argv[2]?.toLowerCase();
const action = process.argv[3]; // 'store' or 'verify'
const otp = process.argv[4];

if (!email || !action) {
  console.log('Usage:');
  console.log('  Store OTP:  node manual-test.js your@email.com store 123456');
  console.log('  Verify OTP: node manual-test.js your@email.com verify 123456');
  process.exit(1);
}

async function storeOTP() {
  const testOTP = otp || Math.floor(100000 + Math.random() * 900000).toString();
  const key = `otp:${email}`;
  
  console.log('\n📝 STORING OTP');
  console.log('Email:', email);
  console.log('OTP:', testOTP);
  console.log('Key:', key);
  
  await redis.setex(key, 600, testOTP); // 10 minutes
  console.log('✅ Stored successfully!');
  console.log('\n👉 Now try to verify with OTP:', testOTP);
  console.log('   Run: node manual-test.js', email, 'verify', testOTP);
}

async function verifyOTP() {
  if (!otp) {
    console.log('❌ Please provide OTP to verify');
    console.log('   Run: node manual-test.js', email, 'verify 123456');
    process.exit(1);
  }
  
  const key = `otp:${email}`;
  const storedOTP = await redis.get(key);
  
  console.log('\n🔐 VERIFYING OTP');
  console.log('Email:', email);
  console.log('Key:', key);
  console.log('');
  console.log('Stored OTP:', storedOTP);
  console.log('Stored Type:', typeof storedOTP);
  console.log('');
  console.log('Provided OTP:', otp);
  console.log('Provided Type:', typeof otp);
  console.log('');
  
  const storedStr = String(storedOTP || '').trim();
  const providedStr = String(otp).trim();
  
  console.log('After String conversion & trim:');
  console.log('Stored:', `"${storedStr}"`);
  console.log('Provided:', `"${providedStr}"`);
  console.log('Match:', storedStr === providedStr);
  console.log('');
  
  if (storedStr === providedStr) {
    console.log('✅ SUCCESS! OTP matches!');
    await redis.del(key);
    console.log('🗑️  OTP deleted (to prevent reuse)');
  } else {
    console.log('❌ FAIL! OTP does not match!');
    if (!storedOTP) {
      console.log('Reason: No OTP found in Redis (expired or not sent)');
    } else {
      console.log('Reason: OTPs are different');
    }
  }
}

async function run() {
  try {
    await redis.ping();
    console.log('✅ Redis connected\n');
    
    if (action === 'store') {
      await storeOTP();
    } else if (action === 'verify') {
      await verifyOTP();
    } else {
      console.log('❌ Invalid action. Use "store" or "verify"');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

run();
