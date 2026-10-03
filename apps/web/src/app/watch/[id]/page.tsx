'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Player from '@/components/Player';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  BookmarkPlus,
  CheckCircle2,
  Bell,
  Clock,
  Send,
  Heart,
  Check,
  Play
} from 'lucide-react';
import {
  getStoredVideos,
  addToHistory,
  toggleLikeVideo,
  isVideoLiked,
  toggleWatchLater,
  isWatchLater,
  getSubscriptions,
  toggleSubscription,
  VideoItem,
  CommentItem
} from '@/lib/data';

export default function WatchPage() {
  const params = useParams();
  const videoId = (params?.id as string) || 'vid-demo-001';

  const [video, setVideo] = useState<VideoItem | null>(null);
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [likes, setLikes] = useState(1420);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(425000);
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c1',
      videoId: 'vid-demo-001',
      author: 'Alex River',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      text: 'The explanation on aligning GOP keyframes to 2s intervals completely solved our HLS stutter issue in production! Amazing architectural breakdown.',
      timestamp: '1 day ago',
      likes: 42
    },
    {
      id: 'c2',
      videoId: 'vid-demo-001',
      author: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      text: 'WebRTC P2P fallback circuit breaker is the most clever CDN egress optimization I have seen this year.',
      timestamp: '18 hours ago',
      likes: 19
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const list = getStoredVideos();
    setAllVideos(list);
    const found = list.find((v) => v.id === videoId) || list[0];
    setVideo(found);

    if (found) {
      addToHistory(found);
      setLikes(found.likesCount);
      setIsLiked(isVideoLiked(found.id));
      setIsSaved(isWatchLater(found.id));
      const subs = getSubscriptions();
      setIsSubscribed(subs.includes(found.channel.handle));
      setSubCount(found.channel.subscribersCount || 425000);
    }
  }, [videoId]);

  if (!video) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading video...
      </div>
    );
  }

  const handleLikeToggle = () => {
    const nextLiked = toggleLikeVideo(video.id);
    setIsLiked(nextLiked);
    setLikes((prev) => (nextLiked ? prev + 1 : prev - 1));
  };

  const handleSaveToggle = () => {
    const nextSaved = toggleWatchLater(video.id);
    setIsSaved(nextSaved);
  };

  const handleSubToggle = () => {
    const nextSub = toggleSubscription(video.channel.handle);
    setIsSubscribed(nextSub);
    setSubCount((prev) => (nextSub ? prev + 1 : prev - 1));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const item: CommentItem = {
      id: 'c-' + Date.now(),
      videoId: video.id,
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0
    };

    setComments([item, ...comments]);
    setNewCommentText('');
  };

  const handleLikeComment = (cId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === cId) {
          const liked = c.isLiked;
          return {
            ...c,
            likes: liked ? c.likes - 1 : c.likes + 1,
            isLiked: !liked
          };
        }
        return c;
      })
    );
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const recommendedVideos = allVideos.filter((v) => v.id !== video.id);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Video & Discussion (2 Cols) */}
      <div className="lg:col-span-2 space-y-4">
        {/* Adaptive Bitrate Video Player */}
        <Player src={video.videoUrl} poster={video.thumbnailUrl} />

        {/* Video Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {video.title}
        </h1>

        {/* Channel Details & Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#232733]">
          {/* Channel Info */}
          <div className="flex items-center gap-3">
            <Link href={`/channel/${video.channel.handle}`}>
              <img
                src={video.channel.avatarUrl}
                alt={video.channel.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-indigo-600 shadow-md"
              />
            </Link>
            <div>
              <Link
                href={`/channel/${video.channel.handle}`}
                className="flex items-center gap-1 font-semibold text-slate-100 text-sm hover:text-indigo-400 transition-colors"
              >
                <span>{video.channel.name}</span>
                {video.channel.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                )}
              </Link>
              <div className="text-xs text-slate-400">
                {subCount.toLocaleString()} subscribers
              </div>
            </div>

            <button
              onClick={handleSubToggle}
              className={`ml-3 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md ${
                isSubscribed
                  ? 'bg-[#1f232e] text-slate-300 hover:bg-[#282d3b] border border-[#2e3444]'
                  : 'bg-white text-black hover:bg-slate-200'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Action Buttons: Like, Dislike, Share, Save */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#181a24] rounded-full border border-[#232733] overflow-hidden">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold hover:bg-[#232733] transition-colors ${
                  isLiked ? 'text-indigo-400' : 'text-slate-300'
                }`}
                title="Like this video"
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-indigo-400' : ''}`} />
                <span>{likes.toLocaleString()}</span>
              </button>
              <div className="w-px h-5 bg-[#2e3444]" />
              <button
                onClick={() => {
                  if (isLiked) handleLikeToggle();
                }}
                className="px-3 py-2 text-xs hover:bg-[#232733] text-slate-300 transition-colors"
                title="Dislike"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#181a24] border border-[#232733] hover:bg-[#232733] text-xs font-semibold text-slate-300 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-colors ${
                isSaved
                  ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40'
                  : 'bg-[#181a24] border-[#232733] hover:bg-[#232733] text-slate-300'
              }`}
              title="Save to Watch Later"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Video Description Box */}
        <div className="bg-[#14161d] border border-[#232733] rounded-2xl p-4 text-sm text-slate-300 space-y-2">
          <div className="text-xs font-semibold text-slate-400">
            {video.viewsCount} views • Published {video.publishedAt} • Category: {video.category}
          </div>
          <p className="leading-relaxed whitespace-pre-line text-xs sm:text-sm">
            {video.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-[#1e2230] text-xs font-medium text-indigo-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Real Working Comments Section */}
        <div className="space-y-6 pt-4">
          <h3 className="font-bold text-lg text-white">
            Comments ({comments.length})
          </h3>

          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
              Y
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                placeholder="Add a public comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-transparent border-b border-[#2e3444] focus:border-indigo-500 py-1.5 text-sm text-white focus:outline-none transition-colors"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewCommentText('')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3 items-start">
                <img
                  src={c.avatar}
                  alt={c.author}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{c.author}</span>
                    <span className="text-[11px] text-slate-500">{c.timestamp}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {c.text}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => handleLikeComment(c.id)}
                      className={`flex items-center gap-1 text-xs hover:text-indigo-400 transition-colors ${
                        c.isLiked ? 'text-indigo-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-indigo-400' : ''}`} />
                      <span>{c.likes > 0 ? c.likes : ''}</span>
                    </button>
                    <button className="text-xs text-slate-400 hover:text-slate-200">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Videos Sidebar Column */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-slate-200">Recommended Videos</h3>
        <div className="space-y-3">
          {recommendedVideos.map((rec) => (
            <Link
              key={rec.id}
              href={`/watch/${rec.id}`}
              className="flex gap-3 group cursor-pointer p-2 rounded-xl hover:bg-[#14161d] transition-colors"
            >
              <div className="w-40 aspect-video rounded-xl bg-black border border-[#232733] shrink-0 overflow-hidden relative">
                <img
                  src={rec.thumbnailUrl}
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                  {rec.durationFormatted}
                </span>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-md">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs text-slate-200 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug">
                  {rec.title}
                </h4>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <span>{rec.channel.name}</span>
                  {rec.channel.isVerified && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {rec.viewsCount} views • {rec.publishedAt}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14161d] border border-[#2e3444] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                Share Video
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Copy the direct link below to share this video with friends:
            </p>

            <div className="flex items-center gap-2 bg-[#0b0c10] border border-[#232733] p-2 rounded-xl">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : `http://localhost:3000/watch/${video.id}`}
                className="flex-1 bg-transparent text-xs text-slate-300 outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors flex items-center gap-1"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{copiedShare ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
