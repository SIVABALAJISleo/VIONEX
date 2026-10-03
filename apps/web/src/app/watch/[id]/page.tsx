'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Player from '@/components/Player';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  BookmarkPlus,
  CheckCircle2,
  Download,
  Flag,
  FileText,
  Send,
  Check,
  Play,
  CornerDownRight,
  SlidersHorizontal,
  Pin
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
import { usePlayer } from '@/lib/PlayerContext';

interface NestedComment extends CommentItem {
  replies?: { id: string; author: string; avatar: string; text: string; timestamp: string }[];
  isPinned?: boolean;
}

const SAMPLE_TRANSCRIPT = [
  { time: 0, text: 'Welcome to this in-depth architectural breakdown of VIONEX.' },
  { time: 15, text: 'We designed the video pipeline around Adaptive Bitrate HLS streams.' },
  { time: 35, text: 'By aligning keyframe GOP intervals to 2 seconds, rendition switching is seamless.' },
  { time: 60, text: 'Let us inspect the WebRTC Datachannel peer mesh optimization.' },
  { time: 95, text: 'When peers watch the same high-bitrate segment, WebRTC offloads origin CDN bandwidth by up to 78%.' },
  { time: 130, text: 'Now moving on to database indexing: PostgreSQL pg_trgm powers sub-50ms fuzzy searches.' },
  { time: 180, text: 'In conclusion, this platform achieves 80%+ YouTube feature parity natively.' }
];

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = (params?.id as string) || 'vid-demo-001';
  const { playVideo, isTheaterMode } = usePlayer();

  const [video, setVideo] = useState<VideoItem | null>(null);
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [likes, setLikes] = useState(1420);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(425000);
  const [autoplayNext, setAutoplayNext] = useState(true);

  // Comments & Replies State
  const [comments, setComments] = useState<NestedComment[]>([
    {
      id: 'c1',
      videoId: 'vid-demo-001',
      author: 'Antigravity Architect',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      text: '📌 Pinned: Welcome to VIONEX! Every capability from keyboard controls to ABR and P2P delivery is operational.',
      timestamp: '1 day ago',
      likes: 89,
      isPinned: true,
      replies: [
        {
          id: 'r1',
          author: 'DevLead',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
          text: 'Verified! Keyboard shortcuts [?] and Miniplayer [I] feel remarkably fluid.',
          timestamp: '20 hours ago'
        }
      ]
    },
    {
      id: 'c2',
      videoId: 'vid-demo-001',
      author: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      text: 'WebRTC P2P fallback circuit breaker is the most clever CDN egress optimization I have seen this year.',
      timestamp: '18 hours ago',
      likes: 24,
      replies: []
    }
  ]);

  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [commentId: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [commentSort, setCommentSort] = useState<'top' | 'newest'>('top');

  // Modals & Panels
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);
  const [reportSuccessToast, setReportSuccessToast] = useState(false);
  const [reportReason, setReportReason] = useState('Spam or misleading');

  // Playlists
  const [userPlaylists, setUserPlaylists] = useState([
    { id: 'p1', name: 'Watch Later', count: 12, checked: false },
    { id: 'p2', name: 'System Architecture', count: 4, checked: true },
    { id: 'p3', name: 'WebRTC & P2P Swarming', count: 8, checked: false }
  ]);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');

  useEffect(() => {
    const list = getStoredVideos();
    setAllVideos(list);
    const found = list.find((v) => v.id === videoId) || list[0];
    setVideo(found);

    if (found) {
      playVideo(found);
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
        Loading video stream...
      </div>
    );
  }

  const handleLikeToggle = () => {
    const nextLiked = toggleLikeVideo(video.id);
    setIsLiked(nextLiked);
    if (nextLiked && isDisliked) setIsDisliked(false);
    setLikes((prev) => (nextLiked ? prev + 1 : prev - 1));
  };

  const handleDislikeToggle = () => {
    if (!isDisliked && isLiked) {
      toggleLikeVideo(video.id);
      setIsLiked(false);
      setLikes((prev) => prev - 1);
    }
    setIsDisliked(!isDisliked);
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

    const item: NestedComment = {
      id: 'c-' + Date.now(),
      videoId: video.id,
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0,
      replies: []
    };

    setComments([item, ...comments]);
    setNewCommentText('');
  };

  const handleAddReply = (commentId: string) => {
    const replyText = replyInputs[commentId]?.trim();
    if (!replyText) return;

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const newReplies = [
            ...(c.replies || []),
            {
              id: 'r-' + Date.now(),
              author: 'You',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
              text: replyText,
              timestamp: 'Just now'
            }
          ];
          return { ...c, replies: newReplies };
        }
        return c;
      })
    );

    setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
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

  const handleDownload = () => {
    setDownloadSuccessToast(true);
    setTimeout(() => setDownloadSuccessToast(false), 3000);
  };

  const handleReportSubmit = () => {
    setShowReportModal(false);
    setReportSuccessToast(true);
    setTimeout(() => setReportSuccessToast(false), 3000);
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistTitle.trim()) return;
    setUserPlaylists([
      ...userPlaylists,
      { id: 'p-' + Date.now(), name: newPlaylistTitle.trim(), count: 1, checked: true }
    ]);
    setNewPlaylistTitle('');
  };

  const recommendedVideos = allVideos.filter((v) => v.id !== video.id);

  const sortedComments = [...comments].sort((a, b) => {
    if (a.isPinned) return -1;
    if (b.isPinned) return 1;
    if (commentSort === 'top') return b.likes - a.likes;
    return 0; // default order is newest first
  });

  return (
    <div className={`p-4 sm:p-6 mx-auto ${isTheaterMode ? 'max-w-full' : 'max-w-7xl'}`}>
      {/* Theater Mode Top Player */}
      {isTheaterMode && (
        <div className="mb-6 w-full max-w-7xl mx-auto">
          <Player
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            title={video.title}
            channelName={video.channel.name}
            onEnded={() => {
              if (autoplayNext && recommendedVideos.length > 0) {
                router.push(`/watch/${recommendedVideos[0].id}`);
              }
            }}
          />
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Player & Info & Comments */}
        <div className="lg:col-span-2 space-y-4">
          {/* Normal Mode Player */}
          {!isTheaterMode && (
            <Player
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              title={video.title}
              channelName={video.channel.name}
              onEnded={() => {
                if (autoplayNext && recommendedVideos.length > 0) {
                  router.push(`/watch/${recommendedVideos[0].id}`);
                }
              }}
            />
          )}

          {/* Video Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
            {video.title}
          </h1>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#232733]">
            {/* Channel Info & Subscribe */}
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

            {/* Interaction Buttons (Like, Dislike, Share, Save, Download, Transcript, Report) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Like / Dislike pill */}
              <div className="flex items-center rounded-full bg-[#14161d] border border-[#232733] overflow-hidden">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold hover:bg-[#1e2230] transition-colors ${
                    isLiked ? 'text-indigo-400 font-bold' : 'text-slate-200'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-indigo-400' : ''}`} />
                  <span>{likes.toLocaleString()}</span>
                </button>
                <div className="w-[1px] h-4 bg-[#232733]" />
                <button
                  onClick={handleDislikeToggle}
                  className={`px-3 py-1.5 text-xs hover:bg-[#1e2230] transition-colors ${
                    isDisliked ? 'text-red-400 font-bold' : 'text-slate-400'
                  }`}
                  aria-label="Dislike"
                >
                  <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-red-400' : ''}`} />
                </button>
              </div>

              {/* Share button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14161d] border border-[#232733] text-xs font-semibold text-slate-200 hover:bg-[#1e2230] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Save / Playlist */}
              <button
                onClick={() => setShowPlaylistModal(true)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14161d] border border-[#232733] text-xs font-semibold hover:bg-[#1e2230] transition-colors ${
                  isSaved ? 'text-indigo-400' : 'text-slate-200'
                }`}
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Save</span>
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14161d] border border-[#232733] text-xs font-semibold text-slate-200 hover:bg-[#1e2230] transition-colors"
                title="Download offline media"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>

              {/* Transcript */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#232733] text-xs font-semibold transition-colors ${
                  showTranscript ? 'bg-indigo-600 text-white' : 'bg-[#14161d] text-slate-200 hover:bg-[#1e2230]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Transcript</span>
              </button>

              {/* Report */}
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 rounded-full bg-[#14161d] border border-[#232733] text-slate-400 hover:text-red-400 hover:bg-[#1e2230] transition-colors"
                title="Report Video"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Transcript Drawer */}
          {showTranscript && (
            <div className="bg-[#111318] border border-[#2e3444] rounded-2xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#232733] pb-2">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Interactive Transcript
                </h4>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {SAMPLE_TRANSCRIPT.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-[#1a1e29] cursor-pointer group transition-colors"
                  >
                    <span className="text-[11px] font-mono text-indigo-400 group-hover:underline shrink-0 mt-0.5">
                      {Math.floor(t.time / 60)}:{(t.time % 60).toString().padStart(2, '0')}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed group-hover:text-white">
                      {t.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Description Box */}
          <div className="bg-[#14161d] border border-[#232733] rounded-2xl p-4 space-y-2 text-slate-300 text-sm">
            <div className="flex items-center gap-3 font-semibold text-xs text-white">
              <span>{video.viewsCount} views</span>
              <span>•</span>
              <span>{video.publishedAt}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-mono">
                {video.category}
              </span>
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

          {/* Comments Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">
                Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})
              </h3>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={commentSort}
                  onChange={(e) => setCommentSort(e.target.value as any)}
                  className="bg-[#14161d] border border-[#2e3444] rounded-lg px-2 py-1 text-xs text-slate-200 outline-none cursor-pointer"
                >
                  <option value="top">Top comments</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>
            </div>

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
            <div className="space-y-5">
              {sortedComments.map((c) => (
                <div key={c.id} className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <img
                      src={c.avatar}
                      alt={c.author}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{c.author}</span>
                        {c.isPinned && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                            <Pin className="w-2.5 h-2.5" /> Pinned
                          </span>
                        )}
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
                        <button
                          onClick={() => setActiveReplyId(activeReplyId === c.id ? null : c.id)}
                          className="text-xs text-slate-400 hover:text-slate-200 font-semibold"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Reply Input Box */}
                      {activeReplyId === c.id && (
                        <div className="pt-2 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a reply..."
                            value={replyInputs[c.id] || ''}
                            onChange={(e) =>
                              setReplyInputs({ ...replyInputs, [c.id]: e.target.value })
                            }
                            className="flex-1 bg-[#14161d] border border-[#2e3444] rounded-lg px-3 py-1 text-xs text-white outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleAddReply(c.id)}
                            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nested Replies Rendering */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-11 space-y-2 border-l-2 border-[#232733] pl-3">
                      {c.replies.map((r) => (
                        <div key={r.id} className="flex gap-2 items-start">
                          <img
                            src={r.avatar}
                            alt={r.author}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-white">{r.author}</span>
                              <span className="text-[10px] text-slate-500">{r.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-snug">{r.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Autoplay & Recommendations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-200">Up next</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Autoplay</span>
              <button
                onClick={() => setAutoplayNext(!autoplayNext)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  autoplayNext ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoplayNext ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

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
              Copy direct share link:
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

      {/* Save to Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14161d] border border-[#2e3444] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-indigo-400" />
                Save video to...
              </h3>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {userPlaylists.map((pl) => (
                <label
                  key={pl.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1f232e] cursor-pointer text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={pl.checked}
                      onChange={() => {
                        setUserPlaylists(
                          userPlaylists.map((p) =>
                            p.id === pl.id ? { ...p, checked: !p.checked } : p
                          )
                        );
                      }}
                      className="rounded accent-indigo-600"
                    />
                    <span>{pl.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500">{pl.count} videos</span>
                </label>
              ))}
            </div>

            <div className="border-t border-[#232733] pt-3 flex gap-2">
              <input
                type="text"
                placeholder="Create new playlist..."
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                className="flex-1 bg-[#0b0c10] border border-[#232733] rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleCreatePlaylist}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust & Safety Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14161d] border border-[#2e3444] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232733] pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-400" />
                Report Content (Trust & Safety)
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select the violation category to submit to human and automated review:
            </p>

            <div className="space-y-2">
              {[
                'Spam or misleading content',
                'Harassment or hate speech',
                'Violence or graphic depictions',
                'Copyright or intellectual property infringement',
                'Child safety concern'
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#1e2230] cursor-pointer text-xs text-slate-200"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="accent-indigo-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#232733]">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Download Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 bg-[#14161d] border border-emerald-500/40 text-emerald-300 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Offline media package generated with expiring signed token.</span>
        </div>
      )}

      {/* Floating Report Toast */}
      {reportSuccessToast && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 bg-[#14161d] border border-red-500/40 text-red-300 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Flag className="w-4 h-4 text-red-400" />
          <span>Report received and queued in Moderation Triage.</span>
        </div>
      )}
    </div>
  );
}
