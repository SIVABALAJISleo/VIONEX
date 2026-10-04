'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SlidersHorizontal, CheckCircle2, Search, X } from 'lucide-react';
import { getStoredVideos, VideoItem } from '@/lib/data';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('search_query') || '';

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const all = getStoredVideos();
    if (!query.trim()) {
      setVideos(all);
      return;
    }
    const q = query.toLowerCase();
    const matched = all.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.channel.name.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q))
    );
    setVideos(matched.length > 0 ? matched : all);
  }, [query]);

  let displayVideos = [...videos];
  if (sortBy === 'views') {
    displayVideos.sort((a, b) => b.viewsNumeric - a.viewsNumeric);
  } else if (sortBy === 'likes') {
    displayVideos.sort((a, b) => b.likesCount - a.likesCount);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white text-[#0F0F0F] min-h-[80vh] space-y-5">
      {/* Header & Filter Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
        <h1 className="text-sm font-semibold text-[#606060]">
          About {displayVideos.length} results for <span className="text-[#0F0F0F] font-bold">"{query}"</span>
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#F2F2F2] text-xs font-semibold text-[#0F0F0F] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#606060]" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="p-4 bg-[#F9F9F9] border border-[#E5E5E5] rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="font-bold text-[#0F0F0F] block mb-2 uppercase text-[10px] tracking-wider">Sort by</span>
            <div className="space-y-1 text-[#606060]">
              {['relevance', 'views', 'likes'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`block capitalize ${sortBy === s ? 'text-[#0F0F0F] font-bold' : 'hover:text-[#0F0F0F]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="font-bold text-[#0F0F0F] block mb-2 uppercase text-[10px] tracking-wider">Type</span>
            <div className="space-y-1 text-[#606060]">
              <p className="font-bold text-[#0F0F0F]">Video</p>
              <p className="hover:text-[#0F0F0F] cursor-pointer">Channel</p>
              <p className="hover:text-[#0F0F0F] cursor-pointer">Playlist</p>
            </div>
          </div>
          <div>
            <span className="font-bold text-[#0F0F0F] block mb-2 uppercase text-[10px] tracking-wider">Upload date</span>
            <div className="space-y-1 text-[#606060]">
              <p className="font-bold text-[#0F0F0F]">Any time</p>
              <p className="hover:text-[#0F0F0F] cursor-pointer">This week</p>
              <p className="hover:text-[#0F0F0F] cursor-pointer">This month</p>
            </div>
          </div>
          <div>
            <span className="font-bold text-[#0F0F0F] block mb-2 uppercase text-[10px] tracking-wider">Duration</span>
            <div className="space-y-1 text-[#606060]">
              <p className="font-bold text-[#0F0F0F]">Any duration</p>
              <p className="hover:text-[#0F0F0F] cursor-pointer">Under 4 minutes</p>
              <p className="hover:text-[#0F0F0F] cursor-pointer">4 - 20 minutes</p>
              <p className="hover:text-[#0F0F0F] cursor-pointer">Over 20 minutes</p>
            </div>
          </div>
        </div>
      )}

      {/* Results List (YouTube Horizontal Search Format) */}
      <div className="space-y-5">
        {displayVideos.map((video) => (
          <div key={video.id} className="flex flex-col sm:flex-row gap-4 items-start group">
            <Link
              href={`/watch/${video.id}`}
              className="relative aspect-video w-full sm:w-80 md:w-96 shrink-0 rounded-xl overflow-hidden bg-[#E5E5E5] shadow-sm"
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-1.5 right-1.5 px-1 py-0.5 rounded bg-black/85 text-[11px] font-medium text-white">
                {video.durationFormatted}
              </span>
            </Link>

            <div className="flex-1 min-w-0 space-y-1">
              <Link href={`/watch/${video.id}`}>
                <h3 className="font-semibold text-base text-[#0F0F0F] line-clamp-2 leading-snug group-hover:text-[#0F0F0F]">
                  {video.title}
                </h3>
              </Link>
              <p className="text-xs text-[#606060]">
                {video.viewsCount} views • {video.publishedAt}
              </p>

              <Link
                href={`/channel/${video.channel.handle}`}
                className="flex items-center gap-2 py-2"
              >
                <img
                  src={video.channel.avatarUrl}
                  alt={video.channel.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#E5E5E5]"
                />
                <span className="text-xs text-[#606060] hover:text-[#0F0F0F] font-medium flex items-center gap-1">
                  {video.channel.name}
                  {video.channel.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#606060]" />}
                </span>
              </Link>

              <p className="text-xs text-[#606060] line-clamp-2 leading-relaxed">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#606060]">Loading search results...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
