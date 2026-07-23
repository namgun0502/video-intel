import React, { useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, Film } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  currentTimeSeconds: number;
  onTimeUpdate?: (seconds: number) => void;
  thumbnailUrl?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  currentTimeSeconds,
  thumbnailUrl,
}) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  // Helper to check if URL is YouTube
  const getYouTubeEmbedUrl = (url: string, startSeconds: number) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
    }

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${
        startSeconds > 0 ? 1 : 0
      }&start=${Math.floor(startSeconds)}`;
    }
    return null;
  };

  const ytEmbedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl, currentTimeSeconds) : null;

  // Sync HTML5 media element time if not YouTube
  useEffect(() => {
    if (!ytEmbedUrl && mediaRef.current && currentTimeSeconds >= 0) {
      mediaRef.current.currentTime = currentTimeSeconds;
      mediaRef.current.play().catch(() => {
        // Handle autoplay policy block gracefully
      });
    }
  }, [currentTimeSeconds, ytEmbedUrl]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 truncate">
          <Film className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate">{title}</span>
        </h3>
        {currentTimeSeconds > 0 && (
          <span className="text-xs font-mono px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30 font-semibold">
            재생 위치: {Math.floor(currentTimeSeconds / 60)}분 {Math.floor(currentTimeSeconds % 60)}초
          </span>
        )}
      </div>

      <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner group">
        {ytEmbedUrl ? (
          <iframe
            src={ytEmbedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : videoUrl && (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm')) ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
            poster={thumbnailUrl}
          />
        ) : (
          /* Placeholder representation when audio-only or URL embedded representation */
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 flex flex-col items-center justify-center p-6 text-center">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
              />
            ) : null}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-600/30">
                <Film className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h4 className="text-base font-bold text-slate-100">{title}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  타임스탬프 목차 또는 Q&A의 시간 표시[MM:SS]를 클릭하면 해당 구간으로 연동 이동합니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
