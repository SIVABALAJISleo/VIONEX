'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Music, Volume2, VolumeX, ChevronUp, ChevronDown, Check, Send, X } from 'lucide-react';
import { INITIAL_SHORTS, ShortItem } from '@/lib/data';

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
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const item = {
      id: 'c-' + Date.now(),
      author: 'You',
      text: newComment.trim(),
      time: 'Just now'
    };

    setCommentsList((prev) => ({
      ...prev,
      [currentShort.id]: [...(prev[currentShort.id] || []), item]
    }));
    setNewComment('');
  };

  const currentLikes = likesState[currentShort.id] || { count: currentShort.likesCount, isLiked: false };
  const currentComments = commentsList[currentShort.id] || [];

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] py-4 relative">
      <div className="flex items-center gap-4">
        {/* 9:16 Vertical Video Frame */}
        <div className="relative aspect-9/16 h-[82vh] max-h-[820px] bg-black rounded-3xl overflow-hidden border border-[#232733] shadow-2xl flex items-center justify-center">
          {/* Real Video Element */}
          <video
            ref={videoRef}
            src="https://assets.mixkit.co/videos/preview/mixkit-circuit-board-microchip-computer-technology-43285-large.mp4"
            loop
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

          {/* Sound Toggle Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors shadow-lg"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-indigo-400" />}
          </button>

          {/* Index Indicator */}
          <div className="absolute top-4 left-4 z-30 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-semibold border border-white/10">
            {currentIndex + 1} / {INITIAL_SHORTS.length}
          </div>

          {/* Creator Attribution Bottom Overlay */}
          <div className="absolute bottom-6 left-4 right-16 z-20 space-y-2">
            <div className="flex items-center gap-2">
              <img
                src={currentShort.channel.avatarUrl}
                alt={currentShort.channel.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500"
              />
              <span className="font-bold text-sm text-white drop-shadow-md">
                @{currentShort.channel.handle}
              </span>
              <button className="px-3 py-1 rounded-full bg-white text-black font-bold text-xs hover:bg-slate-200 transition-colors shadow-md">
                Follow
              </button>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-white drop-shadow-md leading-snug line-clamp-2">
              {currentShort.title}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 drop-shadow">
              <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="truncate">{currentShort.musicTitle}</span>
            </div>
          </div>

          {/* Floating Action Rail on Right */}
          <div className="absolute right-3 bottom-8 flex flex-col items-center gap-4 z-20 text-white">
            {/* Like */}
            <button
              onClick={() => toggleLike(currentShort.id)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg ${
                currentLikes.isLiked
                  ? 'bg-pink-600 text-white scale-110'
                  : 'bg-black/60 text-white hover:bg-white/20'
              }`}>
                <ThumbsUp className={`w-5 h-5 ${currentLikes.isLiked ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[11px] font-semibold">{currentLikes.count.toLocaleString()}</span>
            </button>

            {/* Dislike */}
            <button className="flex flex-col items-center gap-1">
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg">
                <ThumbsDown className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold">Dislike</span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold">{currentComments.length + 120}</span>
            </button>

            {/* Share */}
            <button onClick={handleShare} className="flex flex-col items-center gap-1 relative">
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold">Share</span>
              {copiedShare && (
                <div className="absolute right-12 top-2 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold whitespace-nowrap shadow-xl flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied!
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Up / Down Navigation Controls */}
        <div className="hidden sm:flex flex-col gap-3">
          <button
            onClick={goPrev}
            className="w-12 h-12 rounded-full bg-[#14161d] hover:bg-[#1f232e] border border-[#232733] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
            title="Previous Short (Up Arrow)"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={goNext}
            className="w-12 h-12 rounded-full bg-[#14161d] hover:bg-[#1f232e] border border-[#232733] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
            title="Next Short (Down Arrow)"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sliding Comments Drawer */}
      {showComments && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#14161d] border-l border-[#232733] shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-[#232733] flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {currentComments.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-[#181a24] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400">{c.author}</span>
                  <span className="text-[10px] text-slate-500">{c.time}</span>
                </div>
                <p className="text-xs text-slate-200">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="p-3 border-t border-[#232733] flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#0b0c10] border border-[#232733] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
