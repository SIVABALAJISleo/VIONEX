'use client';

import React from 'react';
import { usePlayer } from '@/lib/PlayerContext';
import { Play, Pause, X, Maximize2 } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function Miniplayer() {
  const { activeVideo, isPlaying, isMiniplayer, togglePlay, closeMiniplayer, setIsMiniplayer } = usePlayer();
  const router = useRouter();
  const pathname = usePathname();

  const isCurrentlyOnWatch = pathname.startsWith('/watch/');

  if (!activeVideo || !isMiniplayer || isCurrentlyOnWatch) {
    return null;
  }

  const handleExpand = () => {
    setIsMiniplayer(false);
    router.push(`/watch/${activeVideo.id}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white border border-[#E5E5E5] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      {/* Video Preview Container */}
      <div className="relative aspect-video bg-black w-full group">
        <img
          src={activeVideo.thumbnailUrl}
          alt={activeVideo.title}
          className="w-full h-full object-cover"
        />

        {/* Hover Overlay Controls */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#FF0000] hover:bg-[#CC0000] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </button>
          <button
            onClick={handleExpand}
            className="w-8 h-8 rounded-full bg-white/30 hover:bg-white/50 text-white flex items-center justify-center backdrop-blur-sm transition-transform hover:scale-105"
            title="Expand to Full Player"
            aria-label="Expand"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Top-Right Quick Close */}
        <button
          onClick={closeMiniplayer}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Close Miniplayer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mini Status Indicator */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
          Miniplayer (I)
        </div>
      </div>

      {/* Info Bar */}
      <div className="p-3 flex items-center justify-between gap-3 bg-white border-t border-[#E5E5E5]">
        <div className="min-w-0 flex-1 cursor-pointer" onClick={handleExpand}>
          <h4 className="text-xs font-bold text-[#0F0F0F] truncate hover:text-[#065FD4] transition-colors">
            {activeVideo.title}
          </h4>
          <p className="text-[11px] text-[#606060] truncate">
            {activeVideo.channel.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-1.5 text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>
          <button
            onClick={closeMiniplayer}
            className="p-1.5 text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2] rounded-full"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
