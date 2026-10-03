'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Film, Radio, History, Clock, ThumbsUp, ListVideo, Settings, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shorts', href: '/shorts', icon: Film },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Live', href: '/live', icon: Radio },
    { type: 'divider' },
    { label: 'History', href: '/history', icon: History },
    { label: 'Watch Later', href: '/watch-later', icon: Clock },
    { label: 'Liked Videos', href: '/liked', icon: ThumbsUp },
    { label: 'Playlists', href: '/playlists', icon: ListVideo },
    { type: 'divider' },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Help & Feedback', href: '/help', icon: HelpCircle }
  ];

  return (
    <aside className="w-60 bg-[#14161d] border-r border-[#232733] hidden lg:flex flex-col py-4 px-2 shrink-0">
      <div className="space-y-1">
        {links.map((item, idx) => {
          if (item.type === 'divider') {
            return <div key={`div-${idx}`} className="my-3 border-t border-[#232733]" />;
          }
          const Icon = item.icon!;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 font-semibold'
                  : 'text-slate-300 hover:bg-[#1f232e] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
