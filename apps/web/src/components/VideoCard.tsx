'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  MoreVertical,
  Clock,
  ListPlus,
  Share2,
  Check,
  EyeOff
} from 'lucide-react';
import { toggleWatchLater, isWatchLater, formatNumber } from '@/lib/data';

export interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  duration?: number;
  channel: {
    handle: string;
    name: string;
    avatarUrl?: string | null;
    isVerified?: boolean;
  };
  viewsCount: string | number;
  publishedAt?: string | null;
  isShort?: boolean;
}

export default function VideoCard({
  id,
  title,
  thumbnailUrl,
  duration = 0,
  channel,
  viewsCount,
  publishedAt,
  isShort = false
}: VideoCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [inWatchLater, setInWatchLater] = useState(isWatchLater(id));
  const [copied, setCopied] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = Math.floor(sec % 60);
    return `${mins}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleToggleWatchLater = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleWatchLater(id);
    setInWatchLater(next);
    setShowMenu(false);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/watch/${id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowMenu(false);
    }
  };

  if (isHidden) {
    return (
      <div className="p-4 bg-[#F2F2F2] rounded-xl flex items-center justify-between text-xs text-[#606060]">
        <span>Video hidden</span>
        <button onClick={() => setIsHidden(false)} className="text-[#065FD4] font-medium hover:underline">
          Undo
        </button>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-3 relative select-none">
      {/* Thumbnail Container */}
      <Link
        href={isShort ? `/shorts?id=${id}` : `/watch/${id}`}
        className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#E5E5E5] group-hover:rounded-none transition-all duration-200 shadow-sm"
      >
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{
            backgroundImage: thumbnailUrl
              ? `url(${thumbnailUrl})`
              : 'linear-gradient(135deg, #E5E5E5 0%, #CCCCCC 100%)'
          }}
        />
        {duration > 0 && (
          <span className="absolute bottom-1.5 right-1.5 px-1 py-0.5 rounded bg-black/85 text-[11px] font-medium text-white tracking-tight">
            {formatDuration(duration)}
          </span>
        )}
      </Link>

      {/* Meta Details */}
      <div className="flex gap-3 items-start px-0.5">
        <Link href={`/channel/${channel.handle}`} className="shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E5E5E5] bg-[#F2F2F2] flex items-center justify-center text-xs font-bold text-[#0F0F0F]">
            {channel.avatarUrl ? (
              <img src={channel.avatarUrl} alt={channel.name} className="w-full h-full object-cover" />
            ) : (
              channel.name.charAt(0).toUpperCase()
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={isShort ? `/shorts?id=${id}` : `/watch/${id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 text-[#0F0F0F] leading-tight group-hover:text-[#0F0F0F]">
              {title}
            </h3>
          </Link>
          <Link
            href={`/channel/${channel.handle}`}
            className="flex items-center gap-1 text-xs text-[#606060] hover:text-[#0F0F0F] mt-1 transition-colors"
          >
            <span className="truncate">{channel.name}</span>
            {channel.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#606060] shrink-0" />}
          </Link>
          <p className="text-xs text-[#606060] mt-0.5" suppressHydrationWarning>
            {typeof viewsCount === 'number' ? `${formatNumber(viewsCount)} views` : viewsCount} • {publishedAt || 'Recently'}
          </p>
        </div>

        {/* 3-Dots Menu Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-[#F2F2F2] text-[#0F0F0F] transition-opacity"
            aria-label="Action menu"
          >
            <MoreVertical className="w-4 h-4 text-[#0F0F0F]" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white border border-[#E5E5E5] rounded-xl shadow-xl py-1 z-30 text-xs text-[#0F0F0F]">
              <button
                onClick={handleToggleWatchLater}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F2F2F2] transition-colors"
              >
                <Clock className="w-4 h-4 text-[#606060]" />
                <span>{inWatchLater ? 'Remove from Watch Later' : 'Save to Watch Later'}</span>
              </button>
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F2F2F2] transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#606060]" />
                <span>{copied ? 'Link copied!' : 'Share'}</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsHidden(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F2F2F2] transition-colors text-[#606060]"
              >
                <EyeOff className="w-4 h-4 text-[#606060]" />
                <span>Not interested</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
