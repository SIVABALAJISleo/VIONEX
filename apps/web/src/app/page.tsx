'use client';

import React, { useState, useEffect } from 'react';
import VideoCard from '@/components/VideoCard';
import { getStoredVideos, VideoItem } from '@/lib/data';

const CATEGORIES = ['All', 'Technology', 'Coding', 'Music', 'Gaming', 'Science'];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    setVideos(getStoredVideos());
  }, []);

  const filteredVideos = activeCategory === 'All'
    ? videos
    : videos.filter((v) => v.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#181a24] hover:bg-[#232733] text-slate-300 border border-[#232733]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {filteredVideos.map((video) => (
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
