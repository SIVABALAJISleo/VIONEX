'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Bell, Share2, Play, ThumbsUp, MessageSquare, BarChart2 } from 'lucide-react';
import { INITIAL_VIDEOS, INITIAL_SHORTS, getSubscriptions, toggleSubscription, formatNumber } from '@/lib/data';
import { INITIAL_COMMUNITY_POSTS, voteOnCommunityPoll, CommunityPost } from '@/lib/community';

export default function ChannelPage() {
  const params = useParams();
  const handle = (params?.handle as string) || 'vionex-labs';
  const [activeTab, setActiveTab] = useState<'videos' | 'shorts' | 'community' | 'about'>('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(425000);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  // Find channel from videos or fallback to default
  const channelVideos = INITIAL_VIDEOS.filter((v) => v.channel.handle === handle || handle === 'vionex-labs');
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

  const handlePollVote = (postId: string, optionId: string) => {
    const { updatedPosts } = voteOnCommunityPoll(communityPosts, postId, optionId);
    setCommunityPosts(updatedPosts);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 bg-white text-[#0F0F0F]">
      {/* Banner */}
      <div className="w-full h-44 sm:h-64 md:h-72 bg-gradient-to-r from-red-600 via-zinc-800 to-black relative overflow-hidden">
        <img
          src={channel.bannerUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop'}
          alt={channel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Channel Header Profile */}
      <div className="px-4 sm:px-8 -mt-12 sm:-mt-16 relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={channel.avatarUrl}
              alt={channel.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F0F0F]">{channel.name}</h1>
                {channel.isVerified && <CheckCircle2 className="w-5 h-5 text-[#606060]" />}
              </div>
              <p className="text-xs text-[#606060]" suppressHydrationWarning>
                @{channel.handle} • {formatNumber(subCount)} subscribers • {videosToDisplay.length} videos
              </p>
              <p className="text-xs text-[#606060] max-w-xl line-clamp-2 pt-1">
                {channel.bio || 'Original high-performance video streaming engineering and decentralized media architecture.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSubToggle}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                isSubscribed
                  ? 'bg-[#F2F2F2] text-[#0F0F0F] hover:bg-[#E5E5E5] border border-[#CCCCCC]'
                  : 'bg-[#0F0F0F] text-white hover:bg-[#272727]'
              }`}
            >
              {isSubscribed ? <Bell className="w-4 h-4 fill-[#0F0F0F]" /> : null}
              <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
            </button>
            <button className="p-2.5 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#0F0F0F] transition-colors" title="Share Channel">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center gap-6 border-b border-[#E5E5E5] text-sm font-semibold">
          {(['videos', 'shorts', 'community', 'about'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 relative capitalize transition-colors ${
                activeTab === tab ? 'text-[#0F0F0F]' : 'text-[#606060] hover:text-[#0F0F0F]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F0F0F] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content: Videos */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            {primaryVideo && (
              <div className="p-4 rounded-2xl bg-[#F9F9F9] border border-[#E5E5E5] flex flex-col md:flex-row gap-6 items-center">
                <Link
                  href={`/watch/${primaryVideo.id}`}
                  className="w-full md:w-96 aspect-video rounded-xl overflow-hidden bg-black relative group shrink-0"
                >
                  <img
                    src={primaryVideo.thumbnailUrl}
                    alt={primaryVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </Link>
                <div className="space-y-2 flex-1 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E5E5E5] text-[#0F0F0F] text-[11px] font-semibold">
                    Featured Video
                  </span>
                  <Link href={`/watch/${primaryVideo.id}`}>
                    <h3 className="text-base font-bold text-[#0F0F0F] hover:text-[#FF0000] transition-colors">
                      {primaryVideo.title}
                    </h3>
                  </Link>
                  <div className="text-xs text-[#606060]">
                    {primaryVideo.viewsCount} views • {primaryVideo.publishedAt}
                  </div>
                  <p className="text-xs text-[#606060] leading-relaxed line-clamp-3">
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
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#E5E5E5]">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                      {video.durationFormatted}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-[#0F0F0F] group-hover:text-[#FF0000] transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h4>
                  <div className="text-[11px] text-[#606060]">
                    {video.viewsCount} views • {video.publishedAt}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Shorts */}
        {activeTab === 'shorts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {INITIAL_SHORTS.map((short) => (
              <Link
                key={short.id}
                href="/shorts"
                className="group relative aspect-9/16 rounded-xl overflow-hidden bg-zinc-900 border border-[#E5E5E5]"
              >
                <div className="w-full h-full bg-gradient-to-t from-black via-zinc-900 to-zinc-800 p-4 flex flex-col justify-end group-hover:scale-105 transition-transform">
                  <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                    {short.title}
                  </h4>
                  <span className="text-[11px] text-zinc-300 mt-1">{short.likes} likes</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Tab Content: Community (SOC-039) */}
        {activeTab === 'community' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {communityPosts.map((post) => (
              <div key={post.id} className="p-5 rounded-2xl border border-[#E5E5E5] bg-white shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#E5E5E5]"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-[#0F0F0F]">{post.authorName}</h4>
                    <span className="text-xs text-[#606060]">{post.publishedAt}</span>
                  </div>
                </div>

                <p className="text-sm text-[#0F0F0F] leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Optional Image */}
                {post.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-[#E5E5E5] aspect-video">
                    <img src={post.imageUrl} alt="Community update" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Interactive Poll */}
                {post.poll && (
                  <div className="p-4 rounded-xl bg-[#F9F9F9] border border-[#E5E5E5] space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#606060]">
                      <span className="font-semibold flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4 text-[#FF0000]" />
                        Community Poll
                      </span>
                      <span suppressHydrationWarning>{formatNumber(post.poll.totalVotes)} votes</span>
                    </div>

                    <div className="space-y-2">
                      {post.poll.options.map((opt) => {
                        const isVoted = post.poll?.userVotedOptionId === opt.id;
                        const pct = post.poll && post.poll.totalVotes > 0
                          ? Math.round((opt.votes / post.poll.totalVotes) * 100)
                          : 0;

                        return (
                          <button
                            key={opt.id}
                            onClick={() => handlePollVote(post.id, opt.id)}
                            className={`w-full text-left relative overflow-hidden rounded-xl border p-3 text-xs transition-all ${
                              isVoted
                                ? 'border-[#0F0F0F] bg-zinc-50 font-semibold'
                                : 'border-[#CCCCCC] hover:border-[#606060] bg-white'
                            }`}
                          >
                            {/* Vote percentage bar fill */}
                            {post.poll?.userVotedOptionId && (
                              <div
                                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                                  isVoted ? 'bg-red-100/70' : 'bg-zinc-100'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            )}

                            <div className="relative z-10 flex items-center justify-between">
                              <span className="text-[#0F0F0F]">{opt.text}</span>
                              {post.poll?.userVotedOptionId && (
                                <span className="font-mono font-bold text-[#0F0F0F]">{pct}%</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Social engagement buttons */}
                <div className="flex items-center gap-6 pt-2 border-t border-[#F2F2F2] text-xs text-[#606060]">
                  <button className="flex items-center gap-1.5 hover:text-[#0F0F0F] transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span suppressHydrationWarning>{formatNumber(post.likes)}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-[#0F0F0F] transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentsCount} Comments</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content: About */}
        {activeTab === 'about' && (
          <div className="bg-[#F9F9F9] border border-[#E5E5E5] rounded-2xl p-6 max-w-2xl space-y-4">
            <h3 className="font-bold text-base text-[#0F0F0F]">Channel Details</h3>
            <p className="text-sm text-[#606060] leading-relaxed">
              {channel.bio || 'VIONEX official certified creator channel.'}
            </p>
            <div className="border-t border-[#E5E5E5] pt-4 space-y-2 text-xs text-[#606060]">
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
