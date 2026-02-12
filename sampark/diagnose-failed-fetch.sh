#!/bin/bash

echo "🔍 Diagnosing 'Failed to Fetch' Error"
echo "========================================"
echo ""

# Check 1: Is frontend deployed?
echo "✅ Frontend Deployed: https://sampark-in.vercel.app/"
echo ""

# Check 2: Check backend
echo "🔍 Checking if you have a backend deployed..."
echo ""
read -p "Do you have a Render.com backend URL? (yes/no): " has_backend
echo ""

if [[ $has_backend == "yes" || $has_backend == "y" ]]; then
    read -p "Enter your backend URL (e.g., https://sampark-backend.onrender.com): " backend_url
    echo ""
    echo "Testing backend at: $backend_url"
    
    health_response=$(curl -s -o /dev/null -w "%{http_code}" "$backend_url/health" 2>/dev/null)
    
    if [[ $health_response == "200" ]]; then
        echo "✅ Backend is running!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Go to: https://vercel.com/dashboard"
        echo "2. Click on 'sampark-in' project"
        echo "3. Go to Settings → Environment Variables"
        echo "4. Add: VITE_API_URL = $backend_url"
        echo "5. Go to Deployments → Click '...' → Redeploy"
        echo ""
    else
        echo "❌ Backend not responding (HTTP $health_response)"
        echo ""
        echo "Possible issues:"
        echo "- Backend is still deploying (wait 2-3 minutes)"
        echo "- Backend crashed (check Render logs)"
        echo "- Wrong URL"
    fi
else
    echo "❌ Backend Not Deployed Yet!"
    echo ""
    echo "📋 REQUIRED: Deploy Backend First"
    echo "================================="
    echo ""
    echo "Option 1: Quick Deploy to Render.com"
    echo "------------------------------------"
    echo "1. Visit: https://render.com/"
    echo "2. Sign in with GitHub"
    echo "3. New + → Web Service"
    echo "4. Connect: keshavyadav533/sampark.in"
    echo "5. Configure:"
    echo "   - Name: sampark-backend"
    echo "   - Root Directory: backend"
    echo "   - Build: npm install"
    echo "   - Start: npm start"
    echo "6. Add all environment variables from PRODUCTION-SETUP.md"
    echo "7. Deploy!"
    echo ""
    echo "Option 2: Test Locally First"
    echo "----------------------------"
    echo "Open 2 terminals:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd /Users/Lenovo/Desktop/sampark/sampark.in/backend"
    echo "  npm run dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd /Users/Lenovo/Desktop/sampark/sampark.in"
    echo "  npm run dev"
    echo ""
    echo "Visit: http://localhost:8080/login"
    echo ""
fi

echo ""
echo "📖 Full guide: See PRODUCTION-SETUP.md"
echo ""
