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
      {/* Video Background - Optimized */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover blur-sm"
        style={{ backgroundColor: fallbackColor }}
        onLoadedData={(e) => {
          // Reduce quality for better performance
          if (e.currentTarget.readyState >= 2) {
            e.currentTarget.playbackRate = 0.5; // Slower = fewer frames
          }
        }}
        onError={(e) => {
          console.error('Video failed to load:', e);
          e.currentTarget.style.display = 'none';
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better text readability - balanced for visibility */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      
      {/* Gradient overlay for smooth fade at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent via-50% to-white/90 dark:to-gray-900/90" />
    </div>
  );
};

export default VideoBackground;
