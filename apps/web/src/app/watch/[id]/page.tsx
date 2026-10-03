'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Player from '@/components/Player';
import { ThumbsUp, ThumbsDown, Share2, BookmarkPlus, Flag, CheckCircle2 } from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const videoId = params?.id as string;

  const [likes, setLikes] = useState(1420);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [commentText, setCommentText] = useState('');

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Player & Watch Column */}
      <div className="lg:col-span-2 space-y-4">
        <Player src="/hls/sample/master.m3u8" poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop" />

        {/* Video Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          Building an Original High-Performance Video Platform from Scratch
        </h1>

        {/* Channel Info & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#232733]">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-indigo-700 flex items-center justify-center font-bold text-white text-base">
              H
            </div>
            <div>
              <div className="flex items-center gap-1 font-semibold text-slate-100 text-sm">
                Hyper Architect
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xs text-slate-400">425K subscribers</div>
            </div>
            <button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={`ml-3 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                isSubscribed
                  ? 'bg-[#1f232e] text-slate-300 hover:bg-[#282d3b]'
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#181a24] rounded-full border border-[#232733] overflow-hidden">
              <button
                onClick={() => {
                  setLikes(isLiked ? likes - 1 : likes + 1);
                  setIsLiked(!isLiked);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold hover:bg-[#232733] transition-colors ${
                  isLiked ? 'text-indigo-400' : 'text-slate-300'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{likes}</span>
              </button>
              <div className="w-px h-5 bg-[#2e3444]" />
              <button className="px-3 py-2 text-xs hover:bg-[#232733] text-slate-300 transition-colors">
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>

            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#181a24] border border-[#232733] hover:bg-[#232733] text-xs font-semibold text-slate-300 transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#181a24] border border-[#232733] hover:bg-[#232733] text-xs font-semibold text-slate-300 transition-colors">
              <BookmarkPlus className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Video Description Box */}
        <div className="bg-[#14161d] border border-[#232733] rounded-2xl p-4 text-sm text-slate-300 space-y-2">
          <div className="text-xs font-semibold text-slate-400">
            124,500 views • Premiered on Oct 2, 2026 • #VideoStreaming #SystemDesign
          </div>
          <p className="leading-relaxed">
            In this session, we architect and build VIONEX — a scalable, production-ready, self-hostable video platform
            designed with clean TypeScript, Fastify REST APIs, BullMQ asynchronous FFmpeg media processing, and WebRTC
            P2P-assisted HLS playback.
          </p>
        </div>

        {/* Comments Section */}
        <div className="space-y-4 pt-4">
          <h3 className="font-bold text-lg text-white">Comments (148)</h3>
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-800 flex items-center justify-center font-bold text-xs">
              U
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-transparent border-b border-[#2e3444] focus:border-indigo-500 py-1 text-sm text-white focus:outline-none transition-colors"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCommentText('')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  disabled={!commentText.trim()}
                  className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-bold text-white transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Recommendations Column */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-200">Recommended Videos</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 group cursor-pointer">
              <div className="w-40 aspect-video rounded-xl bg-[#1f232e] border border-[#232733] shrink-0 overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-indigo-950 group-hover:scale-105 transition-transform" />
                <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-white">
                  12:40
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs text-slate-200 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-tight">
                  High-Performance Media Transcoding Pipelines with FFmpeg #{i}
                </h4>
                <div className="text-[11px] text-slate-400 mt-1">Tech Systems Lab</div>
                <div className="text-[10px] text-slate-500">45K views • 3 days ago</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
