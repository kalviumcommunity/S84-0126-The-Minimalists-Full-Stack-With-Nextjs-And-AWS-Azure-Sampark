#!/bin/bash

# Generate Environment Variables Helper
# This script helps generate secure values for your environment variables

echo "🔐 Sampark Environment Variables Generator"
echo "=========================================="
echo ""

# Generate JWT Secret
echo "1. JWT_SECRET"
echo "   (Used for authentication tokens)"
JWT_SECRET=$(openssl rand -base64 48 | tr -d "=+/" | cut -c1-64)
echo "   Generated value:"
echo "   JWT_SECRET=$JWT_SECRET"
echo ""

# Guide for Email
echo "2. EMAIL Configuration"
echo "   (For sending OTP emails)"
echo "   Steps to get EMAIL_PASSWORD:"
echo "   1. Go to your Google Account: https://myaccount.google.com/"
echo "   2. Security → 2-Step Verification (enable if not enabled)"
echo "   3. Security → App passwords"
echo "   4. Select 'Mail' and 'Other (Custom name)' → Enter 'Sampark'"
echo "   5. Click 'Generate'"
echo "   6. Copy the 16-character password"
echo ""
echo "   EMAIL_USER=your-email@gmail.com"
echo "   EMAIL_PASSWORD=your-16-char-app-password"
echo ""

# Guide for Database
echo "3. DATABASE_URL"
echo "   (PostgreSQL connection string)"
echo "   Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
echo ""
echo "   Free PostgreSQL providers:"
echo "   • Neon.tech: https://neon.tech (recommended)"
echo "   • Supabase: https://supabase.com"
echo "   • Railway: https://railway.app (auto-generates if you add PostgreSQL)"
echo ""
echo "   Example:"
echo "   DATABASE_URL=postgresql://user:pass@host.region.neon.tech:5432/dbname"
echo ""

# Guide for Redis
echo "4. REDIS_URL"
echo "   (Redis connection string for caching)"
echo "   Format: redis://default:PASSWORD@HOST:PORT"
echo ""
echo "   Free Redis providers:"
echo "   • Upstash: https://upstash.com (recommended)"
echo "   • Redis Cloud: https://redis.com/try-free/"
echo ""
echo "   Example:"
echo "   REDIS_URL=redis://default:password@host.upstash.io:6379"
echo ""

# Summary
echo "5. Additional Variables"
echo "   NODE_ENV=production"
echo "   PORT=3000"
echo "   FRONTEND_URL=https://samparkin.vercel.app"
echo ""

# Create .env template
echo "=========================================="
echo "Would you like to create a .env file? (y/n)"
read -r create_env

if [ "$create_env" = "y" ] || [ "$create_env" = "Y" ]; then
    cat > .env << EOF
# Backend Environment Variables
# Generated on $(date)

# Database (Get from Neon.tech, Supabase, or Railway)
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
JWT_SECRET=$JWT_SECRET

# Redis (Get from Upstash or Redis Cloud)
REDIS_URL=redis://default:password@host:6379

# Email (Get from Google App Passwords)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Server Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080

# Frontend Environment Variables
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
EOF
    echo ""
    echo "✅ .env file created!"
    echo "📝 Please edit .env and fill in your actual values"
    echo ""
else
    echo ""
    echo "Copy these values manually to your deployment platform"
fi

echo "=========================================="
echo "📋 Next Steps:"
echo "1. Get DATABASE_URL from a PostgreSQL provider"
echo "2. Get REDIS_URL from Upstash or Redis Cloud"
echo "3. Generate EMAIL_PASSWORD from Google App Passwords"
echo "4. Add all variables to your deployment platform"
echo "5. For Render: Environment tab in your service"
echo "6. For Railway: Variables tab in your project"
echo "7. For Vercel: Settings → Environment Variables"
echo ""
echo "🔗 Quick Links:"
echo "   PostgreSQL: https://neon.tech"
echo "   Redis: https://upstash.com"
echo "   Google App Passwords: https://myaccount.google.com/apppasswords"
echo ""
