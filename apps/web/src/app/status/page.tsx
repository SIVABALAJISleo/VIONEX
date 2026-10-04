'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Play,
  Clock,
  Eye,
  Heart,
  Flame,
  CheckCircle2,
  ChevronRight,
  X,
  Send,
  Lock
} from 'lucide-react';
import { AUTHENTIC_CHANNELS } from '@/lib/data';

interface StatusStory {
  id: string;
  authorName: string;
  authorAvatar: string;
  isVerified: boolean;
  timeAgo: string;
  mediaUrl: string;
  caption: string;
  vionexRef?: {
    title: string;
    route: string;
  };
  hasViewed: boolean;
  viewsCount: number;
}

const INITIAL_STORIES: StatusStory[] = [
  {
    id: 's-mkbhd',
    authorName: 'Marques Brownlee',
    authorAvatar: AUTHENTIC_CHANNELS.mkbhd.avatarUrl,
    isVerified: true,
    timeAgo: '2 hours ago',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop',
    caption: 'Setting up RED 6K cameras on helicopter gimbals for sunset shots 🚁🎬',
    vionexRef: {
      title: 'View From A Blue Moon: 4K Cinematic Action Camera Breakdown',
      route: '/watch/vid-demo-002'
    },
    hasViewed: false,
    viewsCount: 1420
  },
  {
    id: 's-fireship',
    authorName: 'Fireship',
    authorAvatar: AUTHENTIC_CHANNELS.fireship.avatarUrl,
    isVerified: true,
    timeAgo: '4 hours ago',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1280&auto=format&fit=crop',
    caption: 'Testing 120 FPS object classification directly in Chrome WebGPU runtime ⚡',
    vionexRef: {
      title: 'Real-Time Edge AI & Object Detection with YOLOv10 in 100 Seconds',
      route: '/watch/vid-demo-003'
    },
    hasViewed: false,
    viewsCount: 2890
  },
  {
    id: 's-lofi',
    authorName: 'Lofi Girl',
    authorAvatar: AUTHENTIC_CHANNELS.lofigirl.avatarUrl,
    isVerified: true,
    timeAgo: '6 hours ago',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop',
    caption: 'New synthwave melodies stream online now. Perfect for late-night code sessions.',
    vionexRef: {
      title: 'synthwave radio - chill beats to relax / code / study to 24/7',
      route: '/watch/vid-demo-008'
    },
    hasViewed: true,
    viewsCount: 8420
  }
];

export default function StatusPage() {
  const [stories, setStories] = useState<StatusStory[]>(INITIAL_STORIES);
  const [activeStory, setActiveStory] = useState<StatusStory | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress(p => {
          if (p >= 100) {
            setActiveStory(null);
            return 0;
          }
          return p + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  const handleOpenStory = (story: StatusStory) => {
    setActiveStory(story);
    setStories(prev => prev.map(s => s.id === story.id ? { ...s, hasViewed: true } : s));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white min-h-[calc(100vh-3.5rem)] select-none">
      <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5] mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F0F] tracking-tight">Status & Stories</h1>
          <p className="text-xs text-[#606060] mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Updates disappear after 24 hours. Protected by server-enforced audience ACL.</span>
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F0F0F] hover:bg-black text-white text-sm font-semibold transition-transform active:scale-95 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New Status</span>
        </button>
      </div>

      {/* Stories Tray */}
      <div className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#606060] mb-4">Recent Updates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stories.map(s => (
            <div
              key={s.id}
              onClick={() => handleOpenStory(s)}
              className="group p-4 rounded-2xl border border-[#E5E5E5] hover:border-neutral-400 bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-0.5 rounded-full ${s.hasViewed ? 'ring-2 ring-neutral-300' : 'ring-2 ring-[#065FD4]'}`}>
                  <img
                    src={s.authorAvatar}
                    alt={s.authorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-[#0F0F0F]">{s.authorName}</span>
                    {s.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#065FD4] fill-current text-white" />}
                  </div>
                  <span className="text-xs text-[#606060]">{s.timeAgo}</span>
                </div>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-neutral-100">
                <img src={s.mediaUrl} alt="Status media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>

              <p className="text-xs text-[#0F0F0F] line-clamp-2 leading-relaxed mb-2 font-medium">
                {s.caption}
              </p>

              <div className="flex items-center justify-between text-xs text-[#606060] border-t border-[#F2F2F2] pt-2">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{s.viewsCount} views</span>
                </span>
                <span className="text-xs font-semibold text-[#065FD4] group-hover:underline flex items-center">
                  <span>View</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="relative max-w-sm w-full aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-black border border-neutral-800 flex flex-col justify-between text-white p-4">
            {/* Top Progress Bar */}
            <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden mb-3">
              <div
                className="bg-white h-full transition-all duration-100"
                style={{ width: `${storyProgress}%` }}
              />
            </div>

            {/* Author Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.authorAvatar}
                  alt={activeStory.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-white/40"
                />
                <div>
                  <p className="text-sm font-bold text-white leading-tight">{activeStory.authorName}</p>
                  <span className="text-[11px] text-white/70">{activeStory.timeAgo}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveStory(null)}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Background */}
            <img
              src={activeStory.mediaUrl}
              alt="Story"
              className="absolute inset-0 w-full h-full object-cover -z-10"
            />

            {/* Bottom Caption & VIONEX Video Link */}
            <div className="z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 -mx-4 -mb-4 rounded-b-3xl">
              {activeStory.vionexRef && (
                <Link
                  href={activeStory.vionexRef.route}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 mb-3 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FF0000] flex items-center justify-center flex-shrink-0">
                    <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                  </div>
                  <span className="text-xs font-semibold truncate text-white">
                    Watch: {activeStory.vionexRef.title}
                  </span>
                </Link>
              )}

              <p className="text-sm text-white font-medium mb-3 leading-snug">
                {activeStory.caption}
              </p>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Reply to status..."
                  className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-white/60 outline-none"
                />
                <button className="p-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
