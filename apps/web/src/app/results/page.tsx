'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, CheckCircle2, SlidersHorizontal, Play } from 'lucide-react';
import { getStoredVideos, VideoItem } from '@/lib/data';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('search_query') || '';
  const [filter, setFilter] = useState('All');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const all = getStoredVideos();
    setVideos(all);
  }, []);

  useEffect(() => {
    if (!query) {
      setFilteredVideos(videos);
      return;
    }
    const q = query.toLowerCase();
    const matches = videos.filter((v) => {
      const matchText = (v.title + ' ' + v.description + ' ' + v.channel.name + ' ' + v.tags.join(' ')).toLowerCase();
      return matchText.includes(q);
    });

    if (filter === 'Shorts') {
      setFilteredVideos(matches.filter(v => v.duration < 120));
    } else if (filter === 'Under 20m') {
      setFilteredVideos(matches.filter(v => v.duration <= 1200));
    } else if (filter === 'Over 20m') {
      setFilteredVideos(matches.filter(v => v.duration > 1200));
    } else {
      setFilteredVideos(matches);
    }
  }, [query, filter, videos]);

  const FILTERS = ['All', 'Videos', 'Channels', 'Shorts', 'Under 20m', 'Over 20m'];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#232733] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" />
            <span>Search results for: <span className="text-indigo-400 font-extrabold">&ldquo;{query}&rdquo;</span></span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Found {filteredVideos.length} matching video results
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14161d] border border-[#232733] rounded-xl text-xs text-slate-400 font-semibold shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter</span>
          </div>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-[#181a24] text-slate-300 hover:bg-[#232733] border border-[#232733]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Videos List */}
      {filteredVideos.length > 0 ? (
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <Link
              key={video.id}
              href={`/watch/${video.id}`}
              className="flex flex-col sm:flex-row gap-4 p-3 rounded-2xl bg-[#14161d]/60 hover:bg-[#181a24] border border-[#232733] hover:border-indigo-500/40 transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-72 md:w-80 aspect-video rounded-xl bg-black overflow-hidden shrink-0">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-xs font-mono font-semibold text-white">
                  {video.durationFormatted}
                </span>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0 space-y-2 py-1">
                <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <div className="text-xs text-slate-400">
                  <span>{video.viewsCount} views</span> • <span>{video.publishedAt}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <img
                    src={video.channel.avatarUrl}
                    alt={video.channel.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#232733]"
                  />
                  <span className="text-xs font-semibold text-slate-300 hover:text-white">
                    {video.channel.name}
                  </span>
                  {video.channel.isVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                  {video.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {video.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-[#1e2230] text-[11px] text-slate-400 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-4 bg-[#14161d] rounded-3xl border border-[#232733] p-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No results found for &ldquo;{query}&rdquo;</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Try searching for topics like &ldquo;Next.js&rdquo;, &ldquo;FFmpeg&rdquo;, &ldquo;Architecture&rdquo;, &ldquo;Synth&rdquo;, or &ldquo;Quantum&rdquo;.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors inline-block"
            >
              Browse All Videos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
