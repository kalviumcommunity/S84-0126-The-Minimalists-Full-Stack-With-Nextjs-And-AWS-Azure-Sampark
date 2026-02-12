# Troubleshooting Guide: API Connection Errors

## Errors Fixed

### 1. 404 Not Found: `undefined/api/auth/login` and `undefined/api/auth/signup`
**Cause:** Missing `VITE_API_URL` environment variable

**Solution:** 
- Created `.env` file with `VITE_API_URL=http://localhost:3000`
- Created `src/lib/api.ts` utility for consistent API URL handling
- Updated Login and Signup components to use the new utility

### 2. 401 Unauthorized on `/api/auth/me`
**Cause:** Expected behavior when not logged in. The app checks authentication on load.

**Solution:** No action needed - this is normal behavior.

### 3. THREE.WebGLRenderer: Context Lost
**Cause:** WebGL context issue with Three.js (used for 3D animations)

**Solutions:**
- Usually resolves after page refresh
- Check browser GPU acceleration settings
- Reduce 3D complexity if persistent

## Next Steps

1. **Restart the Development Server:**
   ```bash
   # Stop the current dev server (Ctrl+C) and restart
   npm run dev
   ```

2. **Ensure Backend is Running:**
   ```bash
   # In a separate terminal, run:
   cd backend
   npm run dev
   ```

3. **Verify Environment Variables:**
   - Check that `.env` file exists in the project root
   - Verify `VITE_API_URL=http://localhost:3000` is set
   - After changing `.env`, always restart the dev server

## How It Works

### Development Setup
- **Frontend:** Runs on `http://localhost:8080` (Vite)
- **Backend:** Runs on `http://localhost:3000` (Express)
- **API Calls:** Use Vite proxy (`/api` → `http://localhost:3000/api`)

### API URL Configuration
The new `src/lib/api.ts` utility provides:
- `API_URL` - Base API URL from environment
- `buildApiUrl(path)` - Build full API URLs consistently

### Usage Example
```typescript
import { buildApiUrl } from '@/lib/api';

// Instead of:
fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`)

// Use:
fetch(buildApiUrl('/api/auth/login'))
```

## Additional Components to Update

The following files still use the old pattern and should be updated:
- `src/pages/auth/VerifyOTP.tsx`
- `src/pages/admin/*.tsx`
- `src/components/*.tsx`

Would you like me to update all of these files automatically?

## Testing Checklist

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 8080
- [ ] Can access login page without 404 errors
- [ ] Can access signup page without 404 errors
- [ ] Network tab shows requests to `/api/*` (not `undefined/api/*`)
