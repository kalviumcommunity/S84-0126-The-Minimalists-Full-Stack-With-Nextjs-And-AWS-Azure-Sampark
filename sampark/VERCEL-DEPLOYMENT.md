# Vercel Deployment Guide for Sampark

## Current Issue
The login and signup pages are not working on https://samparkin.vercel.app because the backend API is not accessible.

## Architecture Options

### Option 1: Separate Backend Deployment (Recommended)
Deploy the backend separately and configure the frontend to use that URL.

#### Steps:

1. **Deploy Backend Separately** (e.g., on Render, Railway, or another Vercel project)
   - Deploy the backend code to a hosting service
   - Get the backend URL (e.g., `https://sampark-backend.onrender.com`)

2. **Configure Frontend in Vercel Dashboard**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com`
   - Redeploy the frontend

3. **Update Backend CORS**
   - Add your Vercel URL to allowed origins (already done in server.ts)

### Option 2: Monorepo with Vercel Serverless Functions
Convert your backend to Vercel serverless functions.

## Current Configuration Status

### ✅ Files Created/Updated:
1. **vercel.json** - Vercel configuration with routing rules
2. **.env.production** - Production environment template
3. **.env.example** - Environment variables reference
4. **backend/server.ts** - Updated CORS to allow Vercel domain

### ⚠️ Required Actions:

#### 1. Set Environment Variables in Vercel Dashboard

Go to: https://vercel.com/your-username/samparkin/settings/environment-variables

Add these variables:

**Frontend Variables:**
```
VITE_API_URL=https://your-backend-url.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

**Backend Variables (if deploying backend on Vercel):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
REDIS_URL=redis://...
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
NODE_ENV=production
FRONTEND_URL=https://samparkin.vercel.app
```

#### 2. Deploy Backend

**Option A: Deploy on Render.com (Free tier available)**
1. Go to https://render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && node dist/server.js`
6. Add all backend environment variables
7. Deploy and copy the URL

**Option B: Deploy on Railway.app**
1. Go to https://railway.app
2. Create new project from GitHub
3. Set root directory to `/backend`
4. Add environment variables
5. Deploy and copy the URL

**Option C: Deploy on another Vercel project**
1. Create a new Vercel project for backend
2. Set root directory to `backend`
3. Add environment variables
4. Deploy

#### 3. Update Frontend Configuration

After deploying backend, update Vercel environment variables:
```bash
VITE_API_URL=https://your-backend-url.com
```

Then redeploy frontend in Vercel dashboard.

#### 4. Test the Deployment

1. Visit https://samparkin.vercel.app
2. Try to signup - should send OTP
3. Check browser console for errors
4. Check Vercel deployment logs
5. Check backend logs

## Troubleshooting

### Issue: 404 on /api/* requests
**Solution:** Make sure VITE_API_URL is set in Vercel environment variables

### Issue: CORS errors
**Solution:** 
- Backend must include your Vercel URL in CORS allowed origins
- Already done in server.ts: `'https://samparkin.vercel.app'`

### Issue: 500 Server Error
**Solution:** Check:
- Database connection in backend
- All required environment variables are set
- Backend deployment logs

### Issue: signup/login doesn't respond
**Solution:** 
- Check browser Network tab for the API request
- Verify the request is going to the correct backend URL
- Check backend health: `https://your-backend-url.com/health`

## Quick Fix for Testing

If you want to quickly test without deploying backend:

1. **Keep backend running locally**
2. **Use ngrok to expose local backend:**
   ```bash
   ngrok http 3000
   ```
3. **Get the ngrok URL** (e.g., `https://abc123.ngrok.io`)
4. **Set in Vercel:**
   ```
   VITE_API_URL=https://abc123.ngrok.io
   ```
5. **Update backend CORS** to allow ngrok URL
6. **Redeploy frontend**

## Verification Checklist

- [ ] Backend deployed and accessible
- [ ] Backend health check works: `https://backend-url/health`
- [ ] VITE_API_URL set in Vercel dashboard
- [ ] All other environment variables set (DATABASE_URL, JWT_SECRET, etc.)
- [ ] Frontend redeployed after setting variables
- [ ] CORS allows your Vercel domain
- [ ] Signup page loads without console errors
- [ ] Signup request reaches backend
- [ ] OTP email is sent

## Current Status

✅ Frontend code is correct
✅ Backend CORS is configured
✅ Vercel routing is configured
⚠️ Backend needs to be deployed separately
⚠️ VITE_API_URL needs to be set in Vercel dashboard

## Next Steps

1. Deploy backend using one of the options above
2. Set VITE_API_URL in Vercel dashboard
3. Redeploy frontend
4. Test login/signup functionality
