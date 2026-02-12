#!/bin/bash

# OTP Debug Test Script
# This will help diagnose the OTP verification issue

echo "🔍 OTP Verification Debug Test"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if backend is running
echo -e "${YELLOW}1. Checking if backend is running...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Backend is running on port 3000${NC}"
else
    echo -e "${RED}❌ Backend is NOT running on port 3000${NC}"
    echo -e "${YELLOW}Please start it with: cd backend && npm run dev${NC}"
    exit 1
fi
echo ""

# Get email from user
echo -e "${BLUE}2. Enter the email you're testing with:${NC}"
read -p "Email: " EMAIL
echo ""

# Test signup
echo -e "${YELLOW}3. Testing Signup (will generate new OTP)...${NC}"
echo "Enter name and password for testing:"
read -p "Name: " NAME
read -p "Password: " PASSWORD

SIGNUP_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

HTTP_STATUS=$(echo "$SIGNUP_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$SIGNUP_RESPONSE" | sed -e 's/HTTP_STATUS\:.*//g')

echo "Response Status: $HTTP_STATUS"
echo "Response Body: $BODY"

if [ "$HTTP_STATUS" == "200" ]; then
    echo -e "${GREEN}✅ Signup successful! OTP sent.${NC}"
    echo -e "${YELLOW}Check your backend terminal for the line:${NC}"
    echo -e "${YELLOW}📧 Generated OTP for $EMAIL: XXXXXX${NC}"
    echo ""
else
    echo -e "${RED}❌ Signup failed!${NC}"
    echo "Common reasons:"
    echo "- Email already registered (try a different one)"
    echo "- Rate limited (wait 1 hour or use different email)"
    exit 1
fi

# Get OTP from user
echo -e "${BLUE}4. Enter the OTP you received (from email or backend logs):${NC}"
read -p "OTP: " OTP
echo ""

# Test verification
echo -e "${YELLOW}5. Testing OTP Verification...${NC}"
VERIFY_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"otp\":\"$OTP\"}")

HTTP_STATUS=$(echo "$VERIFY_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$VERIFY_RESPONSE" | sed -e 's/HTTP_STATUS\:.*//g')

echo "Response Status: $HTTP_STATUS"
echo "Response Body: $BODY"
echo ""

if [ "$HTTP_STATUS" == "201" ]; then
    echo -e "${GREEN}✅ OTP Verified successfully! Account created!${NC}"
    echo ""
    echo -e "${BLUE}You can now login with:${NC}"
    echo "Email: $EMAIL"
    echo "Password: $PASSWORD"
elif [ "$HTTP_STATUS" == "400" ]; then
    echo -e "${RED}❌ OTP Verification failed!${NC}"
    echo ""
    echo -e "${YELLOW}Check your backend terminal for these logs:${NC}"
    echo "📥 OTP Verification Request: {...}"
    echo "🔍 OTP Verification Debug: {...}"
    echo "🔍 OTP Comparison: {...}"
    echo ""
    echo -e "${YELLOW}The logs will show:${NC}"
    echo "- storedOTP: what's in Redis"
    echo "- providedOTP: what you entered"
    echo "- match: true or false"
    echo ""
    echo -e "${YELLOW}Common issues:${NC}"
    echo "- OTP expired (>10 min old) → Resend code"
    echo "- Wrong OTP → Check email"
    echo "- Email mismatch → Use exact same email"
else
    echo -e "${RED}❌ Unexpected error (Status: $HTTP_STATUS)${NC}"
fi

echo ""
echo -e "${BLUE}6. Next steps:${NC}"
echo "- Check backend terminal for detailed debug logs"
echo "- If verification failed, try again with fresh OTP"
echo "- Run: node backend/debug-otp.js $EMAIL (to see Redis data)"
