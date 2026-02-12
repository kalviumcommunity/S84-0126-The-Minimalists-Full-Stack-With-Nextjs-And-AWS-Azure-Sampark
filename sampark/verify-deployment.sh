#!/bin/bash

# Vercel Deployment Verification Script
# Run this script to verify your deployment configuration

echo "🔍 Sampark Deployment Verification"
echo "=================================="
echo ""

# Check if .env file exists (for local development)
if [ -f ".env" ]; then
    echo "✅ .env file found"
    if grep -q "VITE_API_URL" .env; then
        API_URL=$(grep "VITE_API_URL" .env | cut -d '=' -f2)
        echo "   VITE_API_URL is set to: $API_URL"
    else
        echo "⚠️  VITE_API_URL not found in .env"
    fi
else
    echo "⚠️  No .env file found (needed for local development)"
fi

echo ""

# Check vercel.json
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json exists"
else
    echo "❌ vercel.json NOT found - needed for Vercel deployment"
fi

echo ""

# Check if backend CORS is configured
if grep -q "samparkin.vercel.app" backend/server.ts; then
    echo "✅ Backend CORS includes Vercel URL"
else
    echo "❌ Backend CORS missing Vercel URL"
fi

echo ""

# Check if backend is accessible
echo "Testing backend configuration..."
if [ -n "$BACKEND_URL" ]; then
    echo "Testing health endpoint: $BACKEND_URL/health"
    HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health")
    if [ "$HEALTH_RESPONSE" -eq 200 ]; then
        echo "✅ Backend health check successful"
    else
        echo "❌ Backend health check failed (Status: $HEALTH_RESPONSE)"
    fi
else
    echo "⚠️  BACKEND_URL not set - skipping health check"
    echo "   Set it with: export BACKEND_URL=https://your-backend-url.com"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "========================"
echo ""
echo "Local Development:"
echo "  [ ] Created .env file with VITE_API_URL=http://localhost:3000"
echo "  [ ] Backend running on port 3000"
echo "  [ ] Frontend running on port 8080"
echo ""
echo "Production Deployment:"
echo "  [ ] Backend deployed separately (Render/Railway/etc.)"
echo "  [ ] Backend URL accessible (test with /health endpoint)"
echo "  [ ] Set VITE_API_URL in Vercel dashboard"
echo "  [ ] Set all other env vars (DATABASE_URL, JWT_SECRET, etc.)"
echo "  [ ] Redeployed frontend after setting env vars"
echo "  [ ] Tested signup/login on production"
echo ""
echo "For detailed instructions, see VERCEL-DEPLOYMENT.md"
echo ""
