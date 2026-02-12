import { useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  fallbackColor?: string;
}

const VideoBackground = ({ videoSrc, fallbackColor = '#000000' }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slow down video for better effect
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover blur-sm"
        style={{ backgroundColor: fallbackColor }}
        onError={(e) => {
          console.error('Video failed to load:', e);
          // Hide video on error and show fallback
          e.currentTarget.style.display = 'none';
        }}
      >
        <source src={`${videoSrc}?v=${Date.now()}`} type="video/mp4" />
        <source src={`${videoSrc.replace('.mp4', '.webm')}?v=${Date.now()}`} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text readability - balanced for visibility */}
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      
      {/* Gradient overlay for smooth fade at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-50% to-white/90 dark:to-gray-900/90" />
    </div>
  );
};

export default VideoBackground;
