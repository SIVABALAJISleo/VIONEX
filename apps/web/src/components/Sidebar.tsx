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
  Flame,
  Music,
  Gamepad2,
  Newspaper,
  UserCheck,
  MessageSquare,
  Phone,
  CircleDashed,
  Users,
  Megaphone,
  Briefcase
} from 'lucide-react';
import { AUTHENTIC_CHANNELS } from '@/lib/data';

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
    { label: 'Your Channel', href: '/channel/vionex', icon: UserCheck },
  ];


  const commLinks = [
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Calls', href: '/calls', icon: Phone },
    { label: 'Status', href: '/status', icon: CircleDashed },
    { label: 'Communities', href: '/communities', icon: Users },
    { label: 'Channels', href: '/channels', icon: Megaphone },
    { label: 'Business', href: '/business', icon: Briefcase },
  ];
  const exploreLinks = [
    { label: 'Trending', href: '/explore', icon: Flame },
    { label: 'Music', href: '/explore', icon: Music },
    { label: 'Gaming', href: '/explore', icon: Gamepad2 },
    { label: 'News', href: '/explore', icon: Newspaper },
  ];

  // Authentic creator channels with verified avatars
  const subscribedChannels = [
    {
      handle: AUTHENTIC_CHANNELS.mkbhd.handle,
      name: AUTHENTIC_CHANNELS.mkbhd.name,
      avatarUrl: AUTHENTIC_CHANNELS.mkbhd.avatarUrl,
      hasNew: true
    },
    {
      handle: AUTHENTIC_CHANNELS.fireship.handle,
      name: AUTHENTIC_CHANNELS.fireship.name,
      avatarUrl: AUTHENTIC_CHANNELS.fireship.avatarUrl,
      hasNew: true
    },
    {
      handle: AUTHENTIC_CHANNELS.veritasium.handle,
      name: AUTHENTIC_CHANNELS.veritasium.name,
      avatarUrl: AUTHENTIC_CHANNELS.veritasium.avatarUrl,
      hasNew: false
    },
    {
      handle: AUTHENTIC_CHANNELS.kurzgesagt.handle,
      name: AUTHENTIC_CHANNELS.kurzgesagt.name,
      avatarUrl: AUTHENTIC_CHANNELS.kurzgesagt.avatarUrl,
      hasNew: true
    },
    {
      handle: AUTHENTIC_CHANNELS.vionex.handle,
      name: AUTHENTIC_CHANNELS.vionex.name,
      avatarUrl: AUTHENTIC_CHANNELS.vionex.avatarUrl,
      hasNew: false
    }
  ];

  return (
    <aside className="w-60 bg-white border-r border-[#E5E5E5] hidden lg:flex flex-col py-3 px-3 shrink-0 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto select-none">
      {/* 1. Main Navigation */}
      <div className="space-y-0.5 pb-3 border-b border-[#E5E5E5]">
        {mainLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`flex items-center gap-5 px-3 py-2 rounded-xl text-sm transition-all duration-75 cursor-pointer active:scale-[0.98] ${
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
              prefetch={true}
              className={`flex items-center gap-5 px-3 py-2 rounded-xl text-sm transition-all duration-75 cursor-pointer active:scale-[0.98] ${
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
            prefetch={true}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-[#0F0F0F] hover:bg-[#F2F2F2] transition-all duration-75 group cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={ch.avatarUrl}
                alt={ch.name}
                className="w-6 h-6 rounded-full object-cover shrink-0 border border-[#E5E5E5]"
              />
              <span className="truncate text-xs font-medium text-[#0F0F0F]">{ch.name}</span>
            </div>
            {ch.hasNew && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#065FD4] shrink-0" />
            )}
          </Link>
        ))}
      </div>

      {/* 4. Explore Section */}
      <div className="pt-3 pb-3 space-y-0.5">
        <div className="px-3 py-1 text-xs font-bold text-[#0F0F0F] uppercase tracking-wider">
          Explore
        </div>
        {exploreLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              prefetch={true}
              className="flex items-center gap-5 px-3 py-2 rounded-xl text-sm text-[#0F0F0F] hover:bg-[#F2F2F2] transition-all duration-75 cursor-pointer active:scale-[0.98]"
            >
              <Icon className="w-5 h-5 text-[#0F0F0F]" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-4 px-3 text-[11px] text-[#909090] space-y-2 border-t border-[#E5E5E5]">
        <p className="leading-relaxed">About Press Copyright Contact us Creators Advertise</p>
        <p className="leading-relaxed">Terms Privacy Policy & Safety How VIONEX works</p>
        <p className="text-[10px] text-[#AAAAAA] pt-1">© 2026 VIONEX LLC</p>
      </div>
    </aside>
  );
}
