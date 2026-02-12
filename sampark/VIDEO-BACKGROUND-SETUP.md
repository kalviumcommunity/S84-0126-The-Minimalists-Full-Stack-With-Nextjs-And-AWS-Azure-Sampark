# 🎬 Video Background Setup Guide

## ✅ What I Did:

### 1. Created VideoBackground Component
- Location: `src/components/VideoBackground.tsx`
- Features:
  - Autoplay, loop, muted video
  - Dark overlay for text readability
  - Gradient fade at bottom
  - Fallback on error
  - Responsive and optimized

### 2. Updated Index Page (Landing Page)
- Added video background instead of AnimatedBackground
- Video only shows on the first/landing page
- Other sections have normal white/dark backgrounds

### 3. Updated All Auth Pages
Changed from gradient backgrounds to plain solid:
- ✅ Login page
- ✅ Signup page  
- ✅ VerifyOTP page
- **Light mode:** White background
- **Dark mode:** Gray-900 solid background

### 4. Dashboard Already Has Plain Background
- Already using `bg-background` (system default)

---

## 🎥 How to Add Your Video:

### Step 1: Prepare Your Video

**Recommended specs:**
- Format: MP4 (H.264 codec)
- Resolution: 1920x1080 or 1280x720
- Duration: 10-30 seconds (will loop)
- File size: Under 5MB (compress if needed)
- Framerate: 24-30 fps

**Compress if needed:**
```bash
# Using ffmpeg (install if needed: brew install ffmpeg)
ffmpeg -i your-video.mp4 -vcodec h264 -crf 28 -preset slow background-video.mp4
```

### Step 2: Add Video to Public Folder

1. Copy your video file
2. Rename it to: `background-video.mp4`
3. Place it in: `/Users/Lenovo/Desktop/mann sampark/Sampark/public/`

```bash
# Example command:
cp ~/Downloads/my-video.mp4 /Users/Lenovo/Desktop/mann\ sampark/Sampark/public/background-video.mp4
```

### Step 3: Restart Development Server

```bash
# In your frontend terminal
npm run dev
```

---

## 🎨 Customization Options:

### Change Video Overlay Darkness

In `src/components/VideoBackground.tsx`, adjust the overlay:

```tsx
// Current: 40% dark / 60% in dark mode
<div className="absolute inset-0 bg-black/40 dark:bg-black/60" />

// Lighter overlay
<div className="absolute inset-0 bg-black/20 dark:bg-black/40" />

// Darker overlay
<div className="absolute inset-0 bg-black/60 dark:bg-black/80" />
```

### Change Video Playback Speed

In `VideoBackground.tsx`:
```tsx
videoRef.current.playbackRate = 0.75; // Current (slower)
videoRef.current.playbackRate = 1.0;  // Normal speed
videoRef.current.playbackRate = 0.5;  // Even slower
```

### Change Gradient Fade

```tsx
// Current gradient fade to white/dark
<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900" />

// Stronger fade
<div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 dark:to-gray-900/80" />
```

### Use Different Video Source

In `src/pages/Index.tsx`:
```tsx
<VideoBackground videoSrc="/my-custom-video.mp4" />
```

---

## 🎯 Current Background Setup:

| Page | Background |
|------|------------|
| **Index (Landing)** | 🎬 **Video background** |
| Login | ⬜ White / Dark gray solid |
| Signup | ⬜ White / Dark gray solid |
| Verify OTP | ⬜ White / Dark gray solid |
| Dashboard | ⬜ White / Dark gray solid |
| Admin pages | ⬜ White / Dark gray solid |

---

## 🔧 Troubleshooting:

### Video Not Showing?

1. **Check file name and location:**
   ```bash
   ls -la public/background-video.mp4
   ```

2. **Check browser console** (F12) for errors

3. **Try different video format:**
   - MP4 with H.264 codec works best
   - WebM as fallback

4. **Check file size:**
   - Keep under 10MB for good performance
   - Compress if needed

### Video Too Dark/Bright?

Adjust overlay opacity in `VideoBackground.tsx`:
```tsx
<div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
                                        ↑↑              ↑↑
                                    light mode      dark mode
                                    (0-100)         (0-100)
```

### Video Performance Issues?

1. **Reduce resolution:** 1280x720 instead of 1920x1080
2. **Reduce bitrate:** Use lower CRF value (28-32)
3. **Shorten video:** 10-15 seconds is enough (it loops)

---

## 📱 Mobile Optimization:

The video background is already optimized for mobile:
- Uses `playsInline` attribute (no fullscreen on iOS)
- Muted (allows autoplay on mobile)
- Responsive sizing with `object-cover`

---

## 🚀 Next Steps:

1. **Add your video:**
   ```bash
   cp your-video.mp4 public/background-video.mp4
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Visit:** http://localhost:8080

4. **Enjoy your video background!** 🎉

---

## 💡 Tips:

- **Keep video subtle:** Don't distract from content
- **Ensure contrast:** Text should be easily readable
- **Test on mobile:** Check performance and appearance
- **Consider accessibility:** Some users prefer reduced motion
- **File size matters:** Compress for faster loading

---

**Your landing page will now have a beautiful video background while all other pages remain clean and professional!** ✨
