'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Trash2, Pause, Play, X, ExternalLink } from 'lucide-react';
import { getStoredHistory, clearHistory, removeFromHistory, togglePauseHistory, isHistoryPaused, VideoItem } from '@/lib/data';

export default function HistoryPage() {
  const [history, setHistory] = useState<VideoItem[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setHistory(getStoredHistory());
    setPaused(isHistoryPaused());
  }, []);

  const handleClear = () => {
    if (confirm('Clear all watch history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleRemove = (id: string) => {
    removeFromHistory(id);
    setHistory(getStoredHistory());
  };

  const handleTogglePause = () => {
    const next = togglePauseHistory();
    setPaused(next);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white text-[#0F0F0F] min-h-[80vh]">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Video List */}
        <div className="flex-1 space-y-4 w-full">
          <div className="pb-3 border-b border-[#E5E5E5] flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <History className="w-6 h-6 text-[#0F0F0F]" />
              Watch history
            </h1>
            <span className="text-xs text-[#606060]">{history.length} videos</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <History className="w-12 h-12 text-[#909090] mx-auto" />
              <p className="text-sm font-semibold text-[#0F0F0F]">This list has no videos.</p>
              <p className="text-xs text-[#606060]">Videos you watch will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-[#E5E5E5]">
              {history.map((video) => (
                <div key={video.id} className="pt-4 flex gap-4 items-start group">
                  <Link
                    href={`/watch/${video.id}`}
                    className="relative aspect-video w-44 sm:w-56 shrink-0 rounded-xl overflow-hidden bg-[#E5E5E5] shadow-sm"
                  >
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/85 text-[10px] font-medium text-white">
                      {video.durationFormatted}
                    </span>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/watch/${video.id}`}>
                        <h3 className="font-semibold text-sm text-[#0F0F0F] line-clamp-2 leading-snug hover:text-[#065FD4]">
                          {video.title}
                        </h3>
                      </Link>
                      <button
                        onClick={() => handleRemove(video.id)}
                        className="p-1 rounded-full hover:bg-[#F2F2F2] text-[#606060] hover:text-[#0F0F0F]"
                        title="Remove from watch history"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <Link
                      href={`/channel/${video.channel.handle}`}
                      className="text-xs text-[#606060] hover:text-[#0F0F0F] mt-1 block"
                    >
                      {video.channel.name} • {video.viewsCount} views
                    </Link>

                    <p className="text-xs text-[#606060] line-clamp-2 mt-2 hidden sm:block">
                      {video.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions Sidebar */}
        <div className="w-full md:w-64 bg-[#F9F9F9] border border-[#E5E5E5] rounded-2xl p-4 space-y-3 shrink-0">
          <h2 className="text-xs font-bold text-[#606060] uppercase tracking-wider">History Controls</h2>
          <button
            onClick={handleClear}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#0F0F0F] hover:bg-[#E5E5E5] transition-colors"
          >
            <Trash2 className="w-4 h-4 text-[#606060]" />
            <span>Clear all watch history</span>
          </button>
          <button
            onClick={handleTogglePause}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#0F0F0F] hover:bg-[#E5E5E5] transition-colors"
          >
            {paused ? <Play className="w-4 h-4 text-[#137333]" /> : <Pause className="w-4 h-4 text-[#606060]" />}
            <span>{paused ? 'Resume watch history' : 'Pause watch history'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
