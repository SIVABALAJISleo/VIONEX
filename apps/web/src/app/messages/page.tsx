'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  Play,
  Pause,
  Trash2,
  QrCode,
  ShieldCheck,
  X,
  Plus,
  Image as ImageIcon,
  FileText,
  BarChart2,
  User,
  ChevronDown,
  Reply,
  Copy,
  ArrowLeft,
  CircleDashed,
  Users,
  Megaphone,
  SquarePen,
  Camera,
  Film,
  Lock,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Heart,
  ThumbsUp,
  Laugh,
  Flame,
  HelpCircle,
  Settings,
  LogOut,
  FolderOpen
} from 'lucide-react';
import {
  ChatMessage,
  Conversation,
  getStoredConversations,
  saveConversations,
  getStoredMessages,
  saveMessages,
  sendChatMessage,
  addMessageReaction,
  deleteChatMessage,
  getLinkedDevices
} from '@/lib/communication';
import { AUTHENTIC_CHANNELS } from '@/lib/data';

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

const EMOJI_LIST = [
  '😀','😃','😄','😁','😆','😅','😂','🤣','🥲','🥹','😊','😇','🙂','🙃','😉','😌',
  '😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸',
  '🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢',
  '😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🫡',
  '🤔','🫣','🤭','🫢','🫡','🤫','🫠','🤥','😶','😐','😑','😬','🫨','🙄','😯','😦',
  '👍','👎','👌','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','👇','☝️','✋','🤚',
  '🖐️','🖖','👋','🤝','🫶','👏','🙌','👐','🤲','🙏','✍️','💪','🦾','🦿','🦵','🦶',
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓',
  '💗','💖','💘','💝','🔥','✨','🎉','🎊','🚀','💯','⭐','🌟','⚡','💥','🎵','🎶'
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-mkbhd');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'favorites' | 'groups'>('all');

  // Modals & Panels
  const [showStatusDrawer, setShowStatusDrawer] = useState(false);
  const [stories, setStories] = useState<StatusStory[]>(DEFAULT_STORIES);
  const [activeStory, setActiveStory] = useState<StatusStory | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showAddStatusModal, setShowAddStatusModal] = useState(false);
  const [newStatusText, setNewStatusText] = useState('');
  const [newStatusBg, setNewStatusBg] = useState('#005c4b');

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Poll & Media Creator Modals
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [showVionexShareModal, setShowVionexShareModal] = useState(false);

  // Voice Note Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const recordTimerRef = useRef<any>(null);

  // Replying state
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  // Dropdown states
  const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(null);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Load conversations & statuses
  useEffect(() => {
    const convs = getStoredConversations();
    setConversations(convs);
    if (convs.length > 0 && !activeConvId) {
      setActiveConvId(convs[0].id);
    }

    try {
      const storedStories = localStorage.getItem('vionex_user_stories');
      if (storedStories) {
        setStories(JSON.parse(storedStories));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (activeConvId) {
      setMessages(getStoredMessages(activeConvId));
      setActiveMessageMenu(null);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Story progress timer
  useEffect(() => {
    let interval: any;
    if (activeStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress(p => {
          if (p >= 100) {
            // Mark viewed
            setStories(prev => prev.map(s => s.id === activeStory.id ? { ...s, hasViewed: true } : s));
            setActiveStory(null);
            return 0;
          }
          return p + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  // Call timer
  useEffect(() => {
    let timer: any;
    if (showCallModal) {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showCallModal]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const sent = sendChatMessage(activeConvId, inputText.trim(), undefined);
    if (replyingTo) {
      sent.replyTo = {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        text: replyingTo.text
      };
      setReplyingTo(null);
    }
    setMessages(prev => [...prev, sent]);
    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setShowCallModal(true);
    setCallDuration(0);
  };

  const handleInsertEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    chatInputRef.current?.focus();
  };

  // Voice Recording simulation with real audio message production
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordDuration(0);
    recordTimerRef.current = setInterval(() => {
      setRecordDuration(d => d + 1);
    }, 1000);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    clearInterval(recordTimerRef.current);
    setRecordDuration(0);
  };

  const handleSendVoiceNote = () => {
    setIsRecording(false);
    clearInterval(recordTimerRef.current);
    const durationStr = `${Math.floor(recordDuration / 60)}:${(recordDuration % 60).toString().padStart(2, '0')}`;
    const sent = sendChatMessage(activeConvId, `🎤 Voice message (${durationStr || '0:05'})`);
    setMessages(prev => [...prev, sent]);
    setRecordDuration(0);
  };

  // File Attachments
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isMedia: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const sent = sendChatMessage(activeConvId, isMedia ? `📷 ${file.name}` : `📄 ${file.name}`);
    sent.attachments = [{
      name: file.name,
      url: fakeUrl,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
    }];
    setMessages(prev => [...prev, sent]);
    setShowAttachMenu(false);
    e.target.value = '';
  };

  // Poll creation
  const handleCreatePoll = () => {
    if (!pollQuestion.trim()) return;
    const validOpts = pollOptions.filter(o => o.trim().length > 0);
    if (validOpts.length < 2) return;

    const pollText = `📊 Poll: ${pollQuestion}\n` + validOpts.map((opt, i) => `${i + 1}. ${opt}`).join('\n');
    const sent = sendChatMessage(activeConvId, pollText);
    setMessages(prev => [...prev, sent]);
    setShowPollModal(false);
    setPollQuestion('');
    setPollOptions(['', '']);
  };

  // VIONEX Video sharing
  const handleShareVionexVideo = (video: any) => {
    const sent = sendChatMessage(activeConvId, `Check this VIONEX video: ${video.title}`, {
      type: 'VIDEO',
      id: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnailUrl,
      creatorHandle: video.creatorHandle,
      embedRoute: video.embedRoute
    });
    setMessages(prev => [...prev, sent]);
    setShowVionexShareModal(false);
    setShowAttachMenu(false);
  };

  // Add Status
  const handlePublishStatus = () => {
    if (!newStatusText.trim()) return;
    const newStory: StatusStory = {
      id: 's-user-' + Date.now(),
      authorId: 'current-user',
      authorName: 'My Status',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
      isVerified: true,
      timeAgo: 'Just now',
      text: newStatusText.trim(),
      bgColor: newStatusBg,
      hasViewed: true,
      viewsCount: 0
    };

    const updated = [newStory, ...stories];
    setStories(updated);
    try {
      localStorage.setItem('vionex_user_stories', JSON.stringify(updated));
    } catch {}

    setNewStatusText('');
    setShowAddStatusModal(false);
  };

  // Filtered conversations
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'unread') return c.unreadCount > 0;
    if (activeFilter === 'groups') return c.id.includes('group');
    if (activeFilter === 'favorites') return c.isPinned;
    return true;
  });

  const formatCallTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[#f0f2f5] overflow-hidden select-none font-sans text-[#111b21]">
      {/* HIDDEN FILE INPUTS */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, true)}
      />
      <input
        type="file"
        ref={docInputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, false)}
      />

      {/* ==================================================================== */}
      {/* LEFT PANE: WhatsApp Conversation & Status List                       */}
      {/* ==================================================================== */}
      <div className="w-full sm:w-80 md:w-96 border-r border-[#e9edef] flex flex-col bg-white shrink-0 z-20">
        {/* WhatsApp Left Header */}
        <div className="h-16 bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-[#e9edef]">
          <div className="flex items-center gap-2">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
              alt="My Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer ring-2 ring-emerald-500/20"
              onClick={() => setShowStatusDrawer(true)}
              title="View & Add Status"
            />
            <span className="font-semibold text-sm text-[#111b21] ml-1">Chats</span>
          </div>

          {/* WhatsApp Authentic Action Icons */}
          <div className="flex items-center gap-1 text-[#54656f]">
            {/* Status Story Ring Icon */}
            <button
              onClick={() => setShowStatusDrawer(true)}
              className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors relative"
              title="Status"
            >
              <CircleDashed className="w-5 h-5 text-[#54656f]" />
              {stories.some(s => !s.hasViewed) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#00a884] rounded-full ring-2 ring-[#f0f2f5]" />
              )}
            </button>

            {/* Channels Icon */}
            <Link
              href="/channels"
              className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
              title="Broadcast Channels"
            >
              <Megaphone className="w-5 h-5 text-[#54656f]" />
            </Link>

            {/* Communities Icon */}
            <Link
              href="/communities"
              className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
              title="Communities"
            >
              <Users className="w-5 h-5 text-[#54656f]" />
            </Link>

            {/* New Chat Icon */}
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
              title="New Chat"
            >
              <SquarePen className="w-5 h-5 text-[#54656f]" />
            </button>

            {/* 3-Dots Menu */}
            <div className="relative">
              <button
                onClick={() => setShowTopMenu(!showTopMenu)}
                className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                title="Menu"
              >
                <MoreVertical className="w-5 h-5 text-[#54656f]" />
              </button>

              {showTopMenu && (
                <div className="absolute top-12 right-0 w-52 bg-white rounded-lg shadow-xl border border-[#e9edef] py-1.5 z-50 text-sm">
                  <button
                    onClick={() => { setShowNewChatModal(true); setShowTopMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-3 text-[#111b21]"
                  >
                    <Users className="w-4 h-4 text-[#54656f]" />
                    <span>New group</span>
                  </button>
                  <button
                    onClick={() => { setShowDeviceModal(true); setShowTopMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-3 text-[#111b21]"
                  >
                    <QrCode className="w-4 h-4 text-[#54656f]" />
                    <span>Linked devices</span>
                  </button>
                  <Link
                    href="/settings"
                    onClick={() => setShowTopMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-3 text-[#111b21]"
                  >
                    <Settings className="w-4 h-4 text-[#54656f]" />
                    <span>Settings</span>
                  </Link>
                  <div className="border-t border-[#e9edef] my-1" />
                  <button
                    onClick={() => setShowTopMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-3 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-3 py-2 bg-white border-b border-[#e9edef]">
          <div className="flex items-center bg-[#f0f2f5] rounded-lg px-3 py-1.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#00a884]">
            <Search className="w-4 h-4 text-[#54656f] mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search or start a new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#111b21] outline-none placeholder-[#54656f]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-0.5 text-[#54656f] hover:text-[#111b21]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* WhatsApp Authentic Filter Pills */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-[#e7fce3] text-[#008069] font-semibold'
                  : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                activeFilter === 'unread'
                  ? 'bg-[#e7fce3] text-[#008069] font-semibold'
                  : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                activeFilter === 'favorites'
                  ? 'bg-[#e7fce3] text-[#008069] font-semibold'
                  : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveFilter('groups')}
              className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 ${
                activeFilter === 'groups'
                  ? 'bg-[#e7fce3] text-[#008069] font-semibold'
                  : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
              }`}
            >
              Groups
            </button>
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f5f6f6]">
          {filteredConversations.map((c) => {
            const isActive = activeConvId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors ${
                  isActive ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6] bg-white'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={c.avatarUrl}
                    alt={c.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {c.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-sm text-[#111b21] truncate">{c.name}</span>
                    <span className={`text-[11px] font-normal ${c.unreadCount > 0 ? 'text-[#00a884] font-semibold' : 'text-[#667781]'}`}>
                      {c.lastMessage?.timestamp || '12:00'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#667781] truncate pr-2 flex items-center gap-1">
                      {c.lastMessage?.state === 'READ' && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0" />}
                      {c.lastMessage?.state === 'DELIVERED' && <CheckCheck className="w-3.5 h-3.5 text-[#8696a0] shrink-0" />}
                      {c.lastMessage?.state === 'SENT' && <Check className="w-3.5 h-3.5 text-[#8696a0] shrink-0" />}
                      <span className="truncate">{c.lastMessage?.text || 'Tap to chat'}</span>
                    </p>
                    {c.unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#25d366] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* RIGHT PANE: WhatsApp Active Chat Room with Signature Wallpaper       */}
      {/* ==================================================================== */}
      {activeConv ? (
        <div className="hidden sm:flex flex-1 flex-col relative bg-[#efeae2] overflow-hidden">
          {/* WhatsApp Authentic Doodle Wallpaper Texture */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M20 20h20v20H20V20zm40 0h20v20H60V20zM0 40h20v20H0V40zm40 0h20v20H40V40zm20 20h20v20H60V60zM0 0h20v20H0V0z'/%3E%3C/g%3E%3C/svg%3E")`
            }}
          />

          {/* WhatsApp Chat Header */}
          <div className="h-16 bg-[#f0f2f5] border-b border-[#e9edef] px-4 flex items-center justify-between z-10 shrink-0">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-90"
              onClick={() => setShowContactInfo(true)}
            >
              <img
                src={activeConv.avatarUrl}
                alt={activeConv.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-[#111b21]">{activeConv.name}</span>
                  {activeConv.isVerified && (
                    <span className="text-[10px] bg-[#00a884]/10 text-[#008069] px-1.5 py-0.2 rounded font-bold">
                      VERIFIED
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#667781] block">
                  {activeConv.isOnline ? 'online' : activeConv.lastSeenText || 'last seen recently'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#54656f]">
              <button
                onClick={() => handleStartCall('video')}
                className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                title="Video call"
              >
                <Video className="w-5 h-5 text-[#54656f]" />
              </button>
              <button
                onClick={() => handleStartCall('voice')}
                className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                title="Voice call"
              >
                <Phone className="w-5 h-5 text-[#54656f]" />
              </button>
              <div className="h-5 w-[1px] bg-[#e9edef] mx-1" />
              <button
                onClick={() => setShowContactInfo(!showContactInfo)}
                className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                title="Search in chat"
              >
                <Search className="w-5 h-5 text-[#54656f]" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                  title="Menu"
                >
                  <MoreVertical className="w-5 h-5 text-[#54656f]" />
                </button>

                {showChatMenu && (
                  <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-xl border border-[#e9edef] py-1.5 z-50 text-sm">
                    <button
                      onClick={() => { setShowContactInfo(true); setShowChatMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] text-[#111b21]"
                    >
                      Contact info
                    </button>
                    <button
                      onClick={() => { setShowChatMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] text-[#111b21]"
                    >
                      Select messages
                    </button>
                    <button
                      onClick={() => { setShowChatMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] text-[#111b21]"
                    >
                      Mute notifications
                    </button>
                    <button
                      onClick={() => { setShowChatMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] text-[#111b21]"
                    >
                      Clear chat
                    </button>
                    <div className="border-t border-[#e9edef] my-1" />
                    <button
                      onClick={() => { setShowChatMenu(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] text-red-600"
                    >
                      Delete chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:px-12 space-y-2 z-10">
            {/* WhatsApp Authentic Centered Encryption Notice */}
            <div className="flex justify-center my-3">
              <div className="bg-[#ffeecd] text-[#54656f] text-[12px] px-3.5 py-1.5 rounded-lg shadow-sm max-w-md text-center flex items-center gap-1.5 leading-relaxed">
                <Lock className="w-3.5 h-3.5 shrink-0 text-[#667781]" />
                <span>
                  Messages and calls are end-to-end encrypted. No one outside of this chat, not even VIONEX, can read or listen to them.
                </span>
              </div>
            </div>

            {/* Date Badge */}
            <div className="flex justify-center my-2">
              <span className="bg-white/80 text-[#54656f] text-[11px] font-medium px-3 py-1 rounded-md shadow-sm uppercase tracking-wide">
                Today
              </span>
            </div>

            {messages.map((m) => {
              const isMe = m.senderId === 'current-user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col group relative ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] sm:max-w-md rounded-lg px-3 py-2 shadow-sm text-sm relative group ${
                      isMe
                        ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none'
                        : 'bg-white text-[#111b21] rounded-tl-none'
                    }`}
                  >
                    {/* Quoted reply banner inside bubble */}
                    {m.replyTo && (
                      <div className="mb-1.5 p-2 rounded bg-black/5 border-l-4 border-[#00a884] text-xs">
                        <span className="font-bold text-[#00a884] block">{m.replyTo.senderName}</span>
                        <p className="text-[#54656f] truncate">{m.replyTo.text}</p>
                      </div>
                    )}

                    {/* VIONEX Video Rich Preview Card */}
                    {m.vionexRef && (
                      <Link
                        href={m.vionexRef.embedRoute}
                        className="block mb-2 rounded-lg overflow-hidden bg-black/5 hover:opacity-95 transition-opacity border border-black/10"
                      >
                        <div className="relative aspect-video">
                          <img
                            src={m.vionexRef.thumbnailUrl}
                            alt={m.vionexRef.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-md">
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="p-2 bg-white/60">
                          <p className="font-semibold text-xs text-[#111b21] line-clamp-1">{m.vionexRef.title}</p>
                          <span className="text-[10px] text-[#00a884] font-medium">vionex.tv{m.vionexRef.embedRoute}</span>
                        </div>
                      </Link>
                    )}

                    {/* Attachment preview if any */}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mb-2 space-y-1.5">
                        {m.attachments.map((att, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded bg-black/5 text-xs">
                            <FileText className="w-4 h-4 text-[#54656f]" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-[#111b21]">{att.name}</p>
                              <span className="text-[10px] text-[#54656f]">{att.size}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                    {/* Timestamp & double ticks */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[11px] text-[#667781] select-none float-right ml-3 -mb-1">
                      <span>{m.timestamp}</span>
                      {isMe && (
                        <span>
                          {m.state === 'READ' && <CheckCheck className="w-4 h-4 text-[#53bdeb]" />}
                          {m.state === 'DELIVERED' && <CheckCheck className="w-4 h-4 text-[#8696a0]" />}
                          {m.state === 'SENT' && <Check className="w-4 h-4 text-[#8696a0]" />}
                        </span>
                      )}
                    </div>

                    {/* Hover action chevron */}
                    <button
                      onClick={() => setActiveMessageMenu(activeMessageMenu === m.id ? null : m.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-white/70 hover:bg-white text-[#54656f] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Message Dropdown Menu */}
                    {activeMessageMenu === m.id && (
                      <div className="absolute top-7 right-1 w-40 bg-white rounded-lg shadow-xl border border-[#e9edef] py-1 z-30 text-xs">
                        <button
                          onClick={() => {
                            setReplyingTo(m);
                            setActiveMessageMenu(null);
                            chatInputRef.current?.focus();
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f5f6f6] flex items-center gap-2 text-[#111b21]"
                        >
                          <Reply className="w-3.5 h-3.5 text-[#54656f]" />
                          <span>Reply</span>
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(m.text);
                            setActiveMessageMenu(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f5f6f6] flex items-center gap-2 text-[#111b21]"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#54656f]" />
                          <span>Copy</span>
                        </button>
                        <button
                          onClick={() => {
                            addMessageReaction(activeConvId, m.id, '❤️');
                            setActiveMessageMenu(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f5f6f6] flex items-center gap-2 text-[#111b21]"
                        >
                          <Heart className="w-3.5 h-3.5 text-red-500" />
                          <span>React ❤️</span>
                        </button>
                        <div className="border-t border-[#e9edef] my-1" />
                        <button
                          onClick={() => {
                            deleteChatMessage(activeConvId, m.id);
                            setMessages(getStoredMessages(activeConvId));
                            setActiveMessageMenu(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f5f6f6] flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Emoji Reactions */}
                  {m.reactions && Object.keys(m.reactions).length > 0 && (
                    <div className="flex gap-1 mt-0.5 -translate-y-1">
                      {Object.entries(m.reactions).map(([emoji, users]) => (
                        <span
                          key={emoji}
                          onClick={() => addMessageReaction(activeConvId, m.id, emoji)}
                          className="bg-white border border-[#e9edef] rounded-full px-1.5 py-0.5 text-xs shadow-sm cursor-pointer hover:bg-neutral-50 flex items-center gap-1"
                        >
                          <span>{emoji}</span>
                          <span className="text-[10px] font-bold text-[#667781]">{users.length}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* ================================================================ */}
          {/* EMOJI PICKER DRAWER                                              */}
          {/* ================================================================ */}
          {showEmojiPicker && (
            <div className="bg-white border-t border-[#e9edef] p-3 shadow-lg z-20 max-h-56 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#e9edef] mb-2">
                <span className="text-xs font-semibold text-[#54656f] uppercase tracking-wider">Emojis</span>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1 text-2xl select-none">
                {EMOJI_LIST.map((emoji, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertEmoji(emoji)}
                    className="p-1.5 rounded hover:bg-[#f0f2f5] active:scale-125 transition-transform flex items-center justify-center"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* ATTACHMENT MENU POPUP                                            */}
          {/* ================================================================ */}
          {showAttachMenu && (
            <div className="absolute bottom-20 left-4 bg-white rounded-2xl shadow-2xl border border-[#e9edef] p-3 z-30 flex flex-col gap-2 w-56 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f5f6f6] text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#007bfc] text-white flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111b21]">Photos & Videos</p>
                  <span className="text-[11px] text-[#667781]">Send image or clip</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f5f6f6] text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#5f66cd] text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111b21]">Document</p>
                  <span className="text-[11px] text-[#667781]">Share PDF, code, file</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowVionexShareModal(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f5f6f6] text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111b21]">VIONEX Video</p>
                  <span className="text-[11px] text-[#667781]">Share video deep link</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowPollModal(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f5f6f6] text-left transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#ffb600] text-white flex items-center justify-center">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111b21]">Poll</p>
                  <span className="text-[11px] text-[#667781]">Create vote poll</span>
                </div>
              </button>
            </div>
          )}

          {/* ================================================================ */}
          {/* QUOTED REPLY PREVIEW BANNER                                      */}
          {/* ================================================================ */}
          {replyingTo && (
            <div className="bg-[#f0f2f5] border-t border-[#e9edef] px-4 py-2 flex items-center justify-between z-10">
              <div className="flex-1 border-l-4 border-[#00a884] pl-2 text-xs">
                <span className="font-bold text-[#00a884] block">Replying to {replyingTo.senderName}</span>
                <p className="text-[#54656f] truncate">{replyingTo.text}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ================================================================ */}
          {/* COMPOSER BAR (WhatsApp Authentic Bar)                            */}
          {/* ================================================================ */}
          <div className="px-4 py-2 bg-[#f0f2f5] border-t border-[#e9edef] flex items-center gap-2 z-10">
            {isRecording ? (
              // Active Voice Recording UI
              <div className="flex-1 flex items-center justify-between bg-white rounded-lg px-4 py-2 text-sm text-[#111b21] shadow-sm animate-pulse">
                <div className="flex items-center gap-2 text-red-600 font-mono font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  <span>Recording {formatCallTime(recordDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancelRecording}
                    className="p-1.5 rounded-full hover:bg-red-50 text-red-600"
                    title="Cancel recording"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSendVoiceNote}
                    className="p-2 rounded-full bg-[#00a884] text-white hover:bg-[#008069]"
                    title="Send voice message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Standard WhatsApp Input Row
              <>
                <div className="flex items-center gap-1 text-[#54656f]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowAttachMenu(false);
                    }}
                    className={`p-2 rounded-full hover:bg-black/5 transition-colors ${
                      showEmojiPicker ? 'text-[#00a884]' : 'text-[#54656f]'
                    }`}
                    title="Emoji"
                  >
                    <Smile className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(!showAttachMenu);
                      setShowEmojiPicker(false);
                    }}
                    className={`p-2 rounded-full hover:bg-black/5 transition-colors ${
                      showAttachMenu ? 'text-[#00a884] rotate-45' : 'text-[#54656f]'
                    }`}
                    title="Attach"
                  >
                    <Paperclip className="w-6 h-6 transition-transform" />
                  </button>
                </div>

                <form onSubmit={handleSendMessage} className="flex-1 flex items-center">
                  <input
                    ref={chatInputRef}
                    type="text"
                    placeholder="Type a message"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full bg-white text-[#111b21] text-sm px-4 py-2.5 rounded-lg outline-none placeholder-[#8696a0]"
                  />
                </form>

                {inputText.trim() ? (
                  // Send button when user is typing
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#008069] text-white transition-all shadow-sm active:scale-95 shrink-0"
                    title="Send message"
                  >
                    <Send className="w-5 h-5 ml-0.5" />
                  </button>
                ) : (
                  // Mic button for recording voice note
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="p-2.5 rounded-full text-[#54656f] hover:bg-black/5 transition-colors shrink-0"
                    title="Record voice message"
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center flex-col text-[#54656f] bg-[#f0f2f5] p-6 text-center">
          <ShieldCheck className="w-16 h-16 text-[#00a884] mb-4" />
          <h2 className="text-xl font-bold text-[#111b21]">VIONEX Messenger</h2>
          <p className="text-sm max-w-sm mt-1 text-[#667781] leading-relaxed">
            Send and receive end-to-end encrypted messages with verified creators and community members.
          </p>
        </div>
      )}

      {/* ==================================================================== */}
      {/* WHATSAPP STATUS DRAWER (Stories & Ephemeral Status)                  */}
      {/* ==================================================================== */}
      {showStatusDrawer && (
        <div className="fixed inset-y-0 left-0 sm:w-96 w-full bg-[#f0f2f5] z-50 shadow-2xl flex flex-col border-r border-[#e9edef] animate-in slide-in-from-left duration-200">
          {/* Status Drawer Header */}
          <div className="h-16 bg-[#008069] text-white px-4 flex items-center gap-4 shrink-0 shadow-sm">
            <button
              onClick={() => setShowStatusDrawer(false)}
              className="p-1 rounded-full hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold">Status</h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* My Status Row */}
            <div className="p-4 bg-white flex items-center justify-between border-b border-[#e9edef]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
                    alt="My Status"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <button
                    onClick={() => setShowAddStatusModal(true)}
                    className="absolute bottom-0 right-0 w-4 h-4 bg-[#00a884] text-white rounded-full flex items-center justify-center ring-2 ring-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#111b21]">My status</p>
                  <span className="text-xs text-[#667781]">Tap to add status update</span>
                </div>
              </div>

              <button
                onClick={() => setShowAddStatusModal(true)}
                className="p-2 rounded-full bg-[#f0f2f5] hover:bg-[#e9edef] text-[#008069]"
                title="Add status update"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Recent Updates Header */}
            <div className="px-4 py-3 text-xs font-bold text-[#008069] uppercase tracking-wider">
              Recent updates
            </div>

            {/* Stories List */}
            <div className="divide-y divide-[#f5f6f6] bg-white">
              {stories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStory(story)}
                  className="flex items-center gap-3 p-3.5 hover:bg-[#f5f6f6] cursor-pointer transition-colors"
                >
                  <div className="relative shrink-0">
                    <img
                      src={story.authorAvatar}
                      alt={story.authorName}
                      className={`w-12 h-12 rounded-full object-cover p-0.5 ${
                        story.hasViewed
                          ? 'ring-2 ring-[#8696a0]'
                          : 'ring-2 ring-[#00a884]'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#111b21] truncate">{story.authorName}</p>
                    <span className="text-xs text-[#667781]">{story.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* WHATSAPP FULLSCREEN STORIES VIEWER                                  */}
      {/* ==================================================================== */}
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

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Reply..."
                  className="flex-1 bg-white/20 text-white text-xs px-4 py-2.5 rounded-full placeholder-white/60 outline-none backdrop-blur-md border border-white/20"
                />
                <button
                  onClick={() => {
                    sendChatMessage(activeConvId, `Replied to status: ❤️`);
                    setActiveStory(null);
                  }}
                  className="p-2.5 rounded-full bg-[#00a884] text-white"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ADD STATUS MODAL                                                     */}
      {/* ==================================================================== */}
      {showAddStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] mb-4">
              <h3 className="font-bold text-base text-[#111b21]">New Status Update</h3>
              <button onClick={() => setShowAddStatusModal(false)} className="p-1 rounded-full hover:bg-black/5 text-[#54656f]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="w-full h-44 rounded-xl p-4 flex items-center justify-center text-center transition-colors mb-4"
              style={{ backgroundColor: newStatusBg }}
            >
              <textarea
                placeholder="Type a status update..."
                value={newStatusText}
                onChange={(e) => setNewStatusText(e.target.value)}
                className="w-full h-full bg-transparent text-white placeholder-white/70 text-xl font-bold outline-none resize-none text-center"
              />
            </div>

            {/* Color Chooser */}
            <div className="flex items-center gap-2 mb-4">
              {['#005c4b', '#7a2267', '#007bfc', '#8f5b23', '#c22332', '#1f2c34'].map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewStatusBg(color)}
                  className={`w-7 h-7 rounded-full transition-transform ${newStatusBg === color ? 'scale-125 ring-2 ring-black' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <button
              onClick={handlePublishStatus}
              disabled={!newStatusText.trim()}
              className="w-full py-2.5 rounded-full bg-[#00a884] hover:bg-[#008069] disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              Post Status (24 Hours)
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* NEW CHAT MODAL                                                       */}
      {/* ==================================================================== */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#e9edef]">
            <div className="h-14 bg-[#008069] text-white px-4 flex items-center justify-between">
              <h3 className="font-bold text-base">New Chat</h3>
              <button onClick={() => setShowNewChatModal(false)} className="p-1 rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-[#e9edef]">
              <input
                type="text"
                placeholder="Search creators..."
                className="w-full bg-[#f0f2f5] text-sm px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#f5f6f6]">
              {Object.values(AUTHENTIC_CHANNELS).map((ch) => (
                <div
                  key={ch.handle}
                  onClick={() => {
                    // Switch to chat
                    setShowNewChatModal(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-[#f5f6f6] cursor-pointer"
                >
                  <img src={ch.avatarUrl} alt={ch.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-sm text-[#111b21]">{ch.name}</p>
                    <span className="text-xs text-[#667781]">@{ch.handle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VIONEX VIDEO SHARE PICKER MODAL                                      */}
      {/* ==================================================================== */}
      {showVionexShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#FF0000] flex items-center justify-center text-white">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <h3 className="font-bold text-base text-[#111b21]">Share VIONEX Video</h3>
              </div>
              <button onClick={() => setShowVionexShareModal(false)} className="p-1 rounded-full hover:bg-black/5 text-[#54656f]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {[
                {
                  id: 'vid-demo-002',
                  title: 'View From A Blue Moon: 4K Cinematic Action Camera Breakdown',
                  thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop',
                  creatorHandle: 'mkbhd',
                  embedRoute: '/watch/vid-demo-002'
                },
                {
                  id: 'vid-demo-003',
                  title: 'Real-Time Edge AI & Object Detection with YOLOv10 in 100 Seconds',
                  thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1280&auto=format&fit=crop',
                  creatorHandle: 'fireship',
                  embedRoute: '/watch/vid-demo-003'
                },
                {
                  id: 'vid-demo-008',
                  title: 'synthwave radio - chill beats to relax / code / study to 24/7',
                  thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop',
                  creatorHandle: 'lofigirl',
                  embedRoute: '/watch/vid-demo-008'
                }
              ].map(vid => (
                <div
                  key={vid.id}
                  onClick={() => handleShareVionexVideo(vid)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f0f2f5] cursor-pointer border border-[#e9edef]"
                >
                  <img src={vid.thumbnailUrl} alt={vid.title} className="w-24 aspect-video rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs text-[#111b21] line-clamp-1">{vid.title}</p>
                    <span className="text-[11px] text-[#00a884] font-medium">@{vid.creatorHandle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* POLL CREATOR MODAL                                                   */}
      {/* ==================================================================== */}
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] mb-4">
              <h3 className="font-bold text-base text-[#111b21]">Create Poll</h3>
              <button onClick={() => setShowPollModal(false)} className="p-1 rounded-full hover:bg-black/5 text-[#54656f]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-[#54656f]">Question</label>
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full mt-1 bg-[#f0f2f5] text-sm px-3 py-2 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#54656f]">Options</label>
                {pollOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...pollOptions];
                      updated[idx] = e.target.value;
                      setPollOptions(updated);
                    }}
                    className="w-full mt-1 bg-[#f0f2f5] text-sm px-3 py-2 rounded-lg outline-none mb-1.5"
                  />
                ))}
                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, ''])}
                    className="text-xs text-[#00a884] font-semibold hover:underline mt-1 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add option</span>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleCreatePoll}
              disabled={!pollQuestion.trim()}
              className="w-full py-2.5 rounded-full bg-[#00a884] hover:bg-[#008069] disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              Send Poll
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* CONTACT INFO SIDEBAR                                                 */}
      {/* ==================================================================== */}
      {showContactInfo && activeConv && (
        <div className="fixed inset-y-0 right-0 sm:w-80 w-full bg-white z-40 shadow-2xl flex flex-col border-l border-[#e9edef] animate-in slide-in-from-right duration-200">
          <div className="h-16 bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-[#e9edef] shrink-0">
            <h3 className="font-semibold text-base text-[#111b21]">Contact info</h3>
            <button onClick={() => setShowContactInfo(false)} className="p-1 rounded-full hover:bg-black/5 text-[#54656f]">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex flex-col items-center text-center p-4 bg-[#f0f2f5] rounded-xl">
              <img src={activeConv.avatarUrl} alt={activeConv.name} className="w-20 h-20 rounded-full object-cover mb-2" />
              <h4 className="font-bold text-base text-[#111b21]">{activeConv.name}</h4>
              <span className="text-xs text-[#667781]">@{activeConv.participantId}</span>
            </div>

            <div className="p-3 bg-[#f0f2f5] rounded-xl">
              <span className="text-xs font-semibold text-[#54656f] block uppercase mb-1">About</span>
              <p className="text-sm text-[#111b21]">Official Creator on VIONEX | 4K HDR Real-Time Video</p>
            </div>

            <div className="p-3 bg-[#f0f2f5] rounded-xl flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#00a884] shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-[#111b21] block">Encryption</span>
                <p className="text-[#667781]">Messages are end-to-end encrypted. Tap to verify security code.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* LINKED DEVICES MODAL                                                 */}
      {/* ==================================================================== */}
      {showDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e9edef]">
              <div className="flex items-center gap-2">
                <QrCode className="w-6 h-6 text-[#00a884]" />
                <h3 className="font-bold text-lg text-[#111b21]">Linked devices</h3>
              </div>
              <button onClick={() => setShowDeviceModal(false)} className="p-1 rounded-full hover:bg-black/5 text-[#54656f]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-[#f0f2f5] rounded-xl my-4">
              <QrCode className="w-36 h-36 text-[#111b21]" />
              <p className="text-xs text-[#54656f] mt-3 text-center">
                Point your phone at this screen to capture the code.
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <span className="text-xs font-bold text-[#54656f] uppercase tracking-wider">Device status</span>
              {getLinkedDevices().map(d => (
                <div key={d.deviceId} className="flex items-center justify-between p-2.5 rounded-lg bg-[#f0f2f5]">
                  <div>
                    <p className="text-xs font-semibold text-[#111b21]">{d.deviceName}</p>
                    <span className="text-[11px] text-[#00a884]">{d.lastActive}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#e7fce3] text-[#008069] px-2 py-0.5 rounded-full">
                    {d.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDeviceModal(false)}
              className="w-full py-2.5 rounded-full bg-[#00a884] hover:bg-[#008069] text-white text-sm font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* LIVEKIT HD CALLING MODAL                                             */}
      {/* ==================================================================== */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl flex flex-col items-center">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center mb-6 border border-neutral-800">
              {callType === 'video' && !isCameraOff ? (
                <img
                  src={activeConv.avatarUrl}
                  alt={activeConv.name}
                  className="w-full h-full object-cover blur-sm opacity-50"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={activeConv.avatarUrl}
                    alt={activeConv.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-[#00a884] mb-3"
                  />
                  <span className="font-bold text-base">{activeConv.name}</span>
                  <span className="text-xs text-[#00a884]">Connected (LiveKit WebRTC)</span>
                </div>
              )}

              <div className="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#00a884] animate-ping" />
                <span>HD Call | 48kHz Opus</span>
              </div>

              <div className="absolute top-3 right-3 bg-black/60 px-3 py-1 rounded-full text-xs font-mono font-bold">
                {formatCallTime(callDuration)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-full transition-colors ${
                  isMuted ? 'bg-red-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                <Mic className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`p-3.5 rounded-full transition-colors ${
                  isCameraOff ? 'bg-red-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
                title={isCameraOff ? 'Camera On' : 'Camera Off'}
              >
                <Video className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowCallModal(false)}
                className="p-3.5 rounded-full bg-[#FF0000] hover:bg-red-700 text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                title="End call"
              >
                <Phone className="w-5 h-5 rotate-[135deg]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
