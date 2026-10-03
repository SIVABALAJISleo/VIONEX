'use client';

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, PictureInPicture, Gauge, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'quality' | 'speed'>('main');
  const hlsRef = useRef<Hls | null>(null);

  const effectiveSrc = !src || src.startsWith('/hls/') ? DEFAULT_DEMO_STREAM : src;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

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

  const togglePiP = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    } else {
      video.requestPictureInPicture().catch(() => {});
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
              onClick={() => {
                setShowSettings(!showSettings);
                setSettingsView('main');
              }}
              className="p-1 hover:text-indigo-400 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 bottom-10 w-48 bg-[#14161d]/95 backdrop-blur-md border border-[#2e3444] rounded-xl py-2 shadow-2xl z-20 transition-all">
                {settingsView === 'main' && (
                  <div className="flex flex-col">
                    <button
                      onClick={() => setSettingsView('quality')}
                      className="w-full px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-[#1f232e] hover:text-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span>Quality</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>{currentQuality === -1 ? 'Auto' : `${qualities.find(q => q.id === currentQuality)?.height}p`}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                    <button
                      onClick={() => setSettingsView('speed')}
                      className="w-full px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-[#1f232e] hover:text-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        <span>Speed</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>{playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                  </div>
                )}

                {settingsView === 'quality' && (
                  <div className="flex flex-col">
                    <button
                      onClick={() => setSettingsView('main')}
                      className="w-full px-3 py-2 text-sm font-bold text-slate-200 border-b border-[#2e3444] mb-1 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Quality
                    </button>
                    <div className="max-h-48 overflow-y-auto px-1">
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
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold mt-0.5 ${
                            currentQuality === q.id ? 'bg-indigo-600 text-white' : 'hover:bg-[#1f232e] text-slate-300'
                          }`}
                        >
                          {q.height}p ({Math.round(q.bitrate / 1000)}k)
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {settingsView === 'speed' && (
                  <div className="flex flex-col">
                    <button
                      onClick={() => setSettingsView('main')}
                      className="w-full px-3 py-2 text-sm font-bold text-slate-200 border-b border-[#2e3444] mb-1 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Playback Speed
                    </button>
                    <div className="max-h-48 overflow-y-auto px-1">
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            setShowSettings(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold mt-0.5 ${
                            playbackSpeed === speed ? 'bg-indigo-600 text-white' : 'hover:bg-[#1f232e] text-slate-300'
                          }`}
                        >
                          {speed === 1 ? 'Normal' : `${speed}x`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button onClick={togglePiP} className="p-1 hover:text-indigo-400 transition-colors" aria-label="Picture in Picture">
              <PictureInPicture className="w-5 h-5" />
            </button>
            <button onClick={toggleFullscreen} className="p-1 hover:text-indigo-400 transition-colors" aria-label="Fullscreen">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
