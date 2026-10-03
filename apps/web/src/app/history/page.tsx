'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Trash2, Search, Play, Pause, CheckCircle2 } from 'lucide-react';
import { getHistory, VideoItem } from '@/lib/data';

export default function HistoryPage() {
  const [videos, setVideos] = useState<VideoItem[]>(() => getHistory());
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setVideos(getHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm('Clear all watch history?')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vionex_history');
      }
      setVideos([]);
    }
  };

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('vionex_history');
      if (raw) {
        try {
          const ids: string[] = JSON.parse(raw);
          const next = ids.filter(x => x !== id);
          localStorage.setItem('vionex_history', JSON.stringify(next));
        } catch {}
      }
    }
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#232733]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Watch History</h1>
            <p className="text-xs text-slate-400">Manage and revisit your recently played videos</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#14161d] border border-[#232733] rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors w-48 sm:w-60"
            />
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              isPaused
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-[#14161d] border-[#232733] text-slate-300 hover:text-white'
            }`}
          >
            {isPaused ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'History Paused' : 'Pause'}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#14161d] border border-[#232733] text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Video List */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 rounded-2xl hover:bg-[#14161d] border border-transparent hover:border-[#232733] transition-all relative"
            >
              <Link
                href={`/watch/${video.id}`}
                className="relative w-full sm:w-56 aspect-video rounded-xl bg-black overflow-hidden shrink-0"
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-white">
                  {video.durationFormatted || `${video.duration}s`}
                </span>
              </Link>

              <div className="flex-1 min-w-0 pr-8">
                <Link href={`/watch/${video.id}`}>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs">
                  <span>{video.channel.name}</span>
                  <CheckCircle2 className="w-3 h-3 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {video.description}
                </p>
                <div className="text-[11px] text-slate-500 mt-1">
                  {video.viewsCount} • Watched recently
                </div>
              </div>

              <button
                onClick={(e) => handleRemoveItem(video.id, e)}
                title="Remove from history"
                className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
          <History className="w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            {searchQuery ? 'No matching videos in history' : 'No watch history yet'}
          </h2>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            {searchQuery
              ? 'Try searching with different keywords or clear your search filter.'
              : 'Videos you watch will appear here so you can easily find them again.'}
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors inline-block"
          >
            Start Watching
          </Link>
        </div>
      )}
    </div>
  );
}
