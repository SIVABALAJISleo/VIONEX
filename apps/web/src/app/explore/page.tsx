'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, Music, Gamepad2, Code2, Rocket, Newspaper, Radio, CheckCircle2, TrendingUp } from 'lucide-react';
import { INITIAL_VIDEOS } from '@/lib/data';

const EXPLORE_CATEGORIES = [
  { id: 'trending', label: 'Trending', icon: Flame, gradient: 'from-orange-500 to-pink-500', count: '1.2M watching' },
  { id: 'music', label: 'Music', icon: Music, gradient: 'from-pink-500 to-rose-600', count: '840K tracks' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, gradient: 'from-purple-600 to-indigo-600', count: '450K live' },
  { id: 'coding', label: 'Tech & Code', icon: Code2, gradient: 'from-blue-600 to-cyan-500', count: '290K tutorials' },
  { id: 'science', label: 'Science', icon: Rocket, gradient: 'from-emerald-500 to-teal-600', count: '180K deep-dives' },
  { id: 'news', label: 'Live News', icon: Newspaper, gradient: 'from-amber-500 to-red-500', count: '65 channels' }
];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredVideos = activeCategory === 'All'
    ? INITIAL_VIDEOS
    : INITIAL_VIDEOS.filter(v => v.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Category Hero Grid */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Flame className="w-6 h-6 text-pink-500 fill-pink-500" />
          Explore & Discover
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {EXPLORE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.label === 'Tech & Code' ? 'Coding' : cat.label)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-lg hover:scale-105 active:scale-95 transition-all text-center group`}
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 group-hover:rotate-6 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xs">{cat.label}</span>
                <span className="text-[10px] text-white/80 mt-0.5">{cat.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trending Leaderboard Rank Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#232733] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Trending Top 5</h2>
          </div>
          <span className="text-xs text-slate-400">Updated every 15 minutes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_VIDEOS.slice(0, 4).map((video, idx) => (
            <Link
              key={video.id}
              href={`/watch/${video.id}`}
              className="flex gap-4 p-3 rounded-2xl bg-[#14161d] border border-[#232733] hover:border-indigo-500/40 hover:bg-[#181a24] transition-all group"
            >
              <div className="flex items-center justify-center w-8 shrink-0">
                <span className="text-2xl font-black text-slate-500 group-hover:text-indigo-400 transition-colors">
                  #{idx + 1}
                </span>
              </div>
              <div className="w-36 aspect-video rounded-xl overflow-hidden bg-black shrink-0 relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                  {video.durationFormatted}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">
                  {video.title}
                </h3>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>{video.channel.name}</span>
                  {video.channel.isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {video.viewsCount} views • {video.publishedAt}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Filterable Video Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#232733] pb-3">
          <h2 className="text-lg font-bold text-white">
            {activeCategory === 'All' ? 'Popular Across All Categories' : `${activeCategory} Videos`}
          </h2>
          {activeCategory !== 'All' && (
            <button
              onClick={() => setActiveCategory('All')}
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              Show all
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredVideos.map((video) => (
            <Link
              key={video.id}
              href={`/watch/${video.id}`}
              className="group flex flex-col space-y-3 cursor-pointer"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#232733] group-hover:border-indigo-500/50 transition-colors">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-xs font-mono font-semibold text-white">
                  {video.durationFormatted}
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <img
                  src={video.channel.avatarUrl}
                  alt={video.channel.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#232733] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                    <span>{video.channel.name}</span>
                    {video.channel.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {video.viewsCount} views • {video.publishedAt}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
