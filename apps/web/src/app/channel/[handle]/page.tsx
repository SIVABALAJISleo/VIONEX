'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Bell, Share2, Play, ListVideo, Film, Info } from 'lucide-react';
import { INITIAL_VIDEOS, INITIAL_SHORTS, getSubscriptions, toggleSubscription, VideoItem } from '@/lib/data';

export default function ChannelPage() {
  const params = useParams();
  const handle = (params?.handle as string) || 'hyper-architect';
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'about'>('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(425000);

  // Find channel from videos or fallback to default
  const channelVideos = INITIAL_VIDEOS.filter((v) => v.channel.handle === handle || handle === 'creator');
  const videosToDisplay = channelVideos.length > 0 ? channelVideos : INITIAL_VIDEOS.slice(0, 4);
  const primaryVideo = videosToDisplay[0];
  const channel = primaryVideo?.channel || INITIAL_VIDEOS[0].channel;

  useEffect(() => {
    const subs = getSubscriptions();
    setIsSubscribed(subs.includes(channel.handle));
    setSubCount(channel.subscribersCount || 425000);
  }, [channel.handle, channel.subscribersCount]);

  const handleSubToggle = () => {
    const nextState = toggleSubscription(channel.handle);
    setIsSubscribed(nextState);
    setSubCount(prev => nextState ? prev + 1 : prev - 1);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="w-full h-44 sm:h-64 md:h-72 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <img
          src={channel.bannerUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop'}
          alt={channel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Channel Header Profile */}
      <div className="px-4 sm:px-8 -mt-12 sm:-mt-16 relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={channel.avatarUrl}
              alt={channel.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-[#0b0c10] shadow-2xl bg-black"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{channel.name}</h1>
                {channel.isVerified && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                @{channel.handle} • {subCount.toLocaleString()} subscribers • {videosToDisplay.length} videos
              </p>
              <p className="text-xs text-slate-300 max-w-xl line-clamp-2 pt-1">
                {channel.bio || 'Deep-dive software architecture, high throughput distributed systems, and modern video streaming engineering.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubToggle}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg ${
                isSubscribed
                  ? 'bg-[#1f232e] text-slate-300 hover:bg-[#282d3b] border border-[#2e3444]'
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {isSubscribed ? <Bell className="w-4 h-4 fill-slate-300" /> : null}
              <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
            </button>
            <button className="p-2.5 rounded-full bg-[#181a24] hover:bg-[#232733] border border-[#232733] text-slate-300 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-[#232733] text-sm font-semibold">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'videos' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Videos
            {activeTab === 'videos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('shorts')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'shorts' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Shorts
            {activeTab === 'shorts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'about' ? 'text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            About
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Featured Channel Trailer */}
            {primaryVideo && (
              <div className="p-4 rounded-3xl bg-[#14161d] border border-[#232733] flex flex-col md:flex-row gap-6 items-center">
                <Link
                  href={`/watch/${primaryVideo.id}`}
                  className="w-full md:w-96 aspect-video rounded-2xl overflow-hidden bg-black relative group shrink-0"
                >
                  <img
                    src={primaryVideo.thumbnailUrl}
                    alt={primaryVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </Link>
                <div className="space-y-2 flex-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-[11px] font-bold">
                    Featured Trailer
                  </span>
                  <Link href={`/watch/${primaryVideo.id}`}>
                    <h3 className="text-lg font-bold text-white hover:text-indigo-400 transition-colors">
                      {primaryVideo.title}
                    </h3>
                  </Link>
                  <div className="text-xs text-slate-400">
                    {primaryVideo.viewsCount} views • {primaryVideo.publishedAt}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {primaryVideo.description}
                  </p>
                </div>
              </div>
            )}

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videosToDisplay.map((video) => (
                <Link
                  key={video.id}
                  href={`/watch/${video.id}`}
                  className="group flex flex-col space-y-2"
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-[#232733]">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                      {video.durationFormatted}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h4>
                  <div className="text-[11px] text-slate-500">
                    {video.viewsCount} views • {video.publishedAt}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shorts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {INITIAL_SHORTS.map((short) => (
              <Link
                key={short.id}
                href="/shorts"
                className="group relative aspect-9/16 rounded-2xl overflow-hidden bg-black border border-[#232733]"
              >
                <div className="w-full h-full bg-gradient-to-t from-black via-slate-900 to-indigo-950 p-4 flex flex-col justify-end group-hover:scale-105 transition-transform">
                  <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                    {short.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 mt-1">{short.likes} likes</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-[#14161d] border border-[#232733] rounded-3xl p-6 max-w-2xl space-y-4">
            <h3 className="font-bold text-base text-white">Channel Details</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {channel.bio || 'VIONEX official certified creator channel.'}
            </p>
            <div className="border-t border-[#232733] pt-4 space-y-2 text-xs text-slate-400">
              <div>Joined: October 2026</div>
              <div>Total Channel Views: 1,842,500 views</div>
              <div>Country: Global / Decentralized</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
