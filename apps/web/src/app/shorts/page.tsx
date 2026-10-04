'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
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
  Check,
  Send,
  X,
  MoreVertical
} from 'lucide-react';
import { INITIAL_SHORTS, ShortItem, formatNumber } from '@/lib/data';

export default function ShortsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likesState, setLikesState] = useState<Record<string, { count: number; isLiked: boolean }>>({
    'short-001': { count: 48200, isLiked: false },
    'short-002': { count: 89100, isLiked: false },
    'short-003': { count: 142000, isLiked: false },
    'short-004': { count: 34500, isLiked: false }
  });
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<Record<string, { id: string; author: string; text: string; time: string }[]>>({
    'short-001': [
      { id: '1', author: 'CodeMaster', text: 'The interactive rebase trick is a lifesaver!', time: '2h ago' },
      { id: '2', author: 'FrontendPro', text: 'Subscribed immediately. Need part 2!', time: '1h ago' }
    ],
    'short-002': [
      { id: '3', author: 'DevOpsDan', text: 'QUIC protocol 0-RTT handshakes are game changing.', time: '4h ago' }
    ]
  });
  const [newComment, setNewComment] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentShort = INITIAL_SHORTS[currentIndex] || INITIAL_SHORTS[0];

  const goNext = () => {
    if (currentIndex < INITIAL_SHORTS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(INITIAL_SHORTS.length - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        goPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const toggleLike = (id: string) => {
    setLikesState((prev) => {
      const cur = prev[id] || { count: 1000, isLiked: false };
      return {
        ...prev,
        [id]: {
          count: cur.isLiked ? cur.count - 1 : cur.count + 1,
          isLiked: !cur.isLiked
        }
      };
    });
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const item = {
      id: `c-${Date.now()}`,
      author: 'You',
      text: newComment.trim(),
      time: 'Just now'
    };
    setCommentsList((prev) => ({
      ...prev,
      [currentShort.id]: [item, ...(prev[currentShort.id] || [])]
    }));
    setNewComment('');
  };

  const currentLikes = likesState[currentShort.id] || { count: 1000, isLiked: false };
  const currentComments = commentsList[currentShort.id] || [];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-[#F9F9F9] py-4 select-none">
      <div className="relative flex items-end justify-center gap-4 max-w-lg w-full">
        {/* Navigation Arrow Up */}
        <button
          onClick={goPrev}
          className="hidden sm:flex absolute -top-12 left-1/2 -translate-x-1/2 p-2 rounded-full bg-white border border-[#E5E5E5] hover:bg-[#F2F2F2] shadow-sm text-[#0F0F0F] transition-all"
          title="Previous Short (Up Arrow)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        {/* Vertical Video Viewport */}
        <div className="relative w-[340px] sm:w-[380px] h-[580px] sm:h-[640px] rounded-2xl overflow-hidden bg-black shadow-xl border border-[#E5E5E5]">
          <video
            ref={videoRef}
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />

          {/* Top Overlay: Sound Toggle */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-10 space-y-3 text-white">
            {/* Channel Info */}
            <div className="flex items-center justify-between">
              <Link href={`/channel/${currentShort.channel.handle}`} className="flex items-center gap-2">
                <img
                  src={currentShort.channel.avatarUrl}
                  alt={currentShort.channel.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/40"
                />
                <span className="font-bold text-xs drop-shadow truncate max-w-[160px]">
                  @{currentShort.channel.handle}
                </span>
              </Link>
              <button className="px-3.5 py-1.5 rounded-full bg-white hover:bg-white/90 text-black text-xs font-bold shadow-md transition-colors">
                Subscribe
              </button>
            </div>

            {/* Title & Tags */}
            <p className="text-xs font-medium line-clamp-2 drop-shadow leading-snug">
              {currentShort.title}
            </p>

            {/* Audio Info */}
            <div className="flex items-center gap-2 text-[11px] text-white/90">
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{currentShort.musicTitle}</span>
            </div>
          </div>
        </div>

        {/* Right Interaction Rail (YouTube Style) */}
        <div className="flex flex-col items-center gap-4 pb-2">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggleLike(currentShort.id)}
              className={`p-3 rounded-full transition-all ${
                currentLikes.isLiked
                  ? 'bg-[#FF0000] text-white shadow-md'
                  : 'bg-white hover:bg-[#F2F2F2] border border-[#E5E5E5] text-[#0F0F0F]'
              }`}
            >
              <ThumbsUp className={`w-5 h-5 ${currentLikes.isLiked ? 'fill-white' : ''}`} />
            </button>
            <span className="text-[11px] font-semibold text-[#0F0F0F]" suppressHydrationWarning>
              {formatNumber(currentLikes.count)}
            </span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center gap-1">
            <button className="p-3 rounded-full bg-white hover:bg-[#F2F2F2] border border-[#E5E5E5] text-[#0F0F0F] transition-all">
              <ThumbsDown className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-semibold text-[#0F0F0F]">Dislike</span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-3 rounded-full bg-white hover:bg-[#F2F2F2] border border-[#E5E5E5] text-[#0F0F0F] transition-all"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <span className="text-[11px] font-semibold text-[#0F0F0F]" suppressHydrationWarning>
              {currentComments.length}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-white hover:bg-[#F2F2F2] border border-[#E5E5E5] text-[#0F0F0F] transition-all"
            >
              {copiedShare ? <Check className="w-5 h-5 text-[#065FD4]" /> : <Share2 className="w-5 h-5" />}
            </button>
            <span className="text-[11px] font-semibold text-[#0F0F0F]">
              {copiedShare ? 'Copied' : 'Share'}
            </span>
          </div>

          {/* Down Arrow Navigation */}
          <button
            onClick={goNext}
            className="p-3 rounded-full bg-white hover:bg-[#F2F2F2] border border-[#E5E5E5] text-[#0F0F0F] transition-all"
            title="Next Short (Down Arrow)"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Sliding Comments Drawer */}
        {showComments && (
          <div className="absolute inset-0 bg-white z-20 rounded-2xl p-4 flex flex-col justify-between shadow-2xl border border-[#E5E5E5]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <span className="font-bold text-sm text-[#0F0F0F]">Comments ({currentComments.length})</span>
              <button onClick={() => setShowComments(false)} className="text-[#606060] hover:text-[#0F0F0F]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 py-3 divide-y divide-[#E5E5E5]">
              {currentComments.map((c) => (
                <div key={c.id} className="pt-2 text-xs text-[#0F0F0F] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F0F0F]">{c.author}</span>
                    <span className="text-[#606060] text-[10px]">{c.time}</span>
                  </div>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-[#E5E5E5]">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 bg-[#F2F2F2] border border-[#E5E5E5] rounded-full px-3 py-1.5 text-xs outline-none text-[#0F0F0F]"
              />
              <button type="submit" className="p-2 rounded-full bg-[#065FD4] text-white hover:bg-[#0551B5]">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
