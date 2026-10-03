'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Video, Bell, User, Menu, Flame } from 'lucide-react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/results?search_query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#14161d]/90 backdrop-blur-md border-b border-[#232733] z-50 px-4 flex items-center justify-between">
      {/* Brand & Menu */}
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-[#1f232e] rounded-full transition-colors text-slate-300">
          <Menu className="w-5 h-5" />
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

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden sm:flex items-center">
        <div className="relative w-full flex items-center">
          <input
            type="text"
            placeholder="Search videos, channels, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Action Shortcuts */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/studio"
          className="flex items-center gap-2 px-3 py-1.5 bg-[#1f232e] hover:bg-[#282d3b] border border-[#2e3444] rounded-full text-xs font-semibold text-slate-200 transition-colors"
        >
          <Video className="w-4 h-4 text-indigo-400" />
          <span className="hidden md:inline">Create</span>
        </Link>

        <button className="p-2 hover:bg-[#1f232e] rounded-full text-slate-300 relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>

        <Link
          href="/channel/creator"
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white border border-[#3b4252] shadow-sm"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
