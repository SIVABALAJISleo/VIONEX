'use client';

import React, { useState } from 'react';
import VideoCard from '@/components/VideoCard';

const CATEGORIES = ['All', 'Technology', 'Coding', 'Music', 'Gaming', 'Science', 'Live', 'Shorts'];

const DEMO_VIDEOS = [
  {
    id: 'vid-demo-001',
    title: 'Building a Full-Scale YouTube Platform from Scratch with Next.js & Fastify',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop',
    duration: 1845,
    channel: {
      handle: 'hyper-architect',
      name: 'Hyper Architect',
      isVerified: true
    },
    viewsCount: '124,500',
    publishedAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'vid-demo-002',
    title: 'Ultra-Low Latency Live Streaming with Node.js, RTMP, and WebRTC Datachannels',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1280&auto=format&fit=crop',
    duration: 920,
    channel: {
      handle: 'stream-engineering',
      name: 'Stream Engineering',
      isVerified: true
    },
    viewsCount: '89,200',
    publishedAt: '2026-10-01T15:30:00Z'
  },
  {
    id: 'vid-demo-003',
    title: 'Adaptive Bitrate Transcoding Deep Dive: Aligned Keyframes and HLS Profiles',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1280&auto=format&fit=crop',
    duration: 1420,
    channel: {
      handle: 'media-systems',
      name: 'Media Systems Lab',
      isVerified: true
    },
    viewsCount: '45,100',
    publishedAt: '2026-09-29T18:00:00Z'
  },
  {
    id: 'vid-demo-004',
    title: 'Zero-Cost Deployment Guide: Oracle Always Free & Scalable S3/R2 Architecture',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1280&auto=format&fit=crop',
    duration: 2110,
    channel: {
      handle: 'devops-pro',
      name: 'DevOps & SRE Masterclass',
      isVerified: true
    },
    viewsCount: '210,000',
    publishedAt: '2026-09-28T12:00:00Z'
  }
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'bg-[#181a24] hover:bg-[#232733] text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {DEMO_VIDEOS.map((video) => (
          <VideoCard key={video.id} {...video} />
        ))}
      </div>
    </div>
  );
}
