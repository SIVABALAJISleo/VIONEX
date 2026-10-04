'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThumbsUp, Play, Trash2, X } from 'lucide-react';
import { getLikedVideos, toggleLikeVideo, VideoItem } from '@/lib/data';

export default function LikedVideosPage() {
  const [likedVideos, setLikedVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    setLikedVideos(getLikedVideos());
  }, []);

  const handleRemoveLike = (id: string) => {
    toggleLikeVideo(id);
    setLikedVideos(getLikedVideos());
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white text-[#0F0F0F] min-h-[80vh]">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Playlist Header Card (YouTube Style) */}
        <div className="w-full md:w-80 bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-2xl p-6 text-white space-y-4 shrink-0 shadow-lg">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/40 relative">
            {likedVideos[0] ? (
              <img src={likedVideos[0].thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ThumbsUp className="w-12 h-12 text-white/50" />
              </div>
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold">Liked videos</h1>
            <p className="text-xs text-slate-300 mt-1">VIONEX User • {likedVideos.length} videos</p>
          </div>

          {likedVideos.length > 0 && (
            <Link
              href={`/watch/${likedVideos[0].id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Play all</span>
            </Link>
          )}
        </div>

        {/* Right: Video List */}
        <div className="flex-1 space-y-4 w-full">
          {likedVideos.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ThumbsUp className="w-12 h-12 text-[#909090] mx-auto" />
              <p className="text-sm font-semibold text-[#0F0F0F]">No liked videos yet.</p>
              <p className="text-xs text-[#606060]">Videos you like will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-[#E5E5E5]">
              {likedVideos.map((video, idx) => (
                <div key={video.id} className="pt-4 flex gap-4 items-center group">
                  <span className="text-xs font-bold text-[#606060] w-4 text-center">{idx + 1}</span>
                  <Link
                    href={`/watch/${video.id}`}
                    className="relative aspect-video w-36 sm:w-48 shrink-0 rounded-xl overflow-hidden bg-[#E5E5E5] shadow-sm"
                  >
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/85 text-[10px] font-medium text-white">
                      {video.durationFormatted}
                    </span>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/watch/${video.id}`}>
                        <h3 className="font-semibold text-xs sm:text-sm text-[#0F0F0F] line-clamp-2 leading-snug hover:text-[#065FD4]">
                          {video.title}
                        </h3>
                      </Link>
                      <button
                        onClick={() => handleRemoveLike(video.id)}
                        className="p-1 rounded-full hover:bg-[#F2F2F2] text-[#606060] hover:text-[#0F0F0F]"
                        title="Remove from Liked videos"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <Link
                      href={`/channel/${video.channel.handle}`}
                      className="text-xs text-[#606060] hover:text-[#0F0F0F] mt-1 block"
                    >
                      {video.channel.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
