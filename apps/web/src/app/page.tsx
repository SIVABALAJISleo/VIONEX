'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import { getStoredVideos, INITIAL_SHORTS, VideoItem } from '@/lib/data';
import { Flame, Film, Play, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology',
  'Coding',
  'Gaming',
  'Science',
  'Music',
  'WebRTC',
  'HLS Streaming',
  'Cloud Architecture',
  'Recently uploaded'
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    setVideos(getStoredVideos());
  }, []);

  const filteredVideos = activeCategory === 'All'
    ? videos
    : videos.filter((v) =>
        v.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
        v.tags.some(t => t.toLowerCase().includes(activeCategory.toLowerCase()))
      );

  return (
    <div className="p-4 sm:p-6 max-w-[1920px] mx-auto space-y-7 bg-white">
      {/* Category Filter Pills (YouTube style) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sticky top-14 bg-white/95 backdrop-blur-sm z-20 py-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-[#0F0F0F] text-white font-medium'
                : 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#0F0F0F] font-normal'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
        {filteredVideos.slice(0, 4).map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            thumbnailUrl={video.thumbnailUrl}
            duration={video.duration}
            channel={video.channel}
            viewsCount={video.viewsCount}
            publishedAt={video.publishedAt}
          />
        ))}
      </div>

      {/* YouTube Shorts Shelf */}
      <div className="pt-4 pb-2 border-t border-b border-[#E5E5E5] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#FF0000] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#0F0F0F]">Shorts</h2>
          </div>
          <Link href="/shorts" className="text-xs font-semibold text-[#065FD4] hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {INITIAL_SHORTS.map((short) => (
            <Link
              key={short.id}
              href={`/shorts?id=${short.id}`}
              className="group flex flex-col gap-2 relative"
            >
              <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#E5E5E5] shadow-sm">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${
                      short.id === 'short-001'
                        ? 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'
                        : short.id === 'short-002'
                        ? 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop'
                        : short.id === 'short-003'
                        ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop'
                        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop'
                    })`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <h3 className="font-semibold text-xs line-clamp-2 leading-tight drop-shadow">
                    {short.title}
                  </h3>
                  <p className="text-[11px] text-white/90 mt-1">{short.likes} views</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Remaining Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
        {filteredVideos.slice(4).map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            thumbnailUrl={video.thumbnailUrl}
            duration={video.duration}
            channel={video.channel}
            viewsCount={video.viewsCount}
            publishedAt={video.publishedAt}
          />
        ))}
      </div>
    </div>
  );
}
