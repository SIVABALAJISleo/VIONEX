'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  CheckCircle2,
  Users,
  Heart,
  Plus,
  Share2,
  Play,
  Flame,
  Search
} from 'lucide-react';
import { AUTHENTIC_CHANNELS } from '@/lib/data';

interface BroadcastChannel {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string;
  description: string;
  followersCount: string;
  isFollowing: boolean;
  posts: {
    id: string;
    content: string;
    mediaUrl?: string;
    vionexRef?: {
      title: string;
      route: string;
      thumbnailUrl: string;
    };
    viewsCount: string;
    reactions: Record<string, number>;
    timeAgo: string;
  }[];
}

const INITIAL_BROADCAST_CHANNELS: BroadcastChannel[] = [
  {
    id: 'ch-vionex-official',
    name: 'VIONEX Broadcast & System Status',
    slug: 'vionex-official',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    description: 'Official 1-way updates, core release bulletins, and engineering deep dives from the VIONEX core team.',
    followersCount: '482,000 followers',
    isFollowing: true,
    posts: [
      {
        id: 'p1',
        content: '⚡ Major platform expansion: Complete WhatsApp-equivalent Communication Ecosystem is now live natively on VIONEX with Curve25519 E2EE, LiveKit Calling, and Multi-Device verification.',
        timeAgo: '1 hour ago',
        viewsCount: '124,500',
        reactions: { '🚀': 1840, '🔥': 2950, '❤️': 940 }
      },
      {
        id: 'p2',
        content: 'Check out the new synthwave 24/7 stream online with Web Audio dynamic amplification.',
        vionexRef: {
          title: 'synthwave radio - chill beats to relax / code / study to 24/7',
          route: '/watch/vid-demo-008',
          thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop'
        },
        timeAgo: '4 hours ago',
        viewsCount: '89,200',
        reactions: { '🎧': 3120, '✨': 1420 }
      }
    ]
  },
  {
    id: 'ch-mkbhd-studio',
    name: 'MKBHD Studio Backstage',
    slug: 'mkbhd-studio',
    avatarUrl: AUTHENTIC_CHANNELS.mkbhd.avatarUrl,
    description: 'Exclusive camera gear teasers, behind the scenes, and tech releases from Marques Brownlee.',
    followersCount: '1.2M followers',
    isFollowing: false,
    posts: [
      {
        id: 'p3',
        content: 'The 4K cinematic action camera test video is up on the channel! Check it out below.',
        vionexRef: {
          title: 'View From A Blue Moon: 4K Cinematic Action Camera Breakdown',
          route: '/watch/vid-demo-002',
          thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop'
        },
        timeAgo: 'Yesterday',
        viewsCount: '342,000',
        reactions: { '🔥': 4890, '🎥': 2340 }
      }
    ]
  }
];

export default function ChannelsPage() {
  const [channels, setChannels] = useState<BroadcastChannel[]>(INITIAL_BROADCAST_CHANNELS);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFollow = (id: string) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, isFollowing: !ch.isFollowing } : ch));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white min-h-[calc(100vh-3.5rem)] select-none">
      <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5] mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F0F] tracking-tight">Channels</h1>
          <p className="text-xs text-[#606060] mt-1">
            Stay updated on topics you care about. Followers are completely private.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-black text-white text-sm font-semibold transition-transform active:scale-95 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Create Channel</span>
        </button>
      </div>

      {/* Channel Feeds */}
      <div className="space-y-8">
        {channels.map((ch) => (
          <div key={ch.id} className="rounded-2xl border border-[#E5E5E5] overflow-hidden bg-white shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-[#F2F2F2] flex items-center justify-between bg-neutral-50/50">
              <div className="flex items-center gap-3">
                <img src={ch.avatarUrl} alt={ch.name} className="w-12 h-12 rounded-full object-cover border border-neutral-200" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-bold text-sm text-[#0F0F0F]">{ch.name}</h2>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#065FD4] fill-current text-white" />
                  </div>
                  <span className="text-xs text-[#606060]">{ch.followersCount}</span>
                </div>
              </div>

              <button
                onClick={() => toggleFollow(ch.id)}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  ch.isFollowing
                    ? 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#0F0F0F]'
                    : 'bg-[#0F0F0F] hover:bg-black text-white shadow-sm'
                }`}
              >
                {ch.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Posts */}
            <div className="p-4 space-y-4">
              {ch.posts.map(p => (
                <div key={p.id} className="p-4 rounded-xl bg-neutral-50/80 border border-[#E5E5E5]">
                  <p className="text-sm text-[#0F0F0F] leading-relaxed mb-3 whitespace-pre-wrap">{p.content}</p>

                  {p.vionexRef && (
                    <Link
                      href={p.vionexRef.route}
                      className="block mb-3 rounded-xl overflow-hidden border border-[#E5E5E5] bg-white group hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-video">
                        <img src={p.vionexRef.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <p className="font-bold text-xs text-[#0F0F0F] truncate">{p.vionexRef.title}</p>
                        <span className="text-[10px] text-[#065FD4] font-semibold">Watch on VIONEX</span>
                      </div>
                    </Link>
                  )}

                  <div className="flex items-center justify-between border-t border-neutral-200/60 pt-2.5 text-xs text-[#606060]">
                    <div className="flex items-center gap-2">
                      {Object.entries(p.reactions).map(([emoji, count]) => (
                        <span key={emoji} className="bg-white px-2 py-0.5 rounded-full border border-neutral-200 text-xs font-semibold flex items-center gap-1">
                          <span>{emoji}</span>
                          <span className="text-[11px]">{count}</span>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono">
                      <span>{p.viewsCount} views</span>
                      <span>{p.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
