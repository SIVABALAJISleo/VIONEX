'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Music,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Send,
  X,
  Play,
  Pause,
  Check,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_SHORTS, ShortItem, formatNumber, getSubscriptions, toggleSubscription } from '@/lib/data';

export default function ShortsPage() {
  const searchParams = useSearchParams();
  const requestedId = searchParams.get('id');

  const initialIdx = requestedId
    ? Math.max(0, INITIAL_SHORTS.findIndex(s => s.id === requestedId))
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIdx);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState<boolean | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [subscribedHandles, setSubscribedHandles] = useState<string[]>([]);

  // Likes & Dislikes state
  const [likesState, setLikesState] = useState<Record<string, { count: number; isLiked: boolean; isDisliked: boolean }>>({
    'short-001': { count: 48200, isLiked: false, isDisliked: false },
    'short-002': { count: 89100, isLiked: false, isDisliked: false },
    'short-003': { count: 142000, isLiked: false, isDisliked: false },
    'short-004': { count: 34500, isLiked: false, isDisliked: false }
  });

  // Comments state
  const [commentsList, setCommentsList] = useState<Record<string, { id: string; author: string; avatar: string; text: string; time: string }[]>>({
    'short-001': [
      { id: '1', author: 'DevMaster', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop', text: 'YOLOv10 directly in WebGPU is unbelievably fast!', time: '2h ago' },
      { id: '2', author: 'FrontendPro', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', text: '100 seconds tutorials are the best format on YouTube.', time: '1h ago' }
    ],
    'short-002': [
      { id: '3', author: 'CineGeek', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', text: 'That RED 6K sensor dynamic range is mind-blowing.', time: '3h ago' }
    ],
    'short-003': [
      { id: '4', author: 'AquaExplorer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop', text: 'Bioluminescence at 1000m depth is pure alien magic.', time: '4h ago' }
    ],
    'short-004': [
      { id: '5', author: 'BlenderArtist', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=100&auto=format&fit=crop', text: 'Blender Cycles rendering keeps rivaling million dollar studios.', time: '5h ago' }
    ]
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef<number>(0);

  const currentShort: ShortItem = INITIAL_SHORTS[currentIndex] || INITIAL_SHORTS[0];

  useEffect(() => {
    setSubscribedHandles(getSubscriptions());
  }, []);

  // Update video element when short changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.src = currentShort.videoUrl;
      videoRef.current.muted = isMuted;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Fallback with mute if browser autoplay policy blocks unmuted audio
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
      });
    }
  }, [currentIndex, currentShort.videoUrl]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < INITIAL_SHORTS.length - 1 ? prev + 1 : 0));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : INITIAL_SHORTS.length - 1));
  }, []);

  // Wheel listener for YouTube Shorts smooth vertical scroll
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 450) return; // debounce
    if (Math.abs(e.deltaY) > 25) {
      lastScrollTime.current = now;
      if (e.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        goPrev();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowPlayIcon(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      setShowPlayIcon(true);
    }
    setTimeout(() => setShowPlayIcon(null), 700);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const toggleLike = (id: string) => {
    setLikesState((prev) => {
      const cur = prev[id] || { count: 1000, isLiked: false, isDisliked: false };
      const nextLiked = !cur.isLiked;
      return {
        ...prev,
        [id]: {
          count: nextLiked ? cur.count + 1 : Math.max(0, cur.count - 1),
          isLiked: nextLiked,
          isDisliked: false
        }
      };
    });
  };

  const toggleDislike = (id: string) => {
    setLikesState((prev) => {
      const cur = prev[id] || { count: 1000, isLiked: false, isDisliked: false };
      const nextDisliked = !cur.isDisliked;
      return {
        ...prev,
        [id]: {
          count: cur.isLiked && nextDisliked ? Math.max(0, cur.count - 1) : cur.count,
          isLiked: nextDisliked ? false : cur.isLiked,
          isDisliked: nextDisliked
        }
      };
    });
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/shorts?id=${currentShort.id}`;
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleSubscribeToggle = (handle: string) => {
    const next = toggleSubscription(handle);
    setSubscribedHandles(getSubscriptions());
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const item = {
      id: `c-${Date.now()}`,
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      text: newComment.trim(),
      time: 'Just now'
    };
    setCommentsList((prev) => ({
      ...prev,
      [currentShort.id]: [item, ...(prev[currentShort.id] || [])]
    }));
    setNewComment('');
  };

  const currentLikes = likesState[currentShort.id] || { count: 1000, isLiked: false, isDisliked: false };
  const currentComments = commentsList[currentShort.id] || [];
  const isSubscribed = subscribedHandles.includes(currentShort.channel.handle);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-[#0F0F0F] py-4 select-none relative overflow-hidden"
    >
      {/* Toast Notification */}
      {copiedShare && (
        <div className="fixed top-20 z-50 px-4 py-2 rounded-full bg-white text-black font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-green-600" />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Main Shorts Container */}
      <div className="relative flex items-end justify-center gap-4 w-full max-w-xl px-4">
        {/* Navigation Arrow Up */}
        <button
          onClick={goPrev}
          className="hidden sm:flex absolute -top-12 left-1/2 -translate-x-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md shadow-lg transition-all"
          title="Previous Short (Up Arrow / k)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Vertical Video Viewport (9:16 Aspect Ratio) */}
        <div
          onClick={togglePlayPause}
          className="relative w-[340px] sm:w-[380px] h-[600px] sm:h-[660px] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 cursor-pointer group"
        >
          <video
            ref={videoRef}
            src={currentShort.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={goNext}
          />

          {/* Animated Center Play/Pause Indicator */}
          {showPlayIcon !== null && (
            <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <div className="p-4 rounded-full bg-black/60 text-white backdrop-blur-md animate-ping">
                {showPlayIcon ? <Play className="w-8 h-8 fill-white" /> : <Pause className="w-8 h-8 fill-white" />}
              </div>
            </div>
          )}

          {/* Top Bar: Sound Toggle */}
          <div className="absolute top-4 right-4 z-20" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors shadow-md"
              title={isMuted ? 'Unmute (m)' : 'Mute (m)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 z-20 space-y-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Channel Info */}
            <div className="flex items-center justify-between">
              <Link
                href={`/channel/${currentShort.channel.handle}`}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <img
                  src={currentShort.channel.avatarUrl}
                  alt={currentShort.channel.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white/60 shadow"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs drop-shadow truncate max-w-[140px]">
                      @{currentShort.channel.handle}
                    </span>
                    {currentShort.channel.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white fill-blue-500" />
                    )}
                  </div>
                  <span className="text-[10px] text-white/70">
                    {currentShort.channel.subscribers || 'Verified Creator'}
                  </span>
                </div>
              </Link>

              <button
                onClick={() => handleSubscribeToggle(currentShort.channel.handle)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md ${
                  isSubscribed
                    ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Title */}
            <p className="text-xs font-medium line-clamp-2 drop-shadow leading-snug">
              {currentShort.title}
            </p>

            {/* Audio Info */}
            <div className="flex items-center gap-2 text-[11px] text-white/90">
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{currentShort.musicTitle}</span>
            </div>
          </div>

          {/* Progress Bar (YouTube Style) */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
            <div
              className="h-full bg-red-600 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Right Interaction Rail (YouTube Shorts Style) */}
        <div className="flex flex-col items-center gap-4 pb-2 z-20">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggleLike(currentShort.id)}
              className={`p-3 rounded-full transition-all shadow-md ${
                currentLikes.isLiked
                  ? 'bg-red-600 text-white shadow-red-500/50'
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
              }`}
              title="Like"
            >
              <ThumbsUp className={`w-5 h-5 ${currentLikes.isLiked ? 'fill-white' : ''}`} />
            </button>
            <span className="text-[11px] font-semibold text-white/90" suppressHydrationWarning>
              {formatNumber(currentLikes.count)}
            </span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggleDislike(currentShort.id)}
              className={`p-3 rounded-full transition-all shadow-md ${
                currentLikes.isDisliked
                  ? 'bg-white text-black'
                  : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'
              }`}
              title="Dislike"
            >
              <ThumbsDown className={`w-5 h-5 ${currentLikes.isDisliked ? 'fill-black' : ''}`} />
            </button>
            <span className="text-[11px] font-semibold text-white/90">
              Dislike
            </span>
          </div>

          {/* Comments Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all shadow-md"
              title="Comments"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-semibold text-white/90">
              {currentComments.length + 10}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all shadow-md"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-semibold text-white/90">
              Share
            </span>
          </div>
        </div>

        {/* Navigation Arrow Down */}
        <button
          onClick={goNext}
          className="hidden sm:flex absolute -bottom-12 left-1/2 -translate-x-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md shadow-lg transition-all"
          title="Next Short (Down Arrow / j)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Slide-In Comments Drawer */}
      {showComments && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[380px] bg-[#1F1F1F] text-white z-50 shadow-2xl flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="font-bold text-sm">
              Comments ({currentComments.length + 10})
            </h3>
            <button
              onClick={() => setShowComments(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentComments.map((c) => (
              <div key={c.id} className="flex gap-3 text-xs">
                <img src={c.avatar} alt={c.author} className="w-7 h-7 rounded-full object-cover" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white/90">{c.author}</span>
                    <span className="text-[10px] text-white/50">{c.time}</span>
                  </div>
                  <p className="text-white/80 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="p-4 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 rounded-full bg-white/10 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 rounded-full bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
