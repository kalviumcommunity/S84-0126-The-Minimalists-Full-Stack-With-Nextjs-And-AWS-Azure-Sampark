# 🚀 START BACKEND LOCALLY - Simple Guide

## Current Issue: "Failed to fetch" on localhost

This happens because your backend server is not running.

---

## ✅ SOLUTION - Start Backend in 2 Steps:

### Step 1: Open a New Terminal Window

1. Open a **NEW terminal window** (don't use VS Code terminal for now)
2. Navigate to backend folder:
   ```bash
   cd /Users/Lenovo/Desktop/sampark/sampark.in/backend
   ```

### Step 2: Start Backend Server

Run this command:
```bash
npm run dev
```

**You should see:**
```
✅ Server successfully started on http://0.0.0.0:3000
Environment: development
Ready to accept connections
```

**Keep this terminal window open!** Don't close it.

---

## ✅ THEN - Start Frontend

### In Another Terminal Window:

1. Open **ANOTHER new terminal window**
2. Navigate to project root:
   ```bash
   cd /Users/Lenovo/Desktop/sampark/sampark.in
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```

**You should see:**
```
VITE v... ready in ... ms

➜  Local:   http://localhost:8080
```

---

## ✅ TEST

1. Open browser: http://localhost:8080/login
2. Try to login or signup
3. Should work now! ✅

---

## 🔍 Verify Backend is Running

In another terminal, run:
```bash
curl http://localhost:3000/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"..."}
```

If you get this, backend is working!

---

## 📋 Summary

You need **2 terminal windows running simultaneously:**

**Terminal 1 - Backend:**
```bash
cd /Users/Lenovo/Desktop/sampark/sampark.in/backend
npm run dev
```
Leave this running ✅

**Terminal 2 - Frontend:**
```bash
cd /Users/Lenovo/Desktop/sampark/sampark.in
npm run dev
```
Leave this running ✅

**Terminal 3 - For testing (optional):**
```bash
curl http://localhost:3000/health
```

---

## ⚠️ Common Mistakes

1. **Closing the backend terminal** → Backend stops → "Failed to fetch" error
2. **Not waiting for backend to start** → Try after you see "Ready to accept connections"
3. **Wrong directory** → Make sure you're in `/backend` folder

---

## 🎯 Quick Test Commands

### Check if backend is running:
```bash
curl http://localhost:3000/health
```

### Check if frontend .env is correct:
```bash
cat /Users/Lenovo/Desktop/sampark/sampark.in/.env | grep VITE_API_URL
```
Should show: `VITE_API_URL=http://localhost:3000`

### Kill backend if stuck:
```bash
killall node
# Then start again
cd /Users/Lenovo/Desktop/sampark/sampark.in/backend
npm run dev
```

---

## 🎉 Success Indicators

✅ Backend terminal shows: "Ready to accept connections"
✅ Frontend terminal shows: "Local: http://localhost:8080"
✅ `curl http://localhost:3000/health` returns JSON
✅ Login page works without errors

---

## 🆘 Still Getting "Failed to fetch"?

1. **Check backend is actually running:**
   ```bash
   curl http://localhost:3000/health
   ```
   If this fails, backend is not running properly.

2. **Check frontend .env:**
   ```bash
   cat .env
   ```
   Should have: `VITE_API_URL=http://localhost:3000`

3. **Check browser console (F12):**
   - What URL is it trying to call?
   - Should be: `http://localhost:3000/api/auth/login`

4. **Restart both servers:**
   - Close both terminals (Ctrl+C)
   - Start backend first
   - Then start frontend

---

## 📌 Remember for Production

This is for **LOCAL TESTING ONLY**.

For production (https://samparkin.vercel.app), you still need to:
1. Make sure backend is deployed on Render ✅ (you did this)
2. Set VITE_API_URL in Vercel dashboard ← DO THIS
3. Redeploy frontend on Vercel ← DO THIS

---

**Start here:** Open 2 terminal windows and run the commands above! 🚀
