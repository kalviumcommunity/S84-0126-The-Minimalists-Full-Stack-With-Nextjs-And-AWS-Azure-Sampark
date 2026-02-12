# ⚠️ FIXING "Failed to Fetch" Error

## The Problem

Your frontend is deployed at: **https://sampark-in.vercel.app/**

But when you try to login/signup, you get: **"Failed to fetch"**

## Why?

Your frontend is trying to call backend APIs, but:
- ❌ Backend is NOT connected
- ❌ Frontend doesn't know WHERE the backend is

## The Solution (Choose One)

---

### 🚀 OPTION A: Deploy to Production (Recommended)

#### Step 1: Deploy Backend on Render.com (5 minutes)

1. Go to: https://render.com/
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select repository: **keshavyadav533/sampark.in**
5. Fill in:
   ```
   Name: sampark-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
6. Click **"Advanced"** → Add these environment variables:

```bash
DATABASE_URL=postgresql://neondb_owner:npg_b1WjYzRPk9NJ@ep-sparkling-king-a10a77pf.ap-southeast-1.aws.neon.tech:5432/sampark?sslmode=require
JWT_SECRET=super-secret-change-in-production-xyz123
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://sampark-in.vercel.app
REDIS_URL=redis://default:AVU3AAIncDJiNzc3ZTdjNTg0NjI0ZTY2ODQ3ODVmNDczMDljZThmY3AyMjE4MTU@humane-stinkbug-21815.upstash.io:6379
EMAIL_USER=keshav.yadav.s84@kalvium.community
EMAIL_PASSWORD=trjhjumcilohkkcb
EMAIL_ENABLED=true
GEMINI_API_KEY=AIzaSyBt7FMxr6Unu1WnIyoubjPDKtEB3gnR12s
CLOUDINARY_CLOUD_NAME=dzcpkzjst
CLOUDINARY_API_KEY=861272746418416
CLOUDINARY_API_SECRET=5j8sTVdJuXlwk-6Q4kVRnBB2kzA
```

7. Click **"Create Web Service"**
8. **Wait 2-3 minutes** for deployment
9. **Copy your backend URL** (example: `https://sampark-backend.onrender.com`)

#### Step 2: Connect Frontend to Backend

1. Go to: https://vercel.com/dashboard
2. Click on **sampark-in** project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add:
   ```
   Name: VITE_API_URL
   Value: [PASTE YOUR RENDER BACKEND URL HERE]
   ```
   Example: `https://sampark-backend.onrender.com`
6. Click **Save**

#### Step 3: Redeploy Frontend

1. Go to **Deployments** tab
2. Find latest deployment
3. Click **"..."** (three dots) → **"Redeploy"**
4. ✅ Wait 1-2 minutes

#### Step 4: Test!

1. Visit: https://sampark-in.vercel.app/login
2. Try to signup/login
3. Should work! 🎉

---

### 💻 OPTION B: Test Locally First (10 minutes)

If you want to make sure everything works before deploying to production:

#### Terminal 1 - Start Backend
```bash
cd /Users/Lenovo/Desktop/sampark/sampark.in/backend
npm run dev
```

Wait for: `✅ Server successfully started on http://0.0.0.0:3000`

#### Terminal 2 - Start Frontend
```bash
cd /Users/Lenovo/Desktop/sampark/sampark.in
npm run dev
```

Wait for: `Local: http://localhost:8080`

#### Test
1. Open browser: http://localhost:8080/login
2. Try signup/login
3. Should work locally! ✅

#### Then Deploy to Production
Once it works locally, follow **OPTION A** above to deploy.

---

## 🔍 Quick Diagnostic

Run this to check your setup:
```bash
cd /Users/Lenovo/Desktop/sampark/sampark.in
./diagnose-failed-fetch.sh
```

---

## ❓ Which Option Should I Choose?

### Choose OPTION A (Production) if:
- ✅ You want the live site to work NOW
- ✅ You're confident in your code
- ✅ You have 10 minutes to set up Render

### Choose OPTION B (Local Testing) if:
- ✅ You want to test first
- ✅ You're not sure if everything works
- ✅ You want to make changes and test quickly

**My Recommendation**: Do OPTION B first (test locally), THEN do OPTION A (deploy to production)

---

## 🆘 Still Getting "Failed to Fetch"?

### If testing locally:
1. Check backend terminal shows: "Server successfully started"
2. Test backend: `curl http://localhost:3000/health`
3. Check frontend `.env` has: `VITE_API_URL=http://localhost:3000`
4. Restart frontend after changing `.env`

### If testing production:
1. Check Render backend is deployed (green status)
2. Test backend: `curl https://your-backend.onrender.com/health`
3. Check Vercel env variable is set: `VITE_API_URL`
4. Make sure you **redeployed** frontend after adding env variable
5. Wait 2-3 minutes for deployments to complete
6. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📸 Screenshots Needed?

If you need visual help:
- Go to: PRODUCTION-SETUP.md
- Or ask me: "Show me how to deploy on Render"
- Or ask me: "Show me how to add Vercel environment variable"
