'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import { getStoredVideos, INITIAL_VIDEOS, INITIAL_SHORTS, VideoItem } from '@/lib/data';
import { discoveryApi } from '@/lib/api';
import { Film, Sparkles } from 'lucide-react';

const TAXONOMY_AREAS = [
  { id: 'all', name: 'All' },
  { id: 'software', name: 'Software & Code' },
  { id: 'ai-data', name: 'AI & Data' },
  { id: 'systems-security', name: 'Systems & Security' },
  { id: 'math-theory', name: 'Math & CS Theory' },
  { id: 'hardware', name: 'Hardware & Chips' },
  { id: 'design-graphics-media', name: 'Design & Media' },
  { id: 'business-economics', name: 'Startups & Business' },
  { id: 'engineering-making', name: 'Engineering & Making' },
  { id: 'physics-space', name: 'Physics & Space' },
  { id: 'ideas-education', name: 'Ideas & Learning' }
];

export default function HomePage() {
  const [activeArea, setActiveArea] = useState('all');
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);

  useEffect(() => {
    // 1. Load cached/stored local videos first
    const stored = getStoredVideos();
    if (stored && stored.length > 0) {
      setVideos(stored);
    }

    // 2. Fetch live personalized / community-curated feed from backend API
    discoveryApi
      .getHomeFeed()
      .then((res: any) => {
        if (res && res.success && Array.isArray(res.feed) && res.feed.length > 0) {
          const apiFeed = res.feed.map((v: any) => ({
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
            recommendationReason: v.recommendationReason,
            taxonomyAreaId: v.taxonomyAreaId,
            taxonomyCategoryId: v.taxonomyCategoryId
          }));

          // Merge uniquely by ID
          setVideos((prev) => {
            const map = new Map<string, VideoItem>();
            for (const item of apiFeed) map.set(item.id, item);
            for (const item of prev) if (!map.has(item.id)) map.set(item.id, item);
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleAreaSelect = useCallback((areaId: string) => {
    setActiveArea(areaId);
  }, []);

  const filteredVideos = useMemo(() => {
    if (activeArea === 'all') return videos;
    return videos.filter((v) => {
      if (v.taxonomyAreaId && v.taxonomyAreaId === activeArea) return true;
      const lower = activeArea.toLowerCase();
      return (
        v.category.toLowerCase().includes(lower) ||
        v.tags.some((t) => t.toLowerCase().includes(lower))
      );
    });
  }, [activeArea, videos]);

  return (
    <div className="px-4 sm:px-6 pt-0 pb-6 max-w-[1920px] mx-auto bg-white min-h-screen">
      {/* Curation & Taxonomy Filter Bar */}
      <div className="sticky top-14 bg-white/95 backdrop-blur-md z-20 pt-2 pb-3 mb-6 border-b border-[#E5E5E5]">
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none items-center">
          {TAXONOMY_AREAS.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => handleAreaSelect(area.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-75 select-none active:scale-95 ${
                activeArea === area.id
                  ? 'bg-[#0F0F0F] text-white shadow-sm'
                  : 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#0F0F0F] hover:scale-[1.02]'
              }`}
            >
              {area.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Grid */}
      <div className="pt-2 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
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
                    <p className="text-[11px] text-white/80 mt-0.5">{short.channel.name}</p>
                    <p className="text-[10px] text-white/60">{short.likes} likes</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
