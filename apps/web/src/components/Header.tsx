'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  User,
  Video,
  Menu,
  X,
  Compass,
  History,
  ThumbsUp,
  Clock,
  Settings,
  HelpCircle,
  Radio,
  Flame,
  Film,
  ListVideo,
  ArrowRight
} from 'lucide-react';
import { getStoredVideos } from '@/lib/data';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'New Upload from VIONEX Architecture',
      desc: 'Deep Dive: WebRTC P2P Mesh with HLS Adaptive Bitrate is now streaming.',
      time: '10m ago',
      unread: true
    },
    {
      id: '2',
      title: 'Comment Hearted',
      desc: 'TechLead gave your comment on HLS GOP Alignment a heart!',
      time: '1h ago',
      unread: true
    },
    {
      id: '3',
      title: 'Studio Milestone Reached',
      desc: 'Your channel surpassed 425,000 subscribers! View real-time analytics.',
      time: '5h ago',
      unread: false
    }
  ]);

  // Autocomplete matching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const all = getStoredVideos();
    const candidateSet = new Set<string>();

    all.forEach((v) => {
      if (v.title.toLowerCase().includes(q)) candidateSet.add(v.title);
      if (v.channel.name.toLowerCase().includes(q)) candidateSet.add(v.channel.name);
      v.tags.forEach((t) => {
        if (t.toLowerCase().includes(q)) candidateSet.add(t);
      });
    });

    // Add common technology queries if matched
    ['Adaptive Bitrate', 'HLS Stream', 'WebRTC P2P', 'Creator Studio', 'FFmpeg Transcoding'].forEach((item) => {
      if (item.toLowerCase().includes(q)) candidateSet.add(item);
    });

    setSuggestions(Array.from(candidateSet).slice(0, 6));
  }, [searchQuery]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/results?search_query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (s: string) => {
    setSearchQuery(s);
    setShowSuggestions(false);
    router.push(`/results?search_query=${encodeURIComponent(s)}`);
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const hasUnread = notifications.some((n) => n.unread);

  const navLinks = [
    { label: 'Home', href: '/', icon: Flame },
    { label: 'Shorts', href: '/shorts', icon: Film },
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Live Now', href: '/live', icon: Radio },
    { type: 'divider' },
    { label: 'History', href: '/history', icon: History },
    { label: 'Watch Later', href: '/watch-later', icon: Clock },
    { label: 'Liked Videos', href: '/liked', icon: ThumbsUp },
    { label: 'Playlists', href: '/playlists', icon: ListVideo },
    { type: 'divider' },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Help & Support', href: '/help', icon: HelpCircle }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#14161d]/90 backdrop-blur-md border-b border-[#232733] z-50 px-4 flex items-center justify-between">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMobileDrawer(!showMobileDrawer)}
            className="p-2 hover:bg-[#1f232e] rounded-full transition-colors text-slate-300 lg:hidden"
            aria-label="Toggle menu"
          >
            {showMobileDrawer ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              VIONEX
            </span>
          </Link>
        </div>

        {/* Global Search Input with Autocomplete */}
        <div ref={searchContainerRef} className="flex-1 max-w-xl mx-4 hidden sm:block relative">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Search videos, channels, topics..."
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full h-10 pl-4 pr-10 bg-[#0b0c10] border border-[#232733] focus:border-indigo-500 rounded-l-full text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-5 bg-[#1f232e] hover:bg-[#282d3b] border border-l-0 border-[#232733] rounded-r-full flex items-center justify-center text-slate-300 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-11 inset-x-0 bg-[#14161d] border border-[#2e3444] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in overflow-hidden">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full text-left px-4 py-2 hover:bg-[#1f232e] text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                    <span className="truncate">{s}</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 shrink-0 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          <Link
            href="/studio"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1f232e] hover:bg-[#282d3b] border border-[#2e3444] rounded-full text-xs font-semibold text-slate-200 transition-colors"
          >
            <Video className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Studio</span>
          </Link>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="p-2 hover:bg-[#1f232e] rounded-full text-slate-300 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
              )}
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#14161d] border border-[#2e3444] rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-[#232733] pb-2">
                  <h3 className="font-bold text-sm text-white">Notifications</h3>
                  {hasUnread && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-indigo-400 hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs transition-colors ${
                        n.unread ? 'bg-[#1e2230] border border-indigo-500/30' : 'bg-[#181a24]/50'
                      }`}
                    >
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{n.time}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white border border-[#3b4252] shadow-sm hover:scale-105 transition-transform"
              aria-label="User Account Menu"
            >
              <User className="w-4 h-4" />
            </button>

            {/* User Popover Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 bg-[#14161d] border border-[#2e3444] rounded-2xl shadow-2xl p-2 z-50 space-y-1">
                <div className="p-3 border-b border-[#232733] space-y-0.5">
                  <div className="font-bold text-sm text-white">Creator Studio</div>
                  <div className="text-xs text-slate-400 font-mono">@creator</div>
                </div>

                <Link
                  href="/channel/creator"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#181a24] transition-colors"
                >
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>My Channel</span>
                </Link>

                <Link
                  href="/studio"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#181a24] transition-colors"
                >
                  <Video className="w-4 h-4 text-pink-400" />
                  <span>Creator Studio</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#181a24] transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>

                <Link
                  href="/help"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#181a24] transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Help & Feedback</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {showMobileDrawer && (
        <div className="fixed inset-0 top-14 bg-black/80 backdrop-blur-sm z-40 lg:hidden flex">
          <div className="w-72 bg-[#14161d] border-r border-[#232733] h-full p-4 overflow-y-auto space-y-1">
            {navLinks.map((item, idx) => {
              if (item.type === 'divider') {
                return <div key={`div-${idx}`} className="my-3 border-t border-[#232733]" />;
              }
              const Icon = item.icon!;
              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={() => setShowMobileDrawer(false)}
                  className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-[#1f232e] hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex-1" onClick={() => setShowMobileDrawer(false)} />
        </div>
      )}
    </>
  );
}
