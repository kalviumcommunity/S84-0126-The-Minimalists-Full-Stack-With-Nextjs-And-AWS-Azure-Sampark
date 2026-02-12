// Quick Email Test Script
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('🔍 Testing Email Configuration...\n');
  
  const emailPass = (process.env.EMAIL_PASS || '').replace(/\s/g, '');
  
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS length:', emailPass.length);
  console.log('EMAIL_PASS (first 4 chars):', emailPass.substring(0, 4) + '...');
  console.log('EMAIL_ENABLED:', process.env.EMAIL_ENABLED);
  console.log('');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: emailPass,
    },
  });

  try {
    console.log('📧 Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified successfully!\n');

    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Sampark Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Sampark',
      text: 'If you receive this, your email configuration is working!',
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\n🎉 EMAIL IS WORKING PERFECTLY!\n');
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error:', error.message);
    console.error('\nFull error:', error);
    console.log('\n💡 Possible fixes:');
    console.log('1. Check if 2-Step Verification is enabled on Gmail');
    console.log('2. Generate a NEW App Password at: https://myaccount.google.com/apppasswords');
    console.log('3. Make sure "Less secure app access" is NOT needed (App Passwords bypass this)');
    console.log('4. Try using the App Password WITHOUT spaces: icmxhuxgfgezkauy');
  }

  process.exit(0);
}

testEmail();
