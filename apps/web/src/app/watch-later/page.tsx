'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Play, Shuffle, Trash2, CheckCircle2 } from 'lucide-react';
import { getWatchLater, toggleWatchLater, VideoItem } from '@/lib/data';

export default function WatchLaterPage() {
  const [videos, setVideos] = useState<VideoItem[]>(() => getWatchLater());

  useEffect(() => {
    setVideos(getWatchLater());
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchLater(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const heroThumb = videos[0]?.thumbnailUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800';

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Playlist Info Hero Banner (Left Column) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gradient-to-b from-blue-900/40 via-[#14161d] to-[#14161d] border border-[#232733] rounded-3xl p-6 space-y-4 sticky top-20 shadow-2xl">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black relative shadow-lg">
                <img
                  src={heroThumb}
                  alt="Watch Later"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Clock className="w-12 h-12 text-blue-400" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-black text-white">Watch Later</h1>
                <p className="text-xs text-slate-400 mt-1">Saved queue • Private</p>
                <div className="text-xs text-blue-400 font-semibold mt-1">
                  {videos.length} videos
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={videos[0]?.id ? `/watch/${videos[0].id}` : '#'}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-white hover:bg-slate-200 text-black font-bold text-xs transition-colors shadow-lg"
                >
                  <Play className="w-4 h-4 fill-black" /> Play All
                </Link>
                <Link
                  href={videos.length > 0 ? `/watch/${videos[Math.floor(Math.random() * videos.length)].id}` : '#'}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#1f232e] hover:bg-[#282d3b] text-white font-bold text-xs border border-[#2e3444] transition-colors"
                >
                  <Shuffle className="w-4 h-4" /> Shuffle
                </Link>
              </div>
            </div>
          </div>

          {/* Videos Queue (Right Columns) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-semibold text-slate-400 pb-2 border-b border-[#232733]">
              Queue ({videos.length})
            </div>
            {videos.map((video, idx) => (
              <div
                key={video.id}
                className="group flex items-center gap-3 sm:gap-4 p-2.5 rounded-2xl hover:bg-[#14161d] border border-transparent hover:border-[#232733] transition-all"
              >
                <span className="text-xs font-mono text-slate-500 w-5 text-center shrink-0">
                  {idx + 1}
                </span>

                <Link
                  href={`/watch/${video.id}`}
                  className="relative w-40 aspect-video rounded-xl bg-black overflow-hidden shrink-0"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-white">
                    {video.duration}
                  </span>
                </Link>

                <div className="flex-1 min-w-0 pr-2">
                  <Link href={`/watch/${video.id}`}>
                    <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs">
                    <span>{video.channel.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {video.views} • {video.uploadedAt}
                  </div>
                </div>

                <button
                  onClick={(e) => handleRemove(video.id, e)}
                  title="Remove from watch later"
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-all shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
          <Clock className="w-16 h-16 text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Your queue is empty</h2>
          <p className="text-slate-400 text-sm max-w-md mb-6">
            Save interesting videos here to watch them later whenever you have free time.
          </p>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors inline-block"
          >
            Discover Videos
          </Link>
        </div>
      )}
    </div>
  );
}
