'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  Music,
  Gamepad2,
  Code2,
  Rocket,
  Newspaper,
  Sparkles,
  Layers,
  Cpu,
  Brain,
  Palette
} from 'lucide-react';
import { INITIAL_VIDEOS, VideoItem } from '@/lib/data';
import VideoCard from '@/components/VideoCard';
import { discoveryApi } from '@/lib/api';

const EXPLORE_AREAS = [
  { id: 'all', label: 'All', icon: Flame, color: 'bg-[#FF0000]' },
  { id: 'software', label: 'Software', icon: Code2, color: 'bg-[#107C41]' },
  { id: 'ai-data', label: 'AI & Data', icon: Brain, color: 'bg-[#7B1FA2]' },
  { id: 'systems-security', label: 'Security & Systems', icon: Cpu, color: 'bg-[#065FD4]' },
  { id: 'math-theory', label: 'Math & Theory', icon: Layers, color: 'bg-[#0284C7]' },
  { id: 'design-graphics-media', label: 'Design & Media', icon: Palette, color: 'bg-[#EA580C]' },
  { id: 'physics-space', label: 'Physics & Space', icon: Rocket, color: 'bg-[#4F46E5]' },
  { id: 'games', label: 'Games', icon: Gamepad2, color: 'bg-[#E62117]' },
  { id: 'arts-entertainment', label: 'Music & Arts', icon: Music, color: 'bg-[#DB2777]' },
  { id: 'news', label: 'News', icon: Newspaper, color: 'bg-[#D97706]' }
];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'community' | 'taxonomy'>('trending');
  const [activeArea, setActiveArea] = useState('all');
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [communityPicks, setCommunityPicks] = useState<VideoItem[]>([]);
  const [taxonomyAreas, setTaxonomyAreas] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch Community Hall of Fame Picks
    discoveryApi
      .getCommunityPicks()
      .then((res: any) => {
        if (res && res.success && Array.isArray(res.picks) && res.picks.length > 0) {
          const mapped = res.picks.map((v: any) => ({
            id: v.id,
            title: v.title,
            description: v.description || '',
            thumbnailUrl: v.thumbnailUrl || (v.externalVideoId ? `https://i.ytimg.com/vi/${v.externalVideoId}/hq2.jpg` : ''),
            duration: v.duration || 0,
            durationFormatted: `${Math.floor((v.duration || 0) / 60)}:${Math.floor((v.duration || 0) % 60).toString().padStart(2, '0')}`,
            videoUrl: v.hlsMasterUrl || '',
            channel: {
              name: v.channel?.name || 'VIONEX Creator',
              handle: v.channel?.handle || 'creator',
              avatarUrl: v.channel?.avatarUrl || '',
              isVerified: v.channel?.isVerified || false
            },
            viewsCount: v.viewsCount || '0',
            viewsNumeric: parseInt(v.viewsCount || '0', 10),
            likesCount: v.likesCount || 0,
            publishedAt: v.publishedAt ? new Date(v.publishedAt).toLocaleDateString() : 'Recently',
            category: v.category || 'General',
            tags: v.tags || [],
            commentsCount: v.commentsCount || 0,
            contentType: v.contentType,
            level: v.level,
            shelfLife: v.shelfLife,
            whyCommunity: v.whyCommunity,
            communityScore: v.communityScore,
            pullQuote: v.pullQuote,
            recommendationReason: 'COMMUNITY_FAVORITE',
            taxonomyAreaId: v.taxonomyAreaId,
            taxonomyCategoryId: v.taxonomyCategoryId
          }));
          setCommunityPicks(mapped);
        }
      })
      .catch(() => {});

    // 2. Fetch full 16-area taxonomy
    discoveryApi
      .getTaxonomy()
      .then((res: any) => {
        if (res && res.success && Array.isArray(res.areas)) {
          setTaxonomyAreas(res.areas);
        }
      })
      .catch(() => {});
  }, []);

  const displayedVideos = activeTab === 'community' && communityPicks.length > 0
    ? communityPicks
    : activeArea === 'all'
    ? videos
    : videos.filter((v) => {
        if (v.taxonomyAreaId && v.taxonomyAreaId === activeArea) return true;
        const lower = activeArea.toLowerCase();
        return (
          v.category.toLowerCase().includes(lower) ||
          v.tags.some((t) => t.toLowerCase().includes(lower))
        );
      });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 bg-white text-[#0F0F0F] min-h-[80vh]">
      {/* Header and View Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-[#0F0F0F]">
            <Flame className="w-6 h-6 text-[#FF0000] fill-[#FF0000]" />
            Explore & Curation
          </h1>
          <p className="text-xs text-[#606060] mt-1">
            Discover curated courses, talks, explainers, and topics across 16 knowledge areas.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 p-1 bg-[#F2F2F2] rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('trending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'trending' ? 'bg-white text-[#0F0F0F] shadow-sm' : 'text-[#606060] hover:text-[#0F0F0F]'
            }`}
          >
            Trending
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('community')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
              activeTab === 'community' ? 'bg-white text-[#0F0F0F] shadow-sm' : 'text-[#606060] hover:text-[#0F0F0F]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            Top Recommendations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('taxonomy')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
              activeTab === 'taxonomy' ? 'bg-white text-[#0F0F0F] shadow-sm' : 'text-[#606060] hover:text-[#0F0F0F]'
            }`}
          >
            <Layers className="w-3 h-3 text-[#065FD4]" />
            Topic Ontology
          </button>
        </div>
      </div>

      {activeTab === 'taxonomy' ? (
        /* Taxonomy Tree Explorer (16 Areas & 150 Categories) */
        <div className="space-y-6">
          <div className="bg-[#F8F9FA] border border-[#E9ECEF] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-[#0F0F0F] mb-1">Standardized Knowledge Taxonomy</h2>
            <p className="text-xs text-[#606060]">
              16 areas and 150 topic categories with query synonym expansion for high-precision semantic search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taxonomyAreas.map((area: any) => (
              <div key={area.id} className="border border-[#E5E5E5] rounded-xl p-4 bg-white shadow-xs hover:border-[#CCCCCC] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xs text-[#0F0F0F]">{area.name}</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F2F2F2] text-[#606060] font-medium">
                    {area.categories?.length || 0} topics
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {area.categories?.slice(0, 6).map((cat: any) => (
                    <span
                      key={cat.id}
                      title={cat.description}
                      className="px-2 py-1 rounded-md bg-[#F2F2F2] text-[11px] text-[#495057] hover:bg-[#E5E5E5] cursor-pointer transition-colors"
                    >
                      {cat.name}
                    </span>
                  ))}
                  {area.categories?.length > 6 && (
                    <span className="px-2 py-1 text-[10px] text-[#868E96] font-medium">
                      +{area.categories.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Video Grid Mode */
        <>
          {/* Quick Area Filter Buttons */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {EXPLORE_AREAS.map((cat) => {
                const Icon = cat.icon;
                const isSelected = activeArea === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveArea(cat.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'border-[#0F0F0F] bg-[#F2F2F2] shadow-sm'
                        : 'border-[#E5E5E5] bg-white hover:bg-[#F9F9F9]'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg ${cat.color} flex items-center justify-center text-white shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs text-[#0F0F0F] truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#0F0F0F]">
                {activeTab === 'community'
                  ? 'Community Recommended Hall of Fame'
                  : activeArea === 'all'
                  ? 'Trending Videos'
                  : `${EXPLORE_AREAS.find((a) => a.id === activeArea)?.label || activeArea} Videos`}
              </h2>
              <span className="text-xs text-[#606060]">{displayedVideos.length} videos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {displayedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                  duration={video.duration}
                  channel={video.channel}
                  viewsCount={video.viewsCount}
                  publishedAt={video.publishedAt}
                  contentType={video.contentType}
                  level={video.level}
                  shelfLife={video.shelfLife}
                  whyCommunity={video.whyCommunity}
                  communityScore={video.communityScore}
                  pullQuote={video.pullQuote}
                  recommendationReason={video.recommendationReason}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
