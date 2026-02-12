## 🎯 DEPLOYMENT CHECKLIST

Copy this checklist and mark items as you complete them:

---

### Phase 1: Backend Deployment

#### Choose Backend Host:
- [ ] Option A: Render.com (Free, beginner-friendly)
- [ ] Option B: Railway.app (Fast, $5 free credit)
- [ ] Option C: Other service

#### Setup Backend Database:
- [ ] Create PostgreSQL database (Neon/Supabase/Railway)
- [ ] Copy DATABASE_URL connection string
- [ ] Test connection works

#### Setup Redis:
- [ ] Create Redis database (Upstash recommended)
- [ ] Copy REDIS_URL connection string
- [ ] Test connection works

#### Configure Email:
- [ ] Use Gmail account
- [ ] Enable 2-factor authentication
- [ ] Generate App Password (not regular password!)
- [ ] Copy EMAIL_USER and EMAIL_PASSWORD

#### Deploy Backend:
- [ ] Create new web service
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Set build command: `npm install && npm run build`
- [ ] Set start command: `node dist/server.js`
- [ ] Add all environment variables:
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET (create random 32+ char string)
  - [ ] REDIS_URL
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASSWORD
  - [ ] NODE_ENV=production
  - [ ] FRONTEND_URL=https://samparkin.vercel.app
  - [ ] PORT=3000
- [ ] Start deployment
- [ ] Wait for deployment to complete
- [ ] Copy backend URL
- [ ] Test health endpoint: `https://backend-url/health`
- [ ] Verify returns: `{"status":"ok","timestamp":"..."}`

---

### Phase 2: Frontend Configuration

#### Update Vercel Environment Variables:
- [ ] Go to Vercel dashboard
- [ ] Navigate to project settings
- [ ] Go to Environment Variables section
- [ ] Add VITE_API_URL with backend URL value
- [ ] Add VITE_CLOUDINARY_CLOUD_NAME (if using images)
- [ ] Add VITE_CLOUDINARY_UPLOAD_PRESET (if using images)
- [ ] Save changes

#### Redeploy Frontend:
- [ ] Go to Deployments tab
- [ ] Find latest deployment
- [ ] Click menu (...)
- [ ] Select "Redeploy"
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for errors

---

### Phase 3: Testing

#### Basic Tests:
- [ ] Visit https://samparkin.vercel.app
- [ ] Check browser console (F12) - no errors?
- [ ] Click on "Sign Up"
- [ ] Fill form with test data
- [ ] Submit form
- [ ] Check email for OTP
- [ ] Enter OTP
- [ ] Verify account created
- [ ] Try logging in
- [ ] Verify redirected to dashboard

#### Advanced Tests:
- [ ] Test creating a grievance
- [ ] Test uploading image
- [ ] Test viewing grievances
- [ ] Test logout
- [ ] Test login again
- [ ] Test admin login (if applicable)

#### Performance Tests:
- [ ] Check page load speed
- [ ] Check API response times
- [ ] Test on mobile device
- [ ] Test on different browsers

---

### Phase 4: Verification

#### Backend Verification:
- [ ] Run: `curl https://backend-url/health`
- [ ] Run: `curl https://backend-url/api/auth/me` (should require auth)
- [ ] Check backend logs for errors
- [ ] Verify no memory issues
- [ ] Verify no connection errors

#### Frontend Verification:
- [ ] All pages load correctly
- [ ] No console errors
- [ ] Images load correctly
- [ ] Forms submit correctly
- [ ] Navigation works
- [ ] Responsive on mobile

#### Security Verification:
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] EMAIL_PASSWORD is app-specific password
- [ ] DATABASE_URL has strong password
- [ ] No sensitive data in client-side code
- [ ] HTTPS everywhere

---

### Phase 5: Monitoring

#### Setup Monitoring:
- [ ] Check Vercel Analytics
- [ ] Monitor backend logs regularly
- [ ] Set up error alerts (if available)
- [ ] Monitor database usage
- [ ] Monitor Redis usage

#### Regular Checks:
- [ ] Weekly: Check error logs
- [ ] Weekly: Test signup/login flow
- [ ] Monthly: Review performance
- [ ] Monthly: Update dependencies

---

### Troubleshooting

If something doesn't work:

1. **Check Backend Health:**
   ```bash
   curl https://your-backend-url.com/health
   ```
   Expected: `{"status":"ok","timestamp":"..."}`

2. **Check Vercel Environment Variables:**
   - Verify VITE_API_URL is set
   - Verify it matches your backend URL exactly
   - No trailing slashes

3. **Check Browser Console:**
   - Open F12 Developer Tools
   - Go to Console tab
   - Look for red errors
   - Check Network tab for failed requests

4. **Check Backend Logs:**
   - Go to Render/Railway dashboard
   - Check logs for errors
   - Look for database connection errors
   - Look for Redis connection errors

5. **Check CORS:**
   - Should already be configured
   - Verify backend allows: `https://samparkin.vercel.app`

6. **Common Error Messages:**
   - "Failed to fetch" → Backend not reachable
   - "CORS error" → Backend CORS not configured
   - "500 error" → Backend internal error
   - "404 error" → Wrong API URL
   - "Network error" → Backend offline

---

### Environment Variables Reference

#### Backend (.env):
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Authentication
JWT_SECRET=your-super-secret-key-minimum-32-characters-long

# Cache
REDIS_URL=redis://default:password@host:6379

# Email
EMAIL_USER=yourapp@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Environment
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://samparkin.vercel.app
```

#### Frontend (Vercel):
```bash
# Backend API
VITE_API_URL=https://your-backend-url.com

# Cloudinary (optional)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

### Success Indicators

✅ Backend health check returns 200 OK
✅ Frontend loads without console errors
✅ Signup sends OTP email
✅ OTP verification works
✅ Login redirects to dashboard
✅ API requests show in backend logs
✅ No CORS errors
✅ Images upload successfully
✅ Forms submit without errors

---

### Quick Links

- Backend Dashboard: https://render.com/dashboard (or Railway)
- Frontend Dashboard: https://vercel.com/dashboard
- Production Site: https://samparkin.vercel.app
- Backend Health: https://your-backend-url/health

---

### Time Estimates

- Backend deployment: 10-15 minutes
- Database setup: 5 minutes
- Redis setup: 3 minutes
- Environment variables: 5 minutes
- Frontend redeploy: 2 minutes
- Testing: 10 minutes
- **Total: ~35-40 minutes**

---

### Need Help?

1. Check `QUICK-FIX.md` for step-by-step guide
2. Check `VERCEL-DEPLOYMENT.md` for detailed instructions
3. Check `DEPLOYMENT-SUMMARY.md` for overview
4. Run `./verify-deployment.sh` for automated checks
5. Open `deployment-check.html` in browser for visual test

---

**🎉 Once all checkboxes are checked, your deployment is complete!**
