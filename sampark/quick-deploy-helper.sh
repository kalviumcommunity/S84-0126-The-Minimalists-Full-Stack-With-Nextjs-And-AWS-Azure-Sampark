#!/bin/bash

echo "🚀 Quick Backend Deployment Helper"
echo "===================================="
echo ""
echo "Current Issue: Backend is not responding"
echo "Your frontend: https://sampark-in.vercel.app/"
echo ""

# Check if user has already deployed backend
echo "Do you already have a backend deployed on Render.com? (yes/no)"
read -p "> " has_backend

if [[ $has_backend == "yes" || $has_backend == "y" ]]; then
    echo ""
    read -p "Enter your Render backend URL (e.g., https://sampark-backend.onrender.com): " backend_url
    
    # Remove trailing slash if present
    backend_url=${backend_url%/}
    
    echo ""
    echo "🔍 Testing your backend..."
    
    # Test health endpoint
    response=$(curl -s -o /dev/null -w "%{http_code}" "$backend_url/health" 2>/dev/null)
    
    if [[ $response == "200" ]]; then
        echo "✅ Backend is responding! (HTTP 200)"
        echo ""
        echo "📋 NEXT STEPS:"
        echo "============="
        echo ""
        echo "1. Go to: https://vercel.com/dashboard"
        echo "2. Click on 'sampark-in' project"
        echo "3. Go to: Settings → Environment Variables"
        echo "4. Add or update:"
        echo ""
        echo "   Variable: VITE_API_URL"
        echo "   Value: $backend_url"
        echo ""
        echo "5. Go to: Deployments tab"
        echo "6. Click latest deployment → '...' → Redeploy"
        echo "7. Wait 1-2 minutes"
        echo "8. Test: https://sampark-in.vercel.app/login"
        echo ""
        echo "✅ Should work after redeployment!"
        
    elif [[ $response == "000" ]]; then
        echo "❌ Cannot reach backend (Connection failed)"
        echo ""
        echo "Possible issues:"
        echo "- URL is wrong"
        echo "- Backend is not deployed yet"
        echo "- Render service is sleeping (free tier)"
        echo ""
        echo "Try visiting: $backend_url/health"
        echo "in your browser and wait 30-60 seconds"
        
    else
        echo "⚠️  Backend returned HTTP $response"
        echo ""
        echo "Try visiting: $backend_url"
        echo "Check Render dashboard for errors"
    fi
    
else
    echo ""
    echo "❌ BACKEND NOT DEPLOYED"
    echo "======================="
    echo ""
    echo "You need to deploy your backend first!"
    echo ""
    echo "🚀 Quick Deploy to Render.com (FREE)"
    echo "===================================="
    echo ""
    echo "1. Open in browser: https://render.com/"
    echo ""
    echo "2. Sign in with GitHub"
    echo ""
    echo "3. Click: New + → Web Service"
    echo ""
    echo "4. Select repository: keshavyadav533/sampark.in"
    echo ""
    echo "5. Fill in:"
    echo "   Name: sampark-backend"
    echo "   Root Directory: backend"
    echo "   Environment: Node"
    echo "   Build Command: npm install && npx prisma generate"
    echo "   Start Command: npm start"
    echo ""
    echo "6. Click 'Advanced' and add these environment variables:"
    echo ""
    echo "   Copy from: DEPLOY-BACKEND-SEPARATELY.md"
    echo "   (Lines 40-77)"
    echo ""
    echo "7. Click 'Create Web Service'"
    echo ""
    echo "8. Wait 3-5 minutes for deployment"
    echo ""
    echo "9. Copy the URL (looks like: https://sampark-backend-xxxx.onrender.com)"
    echo ""
    echo "10. Run this script again and enter that URL!"
    echo ""
    echo "📖 Full guide: See DEPLOY-BACKEND-SEPARATELY.md"
    echo ""
fi

echo ""
echo "🆘 Need help? Ask me:"
echo "- 'Show me the environment variables'"
echo "- 'How do I check if backend is deployed?'"
echo "- 'Help with Vercel configuration'"
