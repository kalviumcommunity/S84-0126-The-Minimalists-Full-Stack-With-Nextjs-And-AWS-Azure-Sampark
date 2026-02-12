# 🚀 Production Deployment Setup

## Current Status
- ✅ Frontend deployed: https://sampark-in.vercel.app/
- ❌ Backend: Not connected yet
- ❌ Error: "Failed to fetch"

## Why "Failed to Fetch"?

Your Vercel frontend is trying to call API endpoints, but:
1. Backend is either not deployed OR
2. Frontend doesn't know the backend URL OR
3. CORS is not configured properly

---

## 🎯 SOLUTION: Complete Setup in 3 Steps

### STEP 1: Deploy Backend on Render.com

1. **Go to Render.com**: https://render.com/
2. **Sign in** with GitHub
3. Click **"New +"** → **"Web Service"**
4. **Connect your repository**: `keshavyadav533/sampark.in`
5. **Configure the service**:
   ```
   Name: sampark-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

6. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable"):
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_b1WjYzRPk9NJ@ep-sparkling-king-a10a77pf.ap-southeast-1.aws.neon.tech:5432/sampark?sslmode=require
   JWT_SECRET=your-super-secret-key-change-this-in-production
   PORT=3000
   NODE_ENV=production
   FRONTEND_URL=https://sampark-in.vercel.app
   REDIS_URL=redis://default:AVU3AAIncDJiNzc3ZTdjNTg0NjI0ZTY2ODQ3ODVmNDczMDljZThmY3AyMjE4MTU@humane-stinkbug-21815.upstash.io:6379
   UPSTASH_REDIS_REST_URL=https://humane-stinkbug-21815.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AVU3AAIncDJiNzc3ZTdjNTg0NjI0ZTY2ODQ3ODVmNDczMDljZThmY3AyMjE4MTU
   GEMINI_API_KEY=AIzaSyBt7FMxr6Unu1WnIyoubjPDKtEB3gnR12s
   EMAIL_USER=keshav.yadav.s84@kalvium.community
   EMAIL_PASSWORD=trjhjumcilohkkcb
   EMAIL_FROM=Sampark Team
   EMAIL_ENABLED=true
   APP_URL=https://sampark-in.vercel.app
   CLOUDINARY_CLOUD_NAME=dzcpkzjst
   CLOUDINARY_API_KEY=861272746418416
   CLOUDINARY_API_SECRET=5j8sTVdJuXlwk-6Q4kVRnBB2kzA
   ADMIN_EMAIL=admin@sampark.com
   ADMIN_PASSWORD=admin123
   ADMIN_NAME=Admin User
   ```

7. Click **"Create Web Service"**

8. **Wait 2-3 minutes** for deployment

9. **Copy your backend URL** (e.g., `https://sampark-backend.onrender.com`)

---

### STEP 2: Configure Vercel Frontend

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your **sampark-in** project
3. Go to **Settings** → **Environment Variables**
4. **Add this variable**:
   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.onrender.com
   ```
   ⚠️ Replace with YOUR actual Render backend URL!

5. Click **Save**

---

### STEP 3: Redeploy Frontend

1. Still in Vercel dashboard
2. Go to **Deployments** tab
3. Find the latest deployment
4. Click **"..."** (three dots) → **"Redeploy"**
5. Wait 1-2 minutes

---

## ✅ Verification

After both deployments complete:

1. **Test Backend**:
   ```bash
   curl https://your-backend.onrender.com/health
   ```
   Should return: `{"status":"healthy"}`

2. **Test Frontend**:
   - Visit: https://sampark-in.vercel.app/login
   - Open browser console (F12)
   - Try to login/signup
   - Should see API calls to: `https://your-backend.onrender.com/api/...`

---

## 🔧 If Still Getting "Failed to Fetch"

### Check 1: Backend is Running
```bash
curl https://your-backend.onrender.com/health
```

### Check 2: CORS is Configured
Your backend already has `https://sampark-in.vercel.app` in allowed origins ✅

### Check 3: Environment Variable is Set
- Go to Vercel → Settings → Environment Variables
- Verify `VITE_API_URL` exists

### Check 4: Frontend was Redeployed
- After adding env variable, you MUST redeploy
- Old deployments won't have the new variable

---

## 📝 What I Already Updated

✅ Added `https://sampark-in.vercel.app` to CORS allowed origins
✅ Updated backend `.env` with production URLs
✅ Updated `FRONTEND_URL` in backend configuration

---

## ⚡ Quick Alternative: Test Locally First

If you want to test everything works BEFORE deploying to production:

```bash
# Terminal 1 - Start Backend
cd /Users/Lenovo/Desktop/sampark/sampark.in/backend
npm run dev

# Terminal 2 - Start Frontend  
cd /Users/Lenovo/Desktop/sampark/sampark.in
npm run dev

# Visit: http://localhost:8080/login
```

This way you can verify the code works locally, THEN deploy to production with confidence!

---

## 🆘 Need Help?

**Question**: Do you have a Render backend URL already?
- **YES** → Give me the URL and I'll configure Vercel for you
- **NO** → Follow STEP 1 above to deploy backend first

**Still stuck?** 
- Check browser console (F12) for the exact error
- Share the error message with me
