'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Play,
  Clock,
  Eye,
  CheckCircle2,
  ChevronRight,
  X,
  Send,
  CircleDashed,
  ArrowLeft,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { AUTHENTIC_CHANNELS } from '@/lib/data';
import { sendChatMessage } from '@/lib/communication';

interface StatusStory {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isVerified: boolean;
  timeAgo: string;
  mediaUrl?: string;
  text?: string;
  bgColor?: string;
  caption?: string;
  vionexRef?: {
    title: string;
    route: string;
  };
  hasViewed: boolean;
  viewsCount: number;
}

const DEFAULT_STORIES: StatusStory[] = [
  {
    id: 's-mkbhd',
    authorId: 'mkbhd',
    authorName: 'Marques Brownlee',
    authorAvatar: AUTHENTIC_CHANNELS.mkbhd.avatarUrl,
    isVerified: true,
    timeAgo: '2 hours ago',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop',
    caption: 'Setting up RED 6K cameras on helicopter gimbals for sunset shots 🚁🎬',
    vionexRef: {
      title: 'View From A Blue Moon: 4K Cinematic Action Camera Breakdown',
      route: '/watch/vid-demo-002'
    },
    hasViewed: false,
    viewsCount: 1420
  },
  {
    id: 's-fireship',
    authorId: 'fireship',
    authorName: 'Fireship',
    authorAvatar: AUTHENTIC_CHANNELS.fireship.avatarUrl,
    isVerified: true,
    timeAgo: '4 hours ago',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1280&auto=format&fit=crop',
    caption: 'Testing 120 FPS object classification directly in Chrome WebGPU runtime ⚡',
    vionexRef: {
      title: 'Real-Time Edge AI & Object Detection with YOLOv10 in 100 Seconds',
      route: '/watch/vid-demo-003'
    },
    hasViewed: false,
    viewsCount: 2890
  },
  {
    id: 's-lofi',
    authorId: 'lofigirl',
    authorName: 'Lofi Girl',
    authorAvatar: AUTHENTIC_CHANNELS.lofigirl.avatarUrl,
    isVerified: true,
    timeAgo: '6 hours ago',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop',
    caption: 'New synthwave melodies stream online now. Perfect for late-night code sessions.',
    vionexRef: {
      title: 'synthwave radio - chill beats to relax / code / study to 24/7',
      route: '/watch/vid-demo-008'
    },
    hasViewed: true,
    viewsCount: 8420
  }
];

export default function StatusPage() {
  const [stories, setStories] = useState<StatusStory[]>(DEFAULT_STORIES);
  const [activeStory, setActiveStory] = useState<StatusStory | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [statusBg, setStatusBg] = useState('#005c4b');
  const [replyText, setReplyText] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vionex_user_stories');
      if (stored) {
        setStories(JSON.parse(stored));
      }
    } catch {}
  }, []);

  useEffect(() => {
    let interval: any;
    if (activeStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress(p => {
          if (p >= 100) {
            setActiveStory(null);
            return 0;
          }
          return p + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  const handleOpenStory = (story: StatusStory) => {
    setActiveStory(story);
    const updated = stories.map(s => s.id === story.id ? { ...s, hasViewed: true } : s);
    setStories(updated);
    try {
      localStorage.setItem('vionex_user_stories', JSON.stringify(updated));
    } catch {}
  };

  const handleCreateStatus = () => {
    if (!statusText.trim()) return;

    const newStory: StatusStory = {
      id: 's-my-' + Date.now(),
      authorId: 'current-user',
      authorName: 'My Status',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
      isVerified: true,
      timeAgo: 'Just now',
      text: statusText.trim(),
      bgColor: statusBg,
      hasViewed: true,
      viewsCount: 0
    };

    const updated = [newStory, ...stories];
    setStories(updated);
    try {
      localStorage.setItem('vionex_user_stories', JSON.stringify(updated));
    } catch {}

    setStatusText('');
    setShowAddModal(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !activeStory) return;

    const targetConv = activeStory.authorId === 'current-user' ? 'conv-mkbhd' : `conv-${activeStory.authorId}`;
    sendChatMessage(targetConv, `Replied to your status: "${replyText.trim()}"`);
    setReplyText('');
    setReplySuccess(true);
    setTimeout(() => {
      setReplySuccess(false);
      setActiveStory(null);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-white min-h-[calc(100vh-3.5rem)] select-none font-sans text-[#111b21]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E5E5E5] mb-6">
        <div>
          <div className="flex items-center gap-2">
            <CircleDashed className="w-6 h-6 text-[#00a884]" />
            <h1 className="text-2xl font-bold tracking-tight text-[#111b21]">Status Updates</h1>
          </div>
          <p className="text-xs text-[#667781] mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#00a884]" />
            <span>Disappears after 24 hours. End-to-end encrypted and visible to your contacts.</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/messages"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#e9edef] hover:bg-[#f0f2f5] text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#54656f]" />
            <span>Back to Chats</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00a884] hover:bg-[#008069] text-white text-sm font-semibold transition-transform active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Status</span>
          </button>
        </div>
      </div>

      {/* Status Tray */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#667781] mb-4">Recent Updates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stories.map(s => (
            <div
              key={s.id}
              onClick={() => handleOpenStory(s)}
              className="group p-4 rounded-2xl border border-[#e9edef] hover:border-[#00a884] bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-0.5 rounded-full ${s.hasViewed ? 'ring-2 ring-[#8696a0]' : 'ring-2 ring-[#00a884]'}`}>
                  <img
                    src={s.authorAvatar}
                    alt={s.authorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm text-[#111b21]">{s.authorName}</span>
                    {s.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-[#00a884]" />}
                  </div>
                  <span className="text-xs text-[#667781]">{s.timeAgo}</span>
                </div>
              </div>

              {s.mediaUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-neutral-100">
                  <img src={s.mediaUrl} alt="Status media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div
                  className="w-full aspect-video rounded-xl p-4 flex items-center justify-center text-center mb-3"
                  style={{ backgroundColor: s.bgColor || '#005c4b' }}
                >
                  <p className="text-white text-sm font-bold line-clamp-3">{s.text}</p>
                </div>
              )}

              {s.caption && (
                <p className="text-xs text-[#111b21] line-clamp-2 leading-relaxed mb-2 font-medium">
                  {s.caption}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-[#667781] border-t border-[#f5f6f6] pt-2">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{s.viewsCount} views</span>
                </span>
                <span className="text-xs font-semibold text-[#00a884] group-hover:underline flex items-center">
                  <span>View Story</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULLSCREEN STORY VIEWER MODAL */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-150">
          <div className="relative max-w-md w-full h-full md:h-[90vh] bg-neutral-900 rounded-none md:rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Top segmented progress bar */}
            <div className="absolute top-3 inset-x-3 z-30">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                  style={{ width: `${storyProgress}%` }}
                />
              </div>

              {/* Story Author Bar */}
              <div className="flex items-center justify-between mt-3 text-white">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeStory.authorAvatar}
                    alt={activeStory.authorName}
                    className="w-10 h-10 rounded-full object-cover border border-white/40"
                  />
                  <div>
                    <span className="font-bold text-sm block leading-none">{activeStory.authorName}</span>
                    <span className="text-[11px] opacity-75">{activeStory.timeAgo}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1 rounded-full bg-black/40 hover:bg-black/60 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Story Content Area */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black">
              {activeStory.mediaUrl ? (
                <img
                  src={activeStory.mediaUrl}
                  alt={activeStory.caption || 'Status story'}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center p-8 text-center"
                  style={{ backgroundColor: activeStory.bgColor || '#005c4b' }}
                >
                  <p className="text-white text-2xl font-bold leading-relaxed">{activeStory.text}</p>
                </div>
              )}

              {/* VIONEX Video Embed link in status */}
              {activeStory.vionexRef && (
                <Link
                  href={activeStory.vionexRef.route}
                  className="absolute bottom-20 inset-x-4 p-3 bg-black/70 backdrop-blur-md rounded-xl text-white flex items-center gap-3 border border-white/20 hover:bg-black/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center shrink-0">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-white/70 block uppercase font-bold">Watch on VIONEX</span>
                    <p className="text-xs font-semibold truncate">{activeStory.vionexRef.title}</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Story Caption and Quick Reaction */}
            <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-30 text-white">
              {activeStory.caption && (
                <p className="text-sm text-center mb-3 drop-shadow">{activeStory.caption}</p>
              )}

              {replySuccess ? (
                <div className="py-2 text-center text-xs font-bold text-[#25d366]">
                  ✓ Reply sent to creator!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Reply to status..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    className="flex-1 bg-white/20 text-white text-xs px-4 py-2.5 rounded-full placeholder-white/60 outline-none backdrop-blur-md border border-white/20"
                  />
                  <button
                    onClick={handleSendReply}
                    className="p-2.5 rounded-full bg-[#00a884] text-white hover:bg-[#008069] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW STATUS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] mb-4">
              <h3 className="font-bold text-base text-[#111b21]">Add Status Update</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-full hover:bg-black/5 text-[#54656f]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="w-full h-44 rounded-xl p-4 flex items-center justify-center text-center transition-colors mb-4"
              style={{ backgroundColor: statusBg }}
            >
              <textarea
                placeholder="Type your 24-hour status update..."
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                className="w-full h-full bg-transparent text-white placeholder-white/70 text-xl font-bold outline-none resize-none text-center"
              />
            </div>

            {/* Background Color Palette */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#54656f]">Theme Color:</span>
              <div className="flex items-center gap-2">
                {['#005c4b', '#7a2267', '#007bfc', '#8f5b23', '#c22332', '#1f2c34'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setStatusBg(color)}
                    className={`w-7 h-7 rounded-full transition-transform ${statusBg === color ? 'scale-125 ring-2 ring-black' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateStatus}
              disabled={!statusText.trim()}
              className="w-full py-2.5 rounded-full bg-[#00a884] hover:bg-[#008069] disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              Post Status (24 Hours)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
