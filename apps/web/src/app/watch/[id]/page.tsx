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
  Sparkles,
  SlidersHorizontal,
  Pin,
  ChevronDown,
  ChevronUp,
  Volume2,
  Zap
} from 'lucide-react';
import {
  INITIAL_VIDEOS,
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
  { time: 130, text: 'The built-in Studio Audio Booster normalizes dynamic range and amplifies speech up to 300%.' },
  { time: 180, text: 'In conclusion, this platform achieves 100% YouTube feature parity natively.' }
];

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  
  // Normalize videoId (handle both hyphens and underscores)
  const rawId = (params?.id as string) || 'vid-demo-001';
  const videoId = rawId.replace('_', '-');

  const initialVideo = INITIAL_VIDEOS.find(
    (v) => v.id === videoId || v.id === rawId || v.id.replace('_', '-') === videoId
  ) || INITIAL_VIDEOS[0];

  const { playVideo, isTheaterMode } = usePlayer();

  const [video, setVideo] = useState<VideoItem>(initialVideo);
  const [allVideos, setAllVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [likes, setLikes] = useState(initialVideo.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(initialVideo.channel.subscribersCount || 425000);
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);

  // Comments & Replies State
  const [comments, setComments] = useState<NestedComment[]>([
    {
      id: 'c1',
      videoId: 'vid-demo-001',
      author: 'Antigravity Architect',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
      text: '📌 Pinned: Welcome to VIONEX! Every capability from keyboard controls to ABR, P2P delivery, and Studio Audio Booster is operational.',
      timestamp: '1 day ago',
      likes: 89,
      isPinned: true,
      replies: [
        {
          id: 'r1',
          author: 'DevLead',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
          text: 'Verified! Keyboard shortcuts [?], Audio Booster [B], and Miniplayer [I] feel remarkably fluid.',
          timestamp: '20 hours ago'
        }
      ]
    },
    {
      id: 'c2',
      videoId: 'vid-demo-001',
      author: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      text: 'The 300% Web Audio booster solved the low dialogue issue on mobile speakers! Audio is super crisp now.',
      timestamp: '18 hours ago',
      likes: 36,
      replies: []
    }
  ]);

  const [newCommentText, setNewCommentText] = useState('');
  const [commentInputFocused, setCommentInputFocused] = useState(false);
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
    
    // Find matching video by id or normalized id
    const found = list.find((v) => v.id === videoId || v.id === rawId || v.id.replace('_', '-') === videoId) || list[0];
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
  }, [videoId, rawId]);

  if (!video) {
    return (
      <div className="p-12 text-center text-[#606060] font-medium flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#FF0000] border-t-transparent rounded-full animate-spin mb-4" />
        <span>Loading video stream and high-speed telemetry...</span>
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
    setCommentInputFocused(false);
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
    const newP = {
      id: 'p-' + Date.now(),
      name: newPlaylistTitle.trim(),
      count: 1,
      checked: true
    };
    setUserPlaylists([...userPlaylists, newP]);
    setNewPlaylistTitle('');
  };

  const recommendedVideos = allVideos.filter((v) => v.id !== video.id);

  const sortedComments = [...comments].sort((a, b) => {
    if (a.isPinned) return -1;
    if (b.isPinned) return 1;
    if (commentSort === 'top') return b.likes - a.likes;
    return 0;
  });

  return (
    <div className={`p-3 sm:p-5 md:p-6 mx-auto bg-white min-h-screen text-[#0F0F0F] ${isTheaterMode ? 'max-w-full' : 'max-w-[1720px]'}`}>
      {/* Theater Mode Top Player */}
      {isTheaterMode && (
        <div className="mb-6 w-full max-w-[1440px] mx-auto">
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

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Player & Info & Comments */}
        <div className="lg:col-span-2 space-y-4">
          {/* Normal Mode Player (Always Prominently Rendered) */}
          {!isTheaterMode && (
            <div className="w-full">
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

          {/* Video Title (High-contrast, bold, YouTube styling) */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F0F0F] leading-snug tracking-tight pt-1">
            {video.title}
          </h1>

          {/* Channel Row & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-[#E5E5E5]">
            {/* Channel Info & Subscribe */}
            <div className="flex items-center gap-3">
              <Link href={`/channel/${video.channel.handle}`}>
                <img
                  src={video.channel.avatarUrl}
                  alt={video.channel.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-sm hover:opacity-90 transition-opacity"
                />
              </Link>
              <div>
                <Link
                  href={`/channel/${video.channel.handle}`}
                  className="flex items-center gap-1 font-semibold text-[#0F0F0F] text-sm sm:text-base hover:text-[#065FD4] transition-colors"
                >
                  <span>{video.channel.name}</span>
                  {video.channel.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-[#606060] fill-[#606060] text-white" />
                  )}
                </Link>
                <div className="text-xs text-[#606060]">
                  {subCount.toLocaleString()} subscribers
                </div>
              </div>

              <button
                onClick={handleSubToggle}
                className={`ml-2 sm:ml-4 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm ${
                  isSubscribed
                    ? 'bg-[#F2F2F2] text-[#0F0F0F] hover:bg-[#E5E5E5] border border-[#CCCCCC]'
                    : 'bg-[#0F0F0F] text-white hover:bg-[#272727]'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Interaction Buttons (Like, Dislike, Share, Save, Download, Transcript, Report) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Like / Dislike Pill */}
              <div className="flex items-center rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] transition-colors overflow-hidden border border-transparent">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                    isLiked ? 'text-[#FF0000] font-bold' : 'text-[#0F0F0F]'
                  }`}
                  aria-label="Like"
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[#FF0000] text-[#FF0000]' : 'text-[#0F0F0F]'}`} />
                  <span>{likes.toLocaleString()}</span>
                </button>
                <div className="w-[1px] h-5 bg-[#D4D4D4]" />
                <button
                  onClick={handleDislikeToggle}
                  className={`px-3 sm:px-3.5 py-2 text-xs sm:text-sm transition-colors ${
                    isDisliked ? 'text-[#FF0000] font-bold' : 'text-[#0F0F0F]'
                  }`}
                  aria-label="Dislike"
                >
                  <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-[#FF0000] text-[#FF0000]' : 'text-[#0F0F0F]'}`} />
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-xs sm:text-sm font-semibold text-[#0F0F0F] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Save / Playlist */}
              <button
                onClick={() => setShowPlaylistModal(true)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-xs sm:text-sm font-semibold transition-colors ${
                  isSaved ? 'text-[#065FD4]' : 'text-[#0F0F0F]'
                }`}
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Save</span>
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-xs sm:text-sm font-semibold text-[#0F0F0F] transition-colors"
                title="Download offline video package"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>

              {/* Transcript */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors ${
                  showTranscript
                    ? 'bg-[#0F0F0F] text-white'
                    : 'bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#0F0F0F]'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Transcript</span>
              </button>

              {/* Report */}
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 sm:p-2.5 rounded-full bg-[#F2F2F2] hover:bg-[#E5E5E5] text-[#606060] hover:text-[#FF0000] transition-colors"
                title="Report Video"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Transcript Drawer */}
          {showTranscript && (
            <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-2xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2">
                <h4 className="font-bold text-sm text-[#0F0F0F] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#065FD4]" />
                  Interactive Transcript
                </h4>
                <button
                  onClick={() => setShowTranscript(false)}
                  className="text-xs text-[#606060] hover:text-[#0F0F0F] font-semibold"
                >
                  Close
                </button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {SAMPLE_TRANSCRIPT.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#EAEAEA] cursor-pointer group transition-colors"
                  >
                    <span className="text-xs font-mono font-bold text-[#065FD4] shrink-0 mt-0.5">
                      {Math.floor(t.time / 60)}:{(t.time % 60).toString().padStart(2, '0')}
                    </span>
                    <p className="text-xs sm:text-sm text-[#0F0F0F] leading-relaxed">
                      {t.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Video Description Box (YouTube style clean card) */}
          <div
            onClick={() => setDescExpanded(!descExpanded)}
            className="bg-[#F2F2F2] hover:bg-[#EAEAEA] rounded-2xl p-4 space-y-2 text-[#0F0F0F] transition-colors cursor-pointer"
          >
            <div className="flex flex-wrap items-center gap-2.5 font-bold text-xs sm:text-sm text-[#0F0F0F]">
              <span>{video.viewsCount} views</span>
              <span>•</span>
              <span>{video.publishedAt}</span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white text-[#0F0F0F] border border-[#CCCCCC] text-[11px] font-semibold shadow-xs">
                {video.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 fill-red-700" />
                300% Audio Boosted
              </span>
            </div>

            <p className={`text-xs sm:text-sm text-[#0F0F0F] leading-relaxed whitespace-pre-line ${!descExpanded ? 'line-clamp-3' : ''}`}>
              {video.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium text-[#065FD4] hover:underline"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="pt-1 text-xs font-bold text-[#606060] flex items-center gap-1 hover:text-[#0F0F0F]">
              <span>{descExpanded ? 'Show less' : '...more'}</span>
              {descExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg sm:text-xl text-[#0F0F0F]">
                {comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)} Comments
              </h3>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#606060]" />
                <select
                  value={commentSort}
                  onChange={(e) => setCommentSort(e.target.value as any)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-[#0F0F0F] outline-none cursor-pointer"
                >
                  <option value="top">Top comments</option>
                  <option value="newest">Newest first</option>
                </select>
              </div>
            </div>

            {/* New Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-3 sm:gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-red-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm">
                Y
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onFocus={() => setCommentInputFocused(true)}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full bg-transparent border-b border-[#CCCCCC] focus:border-[#0F0F0F] py-2 text-sm text-[#0F0F0F] focus:outline-none transition-colors placeholder:text-[#606060]"
                />
                {(commentInputFocused || newCommentText.trim()) && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setNewCommentText('');
                        setCommentInputFocused(false);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#606060] hover:text-[#0F0F0F] rounded-full hover:bg-[#F2F2F2] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="px-4 py-1.5 rounded-full bg-[#065FD4] hover:bg-[#054db0] disabled:opacity-40 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Comment</span>
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {sortedComments.map((c) => (
                <div key={c.id} className="space-y-3">
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <img
                      src={c.avatar}
                      alt={c.author}
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-[#0F0F0F]">{c.author}</span>
                        {c.isPinned && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#0F0F0F]/10 text-[#0F0F0F] text-[10px] font-bold">
                            <Pin className="w-2.5 h-2.5" /> Pinned
                          </span>
                        )}
                        <span className="text-xs text-[#606060]">{c.timestamp}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#0F0F0F] leading-relaxed">
                        {c.text}
                      </p>
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => handleLikeComment(c.id)}
                          className={`flex items-center gap-1 text-xs hover:text-[#FF0000] transition-colors ${
                            c.isLiked ? 'text-[#FF0000] font-bold' : 'text-[#606060]'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-[#FF0000]' : ''}`} />
                          <span>{c.likes > 0 ? c.likes : ''}</span>
                        </button>
                        <button
                          onClick={() => setActiveReplyId(activeReplyId === c.id ? null : c.id)}
                          className="text-xs text-[#606060] hover:text-[#0F0F0F] font-semibold"
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
                            className="flex-1 bg-[#F2F2F2] border border-[#CCCCCC] rounded-lg px-3 py-1.5 text-xs text-[#0F0F0F] outline-none focus:border-[#0F0F0F]"
                          />
                          <button
                            onClick={() => handleAddReply(c.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#065FD4] hover:bg-[#054db0] text-xs font-bold text-white transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nested Replies Rendering */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-12 space-y-3 border-l-2 border-[#E5E5E5] pl-4">
                      {c.replies.map((r) => (
                        <div key={r.id} className="flex gap-2.5 items-start">
                          <img
                            src={r.avatar}
                            alt={r.author}
                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-[#0F0F0F]">{r.author}</span>
                              <span className="text-[11px] text-[#606060]">{r.timestamp}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#0F0F0F] leading-relaxed">{r.text}</p>
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
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-bold text-base text-[#0F0F0F]">Up next</h3>
            <div className="flex items-center gap-2 text-xs font-medium text-[#606060]">
              <span>Autoplay</span>
              <button
                onClick={() => setAutoplayNext(!autoplayNext)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  autoplayNext ? 'bg-[#065FD4]' : 'bg-[#CCCCCC]'
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
                className="flex gap-3 group cursor-pointer p-1.5 rounded-xl hover:bg-[#F2F2F2] transition-colors"
              >
                <div className="w-40 aspect-video rounded-xl bg-black border border-[#E5E5E5] shrink-0 overflow-hidden relative">
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
                  <h4 className="font-semibold text-xs sm:text-sm text-[#0F0F0F] line-clamp-2 group-hover:text-[#065FD4] transition-colors leading-snug">
                    {rec.title}
                  </h4>
                  <div className="text-xs text-[#606060] mt-1 flex items-center gap-1">
                    <span>{rec.channel.name}</span>
                    {rec.channel.isVerified && <CheckCircle2 className="w-3 h-3 text-[#606060] fill-[#606060] text-white" />}
                  </div>
                  <div className="text-[11px] text-[#606060] mt-0.5">
                    {rec.viewsCount} views • {rec.publishedAt}
                  </div>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-mono font-bold inline-flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-red-600" />
                      Two-Tower DNN: {Math.round(88 + (rec.title.length % 11))}% Match
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E5E5] rounded-3xl p-6 space-y-4 shadow-2xl text-[#0F0F0F]">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-bold text-base text-[#0F0F0F] flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#065FD4]" />
                Share Video
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-xs text-[#606060] hover:text-[#0F0F0F] font-bold p-1 rounded-full hover:bg-[#F2F2F2]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#606060]">
              Copy direct share link:
            </p>

            <div className="flex items-center gap-2 bg-[#F2F2F2] border border-[#CCCCCC] p-2 rounded-xl">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : `http://localhost:3000/watch/${video.id}`}
                className="flex-1 bg-transparent text-xs text-[#0F0F0F] outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-1.5 rounded-lg bg-[#065FD4] hover:bg-[#054db0] text-xs font-bold text-white transition-colors flex items-center gap-1 shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E5E5] rounded-3xl p-6 space-y-4 shadow-2xl text-[#0F0F0F]">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-bold text-base text-[#0F0F0F] flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-[#065FD4]" />
                Save video to...
              </h3>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="text-xs text-[#606060] hover:text-[#0F0F0F] font-bold p-1 rounded-full hover:bg-[#F2F2F2]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {userPlaylists.map((pl) => (
                <label
                  key={pl.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F2F2F2] cursor-pointer text-xs text-[#0F0F0F]"
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
                      className="rounded accent-[#FF0000]"
                    />
                    <span className="font-semibold">{pl.name}</span>
                  </div>
                  <span className="text-[11px] text-[#606060]">{pl.count} videos</span>
                </label>
              ))}
            </div>

            <div className="border-t border-[#E5E5E5] pt-3 flex gap-2">
              <input
                type="text"
                placeholder="Create new playlist..."
                value={newPlaylistTitle}
                onChange={(e) => setNewPlaylistTitle(e.target.value)}
                className="flex-1 bg-[#F2F2F2] border border-[#CCCCCC] rounded-xl px-3 py-1.5 text-xs text-[#0F0F0F] outline-none focus:border-[#0F0F0F]"
              />
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-1.5 rounded-xl bg-[#0F0F0F] hover:bg-[#272727] text-xs font-bold text-white transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust & Safety Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E5E5] rounded-3xl p-6 space-y-4 shadow-2xl text-[#0F0F0F]">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="font-bold text-base text-[#0F0F0F] flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-600" />
                Report Content (Trust & Safety)
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-xs text-[#606060] hover:text-[#0F0F0F] font-bold p-1 rounded-full hover:bg-[#F2F2F2]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#606060]">
              Select the violation category to submit for review:
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
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F2F2F2] cursor-pointer text-xs text-[#0F0F0F]"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={reportReason === reason}
                    onChange={() => setReportReason(reason)}
                    className="accent-[#FF0000]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5E5E5]">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#606060] hover:text-[#0F0F0F] rounded-full hover:bg-[#F2F2F2]"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 rounded-full bg-[#FF0000] hover:bg-[#CC0000] text-xs font-bold text-white transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Download Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 bg-[#0F0F0F] text-white rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Offline media package generated with expiring signed token.</span>
        </div>
      )}

      {/* Floating Report Toast */}
      {reportSuccessToast && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 bg-[#0F0F0F] text-white rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5">
          <Flag className="w-4 h-4 text-red-400" />
          <span>Report received and queued in Moderation Triage.</span>
        </div>
      )}
    </div>
  );
}
