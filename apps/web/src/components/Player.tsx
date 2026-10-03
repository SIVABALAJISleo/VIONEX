'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

interface PlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

const DEFAULT_DEMO_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export default function Player({ src, poster, autoPlay = true }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [qualities, setQualities] = useState<{ id: number; height: number; bitrate: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = auto
  const [showSettings, setShowSettings] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  const effectiveSrc = !src || src.startsWith('/hls/') ? DEFAULT_DEMO_STREAM : src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported() && effectiveSrc.includes('.m3u8')) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsRef.current = hls;
      hls.loadSource(effectiveSrc);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const levels = data.levels.map((lvl, index) => ({
          id: index,
          height: lvl.height,
          bitrate: lvl.bitrate
        }));
        setQualities(levels);
        if (autoPlay) video.play().catch(() => {});
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = effectiveSrc;
    }
  }, [effectiveSrc, autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    if (Number.isFinite(video.currentTime)) {
      setCurrentTime(video.currentTime);
    }
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setProgress((video.currentTime / video.duration) * 100);
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const rawPos = (e.clientX - rect.left) / rect.width;
    const pos = Math.max(0, Math.min(1, rawPos));
    const targetTime = pos * video.duration;
    if (Number.isFinite(targetTime)) {
      video.currentTime = targetTime;
      setProgress(pos * 100);
      setCurrentTime(targetTime);
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) return '0:00';
    const totalSecs = Math.floor(timeInSeconds);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    const paddedSecs = seconds < 10 ? `0${seconds}` : `${seconds}`;
    if (hours > 0) {
      const paddedMins = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${hours}:${paddedMins}:${paddedSecs}`;
    }
    return `${minutes}:${paddedSecs}`;
  };

  return (
    <div className="relative group w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#232733]">
      <video
        ref={videoRef}
        poster={poster}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      />

      {/* Player Controls Bar */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Progress Bar */}
        <div
          onClick={handleSeek}
          className="w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer relative transition-all"
        >
          <div
            className="h-full bg-indigo-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="p-1 hover:text-indigo-400 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="p-1 hover:text-indigo-400 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <span className="text-xs text-slate-300 font-mono select-none">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:text-indigo-400 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Quality Selector Dropdown */}
            {showSettings && (
              <div className="absolute right-0 bottom-10 w-44 bg-[#14161d] border border-[#2e3444] rounded-xl p-2 shadow-xl z-20">
                <span className="text-xs font-bold text-slate-400 px-2 pb-1 block border-b border-[#2e3444] mb-1">
                  Quality
                </span>
                <button
                  onClick={() => {
                    if (hlsRef.current) hlsRef.current.currentLevel = -1;
                    setCurrentQuality(-1);
                    setShowSettings(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold ${
                    currentQuality === -1 ? 'bg-indigo-600 text-white' : 'hover:bg-[#1f232e] text-slate-300'
                  }`}
                >
                  Auto
                </button>
                {qualities.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      if (hlsRef.current) hlsRef.current.currentLevel = q.id;
                      setCurrentQuality(q.id);
                      setShowSettings(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold ${
                      currentQuality === q.id ? 'bg-indigo-600 text-white' : 'hover:bg-[#1f232e] text-slate-300'
                    }`}
                  >
                    {q.height}p ({Math.round(q.bitrate / 1000)}k)
                  </button>
                ))}
              </div>
            )}

            <button onClick={toggleFullscreen} className="p-1 hover:text-indigo-400 transition-colors" aria-label="Fullscreen">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
