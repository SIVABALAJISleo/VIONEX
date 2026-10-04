'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Film,
  Radio,
  History,
  Clock,
  ThumbsUp,
  ListVideo,
  Settings,
  HelpCircle,
  Video,
  Flame,
  Music,
  Gamepad2,
  Newspaper,
  UserCheck
} from 'lucide-react';
import { getSubscriptions, INITIAL_VIDEOS } from '@/lib/data';

export default function Sidebar() {
  const pathname = usePathname();

  const mainLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shorts', href: '/shorts', icon: Film },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Live', href: '/live', icon: Radio },
  ];

  const youLinks = [
    { label: 'History', href: '/history', icon: History },
    { label: 'Playlists', href: '/playlists', icon: ListVideo },
    { label: 'Watch Later', href: '/watch-later', icon: Clock },
    { label: 'Liked Videos', href: '/liked', icon: ThumbsUp },
    { label: 'Your Channel', href: '/channel/vionex-labs', icon: UserCheck },
  ];

  const exploreLinks = [
    { label: 'Trending', href: '/explore', icon: Flame },
    { label: 'Music', href: '/explore', icon: Music },
    { label: 'Gaming', href: '/explore', icon: Gamepad2 },
    { label: 'News', href: '/explore', icon: Newspaper },
  ];

  // Subscribed channels list with avatars
  const subscribedChannels = [
    {
      handle: 'vionex-labs',
      name: 'VIONEX Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      hasNew: true
    },
    {
      handle: 'stream-engineering',
      name: 'Stream Engineering Lab',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
      hasNew: false
    },
    {
      handle: 'hardware-benchmark',
      name: 'Hardware Foundry',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=100&auto=format&fit=crop',
      hasNew: true
    }
  ];

  return (
    <aside className="w-60 bg-white border-r border-[#E5E5E5] hidden lg:flex flex-col py-3 px-3 shrink-0 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto">
      {/* 1. Main Navigation */}
      <div className="space-y-0.5 pb-3 border-b border-[#E5E5E5]">
        {mainLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-5 px-3 py-2 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                  : 'text-[#0F0F0F] hover:bg-[#F2F2F2] font-normal'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#0F0F0F] stroke-[2.5]' : 'text-[#0F0F0F]'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* 2. You Section */}
      <div className="pt-3 pb-3 border-b border-[#E5E5E5] space-y-0.5">
        <div className="px-3 py-1 text-xs font-bold text-[#0F0F0F] uppercase tracking-wider">
          You
        </div>
        {youLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-5 px-3 py-2 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
                  : 'text-[#0F0F0F] hover:bg-[#F2F2F2] font-normal'
              }`}
            >
              <Icon className="w-5 h-5 text-[#0F0F0F]" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* 3. Subscriptions Section */}
      <div className="pt-3 pb-3 border-b border-[#E5E5E5] space-y-0.5">
        <div className="px-3 py-1 text-xs font-bold text-[#0F0F0F] uppercase tracking-wider">
          Subscriptions
        </div>
        {subscribedChannels.map((ch) => (
          <Link
            key={ch.handle}
            href={`/channel/${ch.handle}`}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-[#0F0F0F] hover:bg-[#F2F2F2] transition-colors group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={ch.avatarUrl}
                alt={ch.name}
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
              <span className="truncate text-xs font-medium text-[#0F0F0F]">{ch.name}</span>
            </div>
            {ch.hasNew && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#065FD4] shrink-0 ml-1" />
            )}
          </Link>
        ))}
      </div>

      {/* 4. Explore Section */}
      <div className="pt-3 pb-3 border-b border-[#E5E5E5] space-y-0.5">
        <div className="px-3 py-1 text-xs font-bold text-[#0F0F0F] uppercase tracking-wider">
          Explore
        </div>
        {exploreLinks.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center gap-5 px-3 py-2 rounded-xl text-sm text-[#0F0F0F] hover:bg-[#F2F2F2] font-normal transition-colors"
            >
              <Icon className="w-5 h-5 text-[#0F0F0F]" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* 5. More from VIONEX */}
      <div className="pt-3 pb-3 border-b border-[#E5E5E5] space-y-0.5">
        <div className="px-3 py-1 text-xs font-bold text-[#0F0F0F] uppercase tracking-wider">
          More from VIONEX
        </div>
        <Link
          href="/studio"
          className={`flex items-center gap-5 px-3 py-2 rounded-xl text-sm transition-colors ${
            pathname === '/studio'
              ? 'bg-[#F2F2F2] text-[#0F0F0F] font-semibold'
              : 'text-[#0F0F0F] hover:bg-[#F2F2F2] font-normal'
          }`}
        >
          <Video className="w-5 h-5 text-[#FF0000]" />
          <span className="truncate">VIONEX Studio</span>
        </Link>
      </div>

      {/* 6. Settings & Help */}
      <div className="pt-3 space-y-0.5 pb-4">
        <Link
          href="/settings"
          className="flex items-center gap-5 px-3 py-2 rounded-xl text-sm text-[#0F0F0F] hover:bg-[#F2F2F2] font-normal transition-colors"
        >
          <Settings className="w-5 h-5 text-[#0F0F0F]" />
          <span>Settings</span>
        </Link>
        <Link
          href="/help"
          className="flex items-center gap-5 px-3 py-2 rounded-xl text-sm text-[#0F0F0F] hover:bg-[#F2F2F2] font-normal transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-[#0F0F0F]" />
          <span>Help & Feedback</span>
        </Link>

        {/* Footer info */}
        <div className="px-3 pt-4 text-[11px] text-[#909090] space-y-1">
          <p>© 2026 VIONEX Inc.</p>
          <p>High-Performance Video Platform</p>
        </div>
      </div>
    </aside>
  );
}
