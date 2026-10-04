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
  ArrowRight,
  Mic,
  Plus,
  Play,
  Check,
  Trash2,
  ExternalLink,
  UploadCloud,
  LogOut,
  UserCheck
} from 'lucide-react';
import {
  getStoredVideos,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  NotificationItem
} from '@/lib/data';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(getNotifications());
    setRecentSearches(getRecentSearches());
  }, []);

  // Autocomplete matching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const all = getStoredVideos();
    const matches = new Set<string>();

    for (const v of all) {
      if (v.title.toLowerCase().includes(q)) {
        matches.add(v.title);
      }
      for (const tag of v.tags) {
        if (tag.toLowerCase().includes(q)) {
          matches.add(tag);
        }
      }
    }
    setSuggestions(Array.from(matches).slice(0, 6));
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || searchQuery;
    if (query.trim()) {
      addRecentSearch(query.trim());
      setRecentSearches(getRecentSearches());
      setShowSuggestions(false);
      router.push(`/results?search_query=${encodeURIComponent(query.trim())}`);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#E5E5E5] z-50 flex items-center justify-between px-4 select-none">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowMobileDrawer(!showMobileDrawer)}
            className="p-2 rounded-full hover:bg-[#F2F2F2] active:bg-[#E5E5E5] transition-colors text-[#0F0F0F]"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#0F0F0F]" />
          </button>

          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="w-7 h-5 rounded-md bg-[#FF0000] flex items-center justify-center shadow-sm">
              <Play className="w-3 h-3 fill-white text-white ml-0.5" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-[#0F0F0F] flex items-center">
              VIONEX
              <span className="text-[10px] font-semibold text-[#606060] ml-1 self-start tracking-normal">IN</span>
            </span>
          </Link>
        </div>

        {/* Center: Search & Voice */}
        <div ref={searchContainerRef} className="flex-1 max-w-[640px] mx-4 relative hidden sm:flex items-center">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center">
            <div className="flex flex-1 items-center bg-white border border-[#CCCCCC] focus-within:border-[#1C62B9] rounded-l-full px-4 py-1.5 shadow-inner">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-transparent text-[#0F0F0F] placeholder-[#606060] text-sm outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-[#606060] hover:text-[#0F0F0F]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#F8F8F8] hover:bg-[#F0F0F0] active:bg-[#E5E5E5] border border-l-0 border-[#CCCCCC] rounded-r-full px-6 py-2 flex items-center justify-center transition-colors text-[#0F0F0F]"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#0F0F0F]" />
            </button>
          </form>

          <button
            onClick={() => handleSearchSubmit(undefined, 'Next-Gen Streaming')}
            className="ml-3 p-2.5 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] active:bg-[#CCCCCC] transition-colors text-[#0F0F0F]"
            title="Search with voice"
            aria-label="Search with voice"
          >
            <Mic className="w-4 h-4 text-[#0F0F0F]" />
          </button>

          {/* Autocomplete & Recent Searches Dropdown */}
          {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
            <div className="absolute top-12 left-0 right-12 bg-white border border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden z-50 py-2">
              {recentSearches.length > 0 && !searchQuery && (
                <div className="px-4 py-1.5 flex items-center justify-between text-xs text-[#606060]">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Recent Searches</span>
                  <button
                    onClick={() => {
                      clearRecentSearches();
                      setRecentSearches([]);
                    }}
                    className="text-[#065FD4] hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
              {(!searchQuery ? recentSearches : suggestions).map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSearchQuery(s);
                    handleSearchSubmit(undefined, s);
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-sm text-[#0F0F0F] transition-colors"
                >
                  {!searchQuery ? (
                    <Clock className="w-4 h-4 text-[#909090] shrink-0" />
                  ) : (
                    <Search className="w-4 h-4 text-[#909090] shrink-0" />
                  )}
                  <span className="truncate">{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Create Button (YouTube style) */}
          <Link
            href="/studio"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-xs font-semibold text-[#0F0F0F] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#0F0F0F]" />
            <span className="hidden md:inline">Create</span>
          </Link>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-[#F2F2F2] active:bg-[#E5E5E5] transition-colors text-[#0F0F0F] relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-[#0F0F0F]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 px-1 min-w-[16px] h-4 bg-[#CC0000] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-[#E5E5E5] rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#E5E5E5] flex items-center justify-between">
                  <span className="font-bold text-sm text-[#0F0F0F]">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        markAllNotificationsRead();
                        setNotifications(getNotifications());
                      }}
                      className="text-xs text-[#065FD4] hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E5E5]">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        setNotifications(getNotifications());
                        if (n.videoId) router.push(`/watch/${n.videoId}`);
                      }}
                      className={`p-3 flex gap-3 hover:bg-[#F2F2F2] cursor-pointer transition-colors ${
                        n.unread ? 'bg-[#F9F9F9]' : ''
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-[#E5E5E5] shrink-0 flex items-center justify-center font-bold text-xs text-[#606060] overflow-hidden">
                        {n.avatar ? (
                          <img src={n.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <Bell className="w-4 h-4 text-[#606060]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0F0F0F] line-clamp-1">{n.title}</p>
                        <p className="text-xs text-[#606060] line-clamp-2 mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-[#909090] mt-1 block">{n.time}</span>
                      </div>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-[#065FD4] self-center shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full overflow-hidden border border-[#E5E5E5] hover:ring-2 hover:ring-[#CCCCCC] transition-all flex items-center justify-center"
              aria-label="User account"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-[#E5E5E5] rounded-2xl shadow-2xl overflow-hidden z-50 text-[#0F0F0F]">
                <div className="p-4 border-b border-[#E5E5E5] flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-[#E5E5E5]"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#0F0F0F] truncate">VIONEX Engineering</p>
                    <p className="text-xs text-[#606060] truncate">@vionex-labs</p>
                  </div>
                </div>

                <div className="py-2 divide-y divide-[#E5E5E5]">
                  <div className="py-1">
                    <Link
                      href="/channel/vionex-labs"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-xs font-medium text-[#0F0F0F]"
                    >
                      <UserCheck className="w-4 h-4 text-[#606060]" />
                      <span>Your channel</span>
                    </Link>
                    <Link
                      href="/studio"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-xs font-medium text-[#0F0F0F]"
                    >
                      <Video className="w-4 h-4 text-[#606060]" />
                      <span>VIONEX Studio</span>
                    </Link>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-xs font-medium text-[#0F0F0F]"
                    >
                      <Settings className="w-4 h-4 text-[#606060]" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      href="/help"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-xs font-medium text-[#0F0F0F]"
                    >
                      <HelpCircle className="w-4 h-4 text-[#606060]" />
                      <span>Help & Feedback</span>
                    </Link>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        alert('Signed out of VIONEX.');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F2F2F2] text-xs font-medium text-[#CC0000]"
                    >
                      <LogOut className="w-4 h-4 text-[#CC0000]" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 transition-opacity"
            onClick={() => setShowMobileDrawer(false)}
          />
          <div className="relative w-64 bg-white h-full flex flex-col p-4 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
              <Link href="/" onClick={() => setShowMobileDrawer(false)} className="flex items-center gap-1.5">
                <div className="w-7 h-5 rounded-md bg-[#FF0000] flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-[#0F0F0F]">VIONEX</span>
              </Link>
              <button
                onClick={() => setShowMobileDrawer(false)}
                className="p-1.5 rounded-full hover:bg-[#F2F2F2] text-[#0F0F0F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1 overflow-y-auto">
              {[
                { label: 'Home', href: '/', icon: Flame },
                { label: 'Shorts', href: '/shorts', icon: Film },
                { label: 'Explore', href: '/explore', icon: Compass },
                { label: 'Live', href: '/live', icon: Radio },
                { label: 'History', href: '/history', icon: History },
                { label: 'Liked Videos', href: '/liked', icon: ThumbsUp },
                { label: 'Playlists', href: '/playlists', icon: ListVideo },
                { label: 'Watch Later', href: '/watch-later', icon: Clock },
                { label: 'Studio', href: '/studio', icon: Video },
                { label: 'Settings', href: '/settings', icon: Settings },
                { label: 'Help', href: '/help', icon: HelpCircle }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowMobileDrawer(false)}
                    className="flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-[#F2F2F2] text-sm font-medium text-[#0F0F0F]"
                  >
                    <Icon className="w-5 h-5 text-[#606060]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
