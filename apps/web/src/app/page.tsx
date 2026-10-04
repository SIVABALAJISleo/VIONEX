'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import { getStoredVideos, INITIAL_VIDEOS, INITIAL_SHORTS, VideoItem } from '@/lib/data';
import { Film } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology',
  'Coding',
  'Science',
  'Music',
  'HLS Streaming',
  'Cloud Architecture',
  'Recently uploaded'
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);

  useEffect(() => {
    setVideos(getStoredVideos());
  }, []);

  const handleCategorySelect = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []);

  const filteredVideos = useMemo(() => {
    if (activeCategory === 'All') return videos;
    const cat = activeCategory.toLowerCase();
    return videos.filter((v) =>
      v.category.toLowerCase().includes(cat) ||
      v.tags.some(t => t.toLowerCase().includes(cat))
    );
  }, [activeCategory, videos]);

  return (
    <div className="px-4 sm:px-6 pt-0 pb-6 max-w-[1920px] mx-auto bg-white min-h-screen">
      {/* Category Filter Pills (Reduced top space under header line, YouTube-accurate) */}
      <div className="sticky top-14 bg-white/95 backdrop-blur-md z-20 pt-2 pb-3 mb-6 border-b border-[#E5E5E5]">
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-75 select-none active:scale-95 ${
                activeCategory === cat
                  ? 'bg-[#0F0F0F] text-white shadow-sm'
                  : 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#0F0F0F] hover:scale-[1.02]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Grid with spacious top clearance */}
      <div className="pt-2 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
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
      </div>

      {/* YouTube Shorts Shelf */}
      <div className="pt-6 pb-6 my-10 border-t border-b border-[#E5E5E5] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#FF0000] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-[#0F0F0F]">Shorts</h2>
          </div>
          <Link href="/shorts" prefetch={true} className="text-xs font-semibold text-[#065FD4] hover:underline cursor-pointer">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {INITIAL_SHORTS.map((short, idx) => {
            const shortThumbnails = [
              'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop'
            ];
            return (
              <Link
                key={short.id}
                href={`/shorts?id=${short.id}`}
                prefetch={true}
                className="group flex flex-col gap-2 relative cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-[#E5E5E5] shadow-sm">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url(${shortThumbnails[idx % shortThumbnails.length]})`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <h3 className="font-semibold text-xs line-clamp-2 leading-tight drop-shadow">
                      {short.title}
                    </h3>
                    <p className="text-[11px] text-white/90 mt-1">{short.likes} likes</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Remaining Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 mt-8 mb-12">
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
