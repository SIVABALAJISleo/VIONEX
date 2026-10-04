'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Music, Gamepad2, Code2, Rocket, Newspaper, Radio, CheckCircle2 } from 'lucide-react';
import { INITIAL_VIDEOS } from '@/lib/data';
import VideoCard from '@/components/VideoCard';

const EXPLORE_CATEGORIES = [
  { id: 'trending', label: 'Trending', icon: Flame, color: 'bg-[#FF0000]' },
  { id: 'music', label: 'Music', icon: Music, color: 'bg-[#065FD4]' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'bg-[#E62117]' },
  { id: 'coding', label: 'Coding', icon: Code2, color: 'bg-[#107C41]' },
  { id: 'science', label: 'Science', icon: Rocket, color: 'bg-[#7B1FA2]' },
  { id: 'news', label: 'News', icon: Newspaper, color: 'bg-[#D97706]' }
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredVideos = activeCategory === 'All'
    ? INITIAL_VIDEOS
    : INITIAL_VIDEOS.filter(v => v.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 bg-white text-[#0F0F0F] min-h-[80vh]">
      {/* Category Hero Grid (YouTube Explore Style) */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 text-[#0F0F0F]">
          <Flame className="w-6 h-6 text-[#FF0000] fill-[#FF0000]" />
          Explore
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {EXPLORE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory.toLowerCase() === cat.label.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(isSelected ? 'All' : cat.label)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                  isSelected
                    ? 'border-[#0F0F0F] bg-[#F2F2F2] shadow-sm'
                    : 'border-[#E5E5E5] bg-white hover:bg-[#F9F9F9]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center text-white shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-[#0F0F0F] truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Videos */}
      <div className="space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-[#0F0F0F]">
          {activeCategory === 'All' ? 'Trending videos' : `${activeCategory} videos`}
        </h2>
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
    </div>
  );
}
