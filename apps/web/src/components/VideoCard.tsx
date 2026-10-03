'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

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
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = Math.floor(sec % 60);
    return `${mins}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group flex flex-col gap-3">
      {/* Thumbnail Container */}
      <Link
        href={isShort ? `/shorts?id=${id}` : `/watch/${id}`}
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#1f232e] border border-[#232733] group-hover:border-indigo-500/50 transition-all shadow-md"
      >
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{
            backgroundImage: thumbnailUrl
              ? `url(${thumbnailUrl})`
              : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
          }}
        />
        {duration > 0 && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-semibold text-white tracking-wide">
            {formatDuration(duration)}
          </span>
        )}
      </Link>

      {/* Meta Details */}
      <div className="flex gap-3 items-start px-0.5">
        <Link href={`/channel/${channel.handle}`} className="shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-full bg-indigo-900 border border-[#3b4252] flex items-center justify-center text-xs font-bold text-indigo-300">
            {channel.name.charAt(0).toUpperCase()}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/watch/${id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 text-slate-100 group-hover:text-indigo-400 transition-colors leading-snug">
              {title}
            </h3>
          </Link>
          <Link
            href={`/channel/${channel.handle}`}
            className="flex items-center gap-1 mt-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="truncate">{channel.name}</span>
            {channel.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
          </Link>
          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <span>{typeof viewsCount === 'number' ? viewsCount.toLocaleString() : viewsCount} views</span>
            <span>•</span>
            <span>{publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Just now'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
