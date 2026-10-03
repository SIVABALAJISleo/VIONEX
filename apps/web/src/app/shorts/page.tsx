'use client';

import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreVertical, Music } from 'lucide-react';

export default function ShortsPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)] py-4">
      {/* 9:16 Vertical Video Frame */}
      <div className="relative aspect-9/16 h-[80vh] max-h-[800px] bg-black rounded-3xl overflow-hidden border border-[#232733] shadow-2xl flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

        <div className="text-center p-6 z-10 space-y-3">
          <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-bold">
            VIONEX Shorts
          </span>
          <h2 className="text-xl font-bold text-white">Next-Gen Vertical Video Experience</h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Snap-scroll mobile feed with instant pre-buffering and seamless loop playback.
          </p>
        </div>

        {/* Creator Attribution Bottom Overlay */}
        <div className="absolute bottom-6 left-4 right-16 z-20 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
              C
            </div>
            <span className="font-semibold text-sm text-white">@creator</span>
            <button className="px-3 py-1 rounded-full bg-white text-black font-bold text-xs hover:bg-slate-200 transition-colors">
              Follow
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Music className="w-3.5 h-3.5 text-pink-400" />
            <span className="truncate">Original Audio - VIONEX Sounds</span>
          </div>
        </div>

        {/* Floating Quick Action Rail */}
        <div className="absolute right-4 bottom-12 flex flex-col items-center gap-5 z-20 text-white">
          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold">12K</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
              <ThumbsDown className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold">Dislike</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold">482</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
