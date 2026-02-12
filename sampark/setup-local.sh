#!/bin/bash

echo "🚀 Sampark Local Test - Verify Before Deploying"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Run this script from the project root directory${NC}"
    echo "   cd /Users/Lenovo/Desktop/sampark/sampark.in"
    exit 1
fi

echo "Step 1: Installing Backend Dependencies..."
echo "==========================================="
cd backend
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "Installing backend packages..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
fi
cd ..

echo ""
echo "Step 2: Checking Environment Variables..."
echo "=========================================="

# Check if .env exists for backend
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Backend .env file exists${NC}"
else
    echo -e "${YELLOW}⚠️  Backend .env file missing${NC}"
    echo "Creating backend/.env with required variables..."
    cat > backend/.env << 'EOF'
# Backend Environment Variables for Local Development
# IMPORTANT: Replace these with your actual values!

DATABASE_URL=postgresql://user:password@localhost:5432/sampark
JWT_SECRET=local-dev-secret-key-replace-me-with-secure-key-in-production
REDIS_URL=redis://localhost:6379
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:8080
EOF
    echo -e "${YELLOW}⚠️  Created backend/.env - PLEASE EDIT WITH YOUR VALUES${NC}"
fi

# Check frontend .env
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Frontend .env file exists${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend .env file missing (already created)${NC}"
fi

echo ""
echo "Step 3: Testing Configuration..."
echo "================================="

# Check if PostgreSQL is accessible
echo "Checking database connection..."
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL client found${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL client not found (optional for testing)${NC}"
fi

# Check if Redis is accessible
echo "Checking Redis connection..."
if command -v redis-cli &> /dev/null; then
    redis-cli ping &> /dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Redis is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Redis not running (start it or use Upstash)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Redis client not found (optional, can use Upstash)${NC}"
fi

echo ""
echo "=========================================="
echo "📋 Next Steps:"
echo "=========================================="
echo ""
echo "🔧 FOR LOCAL TESTING (Optional):"
echo "   1. Edit backend/.env with your actual values"
echo "   2. Terminal 1: cd backend && npm run dev"
echo "   3. Terminal 2: npm run dev"
echo "   4. Visit: http://localhost:8080/login"
echo "   5. Test signup/login locally"
echo ""
echo "🌐 FOR PRODUCTION (Required for Vercel):"
echo "   1. Read: FIX-NOW.md"
echo "   2. Deploy backend on Render.com"
echo "   3. Set VITE_API_URL in Vercel"
echo "   4. Redeploy frontend"
echo ""
echo -e "${RED}⚠️  IMPORTANT:${NC}"
echo "   The error on https://samparkin.vercel.app will ONLY"
echo "   be fixed by deploying the backend to production!"
echo "   Local testing doesn't fix the production site."
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Choose your path:"
echo "  A) Local test first: Read instructions above"
echo "  B) Deploy now: Open FIX-NOW.md"
echo ""
