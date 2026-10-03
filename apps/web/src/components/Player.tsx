'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  PictureInPicture,
  Gauge,
  ChevronLeft,
  ChevronRight,
  Subtitles,
  Activity,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  HelpCircle
} from 'lucide-react';
import { usePlayer } from '@/lib/PlayerContext';

interface Chapter {
  title: string;
  time: number; // in seconds
}

interface PlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  title?: string;
  channelName?: string;
  chapters?: Chapter[];
  onEnded?: () => void;
}

const DEFAULT_DEMO_STREAM = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

const SAMPLE_SUBTITLES = [
  { start: 1, end: 5, text: 'Welcome to VIONEX - Next-Gen Video Architecture' },
  { start: 6, end: 12, text: 'Streaming at ultra-low latency with Adaptive Bitrate (ABR)' },
  { start: 13, end: 20, text: 'Full keyboard navigation enabled: Press [?] to view shortcuts' },
  { start: 21, end: 35, text: 'Supporting WebRTC P2P mesh delivery and dynamic ambient lighting' }
];

export default function Player({
  src,
  poster,
  autoPlay = true,
  title = 'VIONEX High Definition Stream',
  channelName = 'VIONEX Official',
  chapters = [
    { title: 'Introduction', time: 0 },
    { title: 'High-Res Benchmark', time: 60 },
    { title: 'Color Gamut & ABR', time: 180 },
    { title: 'Summary & Telemetry', time: 300 }
  ],
  onEnded
}: PlayerProps) {
  const {
    isPlaying,
    setIsPlaying,
    togglePlay: contextTogglePlay,
    isTheaterMode,
    setIsTheaterMode,
    isAmbientMode,
    setIsAmbientMode,
    playbackSpeed,
    setPlaybackSpeed,
    setIsMiniplayer,
    setShowShortcutsModal
  } = usePlayer();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [qualities, setQualities] = useState<{ id: number; height: number; bitrate: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = auto
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'quality' | 'speed'>('main');
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState('');
  const [isLooping, setIsLooping] = useState(false);
  const [showStatsForNerds, setShowStatsForNerds] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverChapter, setHoverChapter] = useState<string>('');
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const hlsRef = useRef<Hls | null>(null);

  const effectiveSrc = !src || src.startsWith('/hls/') ? DEFAULT_DEMO_STREAM : src;

  // Media Session API Integration
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: channelName,
        album: 'VIONEX Platform',
        artwork: [
          { src: poster || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop', sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        videoRef.current?.play().catch(() => {});
        setIsPlaying(true);
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        videoRef.current?.pause();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler('seekbackward', () => seekRelative(-10));
      navigator.mediaSession.setActionHandler('seekforward', () => seekRelative(10));
    }
  }, [title, channelName, poster, setIsPlaying]);

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // HLS stream setup
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
        if (autoPlay) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = effectiveSrc;
    }
  }, [effectiveSrc, autoPlay, setIsPlaying]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [setIsPlaying]);

  const seekRelative = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const target = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
    video.currentTime = target;
    setCurrentTime(target);
    setProgress((target / video.duration) * 100);
  }, []);

  const seekToPercent = useCallback((fraction: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const target = fraction * video.duration;
    video.currentTime = target;
    setCurrentTime(target);
    setProgress(fraction * 100);
  }, []);

  // Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'j':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'l':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'arrowleft':
          e.preventDefault();
          seekRelative(-5);
          break;
        case 'arrowright':
          e.preventDefault();
          seekRelative(5);
          break;
        case 'm':
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
          }
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 't':
          e.preventDefault();
          setIsTheaterMode(!isTheaterMode);
          break;
        case 'i':
          e.preventDefault();
          setIsMiniplayer(true);
          break;
        case 'c':
          e.preventDefault();
          setCaptionsEnabled((prev) => !prev);
          break;
        case '<':
          e.preventDefault();
          setPlaybackSpeed(Math.max(0.25, playbackSpeed - 0.25));
          break;
        case '>':
          e.preventDefault();
          setPlaybackSpeed(Math.min(2, playbackSpeed + 0.25));
          break;
        case '?':
          e.preventDefault();
          setShowShortcutsModal(true);
          break;
        default:
          if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            seekToPercent(parseInt(e.key, 10) / 10);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative, seekToPercent, isMuted, isTheaterMode, setIsTheaterMode, setIsMiniplayer, playbackSpeed, setPlaybackSpeed, setShowShortcutsModal]);

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
    const cur = video.currentTime;
    if (Number.isFinite(cur)) {
      setCurrentTime(cur);

      // Subtitles lookup
      if (captionsEnabled) {
        const sub = SAMPLE_SUBTITLES.find((s) => cur >= s.start && cur <= s.end);
        setCurrentSubtitle(sub ? sub.text : '');
      } else {
        setCurrentSubtitle('');
      }
    }
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setProgress((cur / video.duration) * 100);
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
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

  const handleMouseMoveProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!Number.isFinite(duration) || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = pos * duration;
    setHoverTime(time);
    setHoverPosition(pos * 100);

    const chapter = [...chapters].reverse().find((c) => time >= c.time);
    setHoverChapter(chapter ? chapter.title : '');
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
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

  const handleCopyUrlWithTime = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}?t=${Math.floor(currentTime)}`;
      navigator.clipboard.writeText(url);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
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
    <div
      ref={containerRef}
      className={`relative group w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#232733] transition-all duration-300 ${
        isTheaterMode ? 'aspect-[21/9]' : 'aspect-video'
      }`}
    >
      {/* Ambient Lighting Backdrop Glow */}
      {isAmbientMode && (
        <div
          className="absolute -inset-4 bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-pink-600/20 blur-2xl -z-10 opacity-70 pointer-events-none transition-opacity duration-700"
          aria-hidden="true"
        />
      )}

      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        loop={isLooping}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      />

      {/* Subtitles Overlay */}
      {captionsEnabled && currentSubtitle && (
        <div className="absolute bottom-16 inset-x-0 flex justify-center pointer-events-none px-6">
          <span className="bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-md text-sm md:text-base font-medium shadow-lg tracking-wide text-center">
            {currentSubtitle}
          </span>
        </div>
      )}

      {/* Stats for Nerds Panel */}
      {showStatsForNerds && (
        <div className="absolute top-4 left-4 z-30 bg-black/85 backdrop-blur-md border border-[#2e3444] rounded-xl p-3 text-[11px] font-mono text-slate-300 shadow-2xl space-y-1 select-none pointer-events-auto">
          <div className="flex items-center justify-between border-b border-[#2e3444] pb-1 font-bold text-white">
            <span>Stats for Nerds (VIONEX ABR)</span>
            <button
              onClick={() => setShowStatsForNerds(false)}
              className="text-slate-400 hover:text-white ml-3"
            >
              ×
            </button>
          </div>
          <div>Video ID: <span className="text-indigo-400">vid-prod-80p</span></div>
          <div>Viewport / Frames: <span>{videoRef.current ? `${videoRef.current.videoWidth}x${videoRef.current.videoHeight}` : '1920x1080'} / 60fps</span></div>
          <div>Current Rendition: <span className="text-green-400">{currentQuality === -1 ? 'Auto (1080p60)' : `${qualities.find(q=>q.id===currentQuality)?.height}p`}</span></div>
          <div>Codec: <span>avc1.640028 / mp4a.40.2</span></div>
          <div>Buffer Health: <span className="text-emerald-400">42.8 s</span></div>
          <div>Dropped Frames: <span>0 / 1442 (0.00%)</span></div>
          <div>Latency to Live: <span>1.84s (Ultra-Low)</span></div>
        </div>
      )}

      {/* Player Controls Bar */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Scrubber Progress Bar with Chapter Markers */}
        <div
          onClick={handleSeek}
          onMouseMove={handleMouseMoveProgress}
          onMouseLeave={() => setHoverTime(null)}
          className="w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full cursor-pointer relative transition-all"
        >
          {/* Chapter Dividers */}
          {duration > 0 &&
            chapters.map((ch, idx) => (
              <div
                key={idx}
                className="absolute top-0 bottom-0 w-0.5 bg-black/60 z-10"
                style={{ left: `${(ch.time / duration) * 100}%` }}
              />
            ))}

          {/* Played Progress */}
          <div
            className="h-full bg-indigo-500 rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
          </div>

          {/* Hover Time & Chapter Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-9 -translate-x-1/2 bg-black/90 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20"
              style={{ left: `${hoverPosition}%` }}
            >
              {hoverChapter && <span className="text-indigo-400 font-bold block">{hoverChapter}</span>}
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between text-white text-sm">
          {/* Left Controls: Play, Volume, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1 hover:text-indigo-400 transition-colors"
              aria-label={isPlaying ? 'Pause (k)' : 'Play (k)'}
              title={isPlaying ? 'Pause (k)' : 'Play (k)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="p-1 hover:text-indigo-400 transition-colors"
              aria-label={isMuted ? 'Unmute (m)' : 'Mute (m)'}
              title={isMuted ? 'Unmute (m)' : 'Mute (m)'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <span className="text-xs text-slate-300 font-mono select-none">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls: CC, Ambient, Speed/Settings, PiP, Theater, Fullscreen */}
          <div className="flex items-center gap-3 relative">
            {/* Captions Toggle */}
            <button
              onClick={() => setCaptionsEnabled(!captionsEnabled)}
              className={`p-1 transition-colors ${
                captionsEnabled ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Closed Captions (c)"
              aria-label="Captions"
            >
              <Subtitles className="w-5 h-5" />
            </button>

            {/* Ambient Lighting Toggle */}
            <button
              onClick={() => setIsAmbientMode(!isAmbientMode)}
              className={`p-1 transition-colors ${
                isAmbientMode ? 'text-purple-400' : 'text-slate-400 hover:text-white'
              }`}
              title="Ambient Lighting Glow"
              aria-label="Ambient Glow"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setSettingsView('main');
              }}
              className="p-1 hover:text-indigo-400 transition-colors"
              title="Playback Settings"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Settings Overlay Drawer */}
            {showSettings && (
              <div className="absolute right-0 bottom-11 w-52 bg-[#14161d]/95 backdrop-blur-md border border-[#2e3444] rounded-2xl py-2 shadow-2xl z-40 transition-all animate-in fade-in zoom-in-95">
                {settingsView === 'main' && (
                  <div className="flex flex-col text-xs">
                    <button
                      onClick={() => setSettingsView('quality')}
                      className="w-full px-3 py-2 font-semibold text-slate-300 hover:bg-[#1f232e] hover:text-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span>Quality</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span>{currentQuality === -1 ? 'Auto' : `${qualities.find((q) => q.id === currentQuality)?.height}p`}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>

                    <button
                      onClick={() => setSettingsView('speed')}
                      className="w-full px-3 py-2 font-semibold text-slate-300 hover:bg-[#1f232e] hover:text-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        <span>Speed</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span>{playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>

                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className="w-full px-3 py-2 font-semibold text-slate-300 hover:bg-[#1f232e] hover:text-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        <span>Loop Video</span>
                      </div>
                      <span className="text-[11px] text-indigo-400">{isLooping ? 'On' : 'Off'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowStatsForNerds(true);
                        setShowSettings(false);
                      }}
                      className="w-full px-3 py-2 font-semibold text-slate-300 hover:bg-[#1f232e] hover:text-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span>Stats for nerds</span>
                      </div>
                    </button>

                    <button
                      onClick={handleCopyUrlWithTime}
                      className="w-full px-3 py-2 font-semibold text-slate-300 hover:bg-[#1f232e] hover:text-white flex items-center justify-between border-t border-[#232733] mt-1 pt-2"
                    >
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" />
                        <span>Copy URL at time</span>
                      </div>
                      {copyFeedback && <span className="text-emerald-400 text-[10px]">Copied!</span>}
                    </button>

                    <button
                      onClick={() => {
                        setShowShortcutsModal(true);
                        setShowSettings(false);
                      }}
                      className="w-full px-3 py-2 font-semibold text-slate-300 hover:bg-[#1f232e] hover:text-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        <span>Keyboard shortcuts (?)</span>
                      </div>
                    </button>
                  </div>
                )}

                {settingsView === 'quality' && (
                  <div className="flex flex-col text-xs">
                    <button
                      onClick={() => setSettingsView('main')}
                      className="w-full px-3 py-2 font-bold text-slate-200 border-b border-[#2e3444] mb-1 flex items-center gap-2"
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
                        Auto (1080p60)
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
                  <div className="flex flex-col text-xs">
                    <button
                      onClick={() => setSettingsView('main')}
                      className="w-full px-3 py-2 font-bold text-slate-200 border-b border-[#2e3444] mb-1 flex items-center gap-2"
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

            {/* Miniplayer (i) */}
            <button
              onClick={() => setIsMiniplayer(true)}
              className="p-1 hover:text-indigo-400 transition-colors"
              title="Miniplayer (i)"
              aria-label="Miniplayer"
            >
              <PictureInPicture className="w-5 h-5" />
            </button>

            {/* Theater Mode (t) */}
            <button
              onClick={() => setIsTheaterMode(!isTheaterMode)}
              className={`p-1 transition-colors ${
                isTheaterMode ? 'text-indigo-400' : 'hover:text-indigo-400 text-white'
              }`}
              title="Theater mode (t)"
              aria-label="Theater Mode"
            >
              <div className="w-5 h-4 border-2 border-current rounded-sm" />
            </button>

            {/* Fullscreen (f) */}
            <button
              onClick={toggleFullscreen}
              className="p-1 hover:text-indigo-400 transition-colors"
              title="Fullscreen (f)"
              aria-label="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
