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
  FolderOpen,
  Pin,
  BellOff,
  Bell,
  Star,
  ExternalLink,
  MessageSquare,
  CheckSquare,
  Square,
  Download,
  Share2,
  Info,
  ChevronRight
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

// Rich WhatsApp categorized emoji matrix
const EMOJI_CATEGORIES = [
  {
    name: 'Smileys & Emotion',
    emojis: ['😀','😃','😄','😁','😆','😅','😂','🤣','🥲','🥹','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤗','🫡','🤔','🫣','🤭','🫢','🤫','🫠','🤥','😶','😐','😑','😬','🫨','🙄','😯','😦']
  },
  {
    name: 'People & Body',
    emojis: ['👍','👎','👌','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','👇','☝️','✋','🤚','🖐️','🖖','👋','🤝','🫶','👏','🙌','👐','🤲','🙏','✍️','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🫀','🫁','🧠','👀','👁️']
  },
  {
    name: 'Hearts & Symbols',
    emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','🔥','✨','🎉','🎊','🚀','💯','⭐','🌟','⚡','💥','🎵','🎶','💡','🔔','📢','🔒','🔑','🛡️']
  },
  {
    name: 'Food & Activities',
    emojis: ['☕','🍵','🧃','🥤','🍺','🍻','🥂','🍷','🍕','🍔','🍟','🌭','🍿','🍩','🍪','🎂','🍰','🍫','🍬','🍭','⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🥊','🥋','🎮','🕹️','🏆','🥇','🎯']
  }
];

// Persona response templates for intelligent peer simulator
const PEER_PERSONA_REPLIES: Record<string, string[]> = {
  mkbhd: [
    'Just ran the frame test through DaVinci Resolve. The dynamic range at 6K 60fps holds up incredibly well!',
    'Appreciate the feedback! Our next episode on next-gen optical sensors drops on VIONEX this Friday.',
    'Agreed 100%. The matte finish on the RED gimbals eliminates nearly all glare in direct sunlight.',
    'Checking out the timeline now. The bitrate and audio headroom are both spot on.'
  ],
  fireship: [
    'WebGPU compute pipeline initialized in 12ms. That was ridiculous! ⚡',
    'YOLOv10 weights loaded directly into browser cache with zero lag. Let’s ship it!',
    'The real question is: does it scale to 100k concurrent WebSocket connections? Testing right now.',
    'Top tier performance! Check the benchmarks in the community tab.'
  ],
  veritasium: [
    'The laminar flow calculations match our physical water tank sensors within 0.3% margin of error.',
    'Fascinating observation! That phenomenon actually stems from boundary-layer turbulence.',
    'We just uploaded the uncompressed raw acoustic captures to the VIONEX community drive.',
    'The physics checks out. Let me know if you want to test the second hypothesis.'
  ],
  lofigirl: [
    'So happy the beats are keeping you focused! New synthwave and lofi tape releasing soon 🎧',
    'Adding this recommendation to our 24/7 chillhop study playlist right now ✨',
    'Late night code sessions hit different with 48kHz audio. Relax and stay productive!'
  ],
  kurzgesagt: [
    'Our animators spent 3 weeks rendering the cellular mitosis sequence in 60fps Blender Cycles.',
    'The scale of neutron stars never ceases to amaze. Hope the breakdown was illuminating!',
    'Open source vector assets are now live for the community. Enjoy!'
  ]
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-mkbhd');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'favorites' | 'groups'>('all');

  // Navigation rail selection: 'chats' | 'status' | 'channels' | 'communities' | 'settings'
  const [activeRailTab, setActiveRailTab] = useState<'chats' | 'status' | 'channels' | 'communities' | 'settings'>('chats');

  // Peer typing indicator state (convId -> boolean)
  const [peerTypingState, setPeerTypingState] = useState<Record<string, boolean>>({});

  // Modals & Panels
  const [showStatusDrawer, setShowStatusDrawer] = useState(false);
  const [stories, setStories] = useState<StatusStory[]>(DEFAULT_STORIES);
  const [activeStory, setActiveStory] = useState<StatusStory | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showAddStatusModal, setShowAddStatusModal] = useState(false);
  const [newStatusText, setNewStatusText] = useState('');
  const [newStatusBg, setNewStatusBg] = useState('#005c4b');
  const [statusStoryReply, setStatusStoryReply] = useState('');

  // Composer menus & pickers
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);

  // Calling Dialog
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('video');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // In-Chat Search Bar
  const [showInChatSearch, setShowInChatSearch] = useState(false);
  const [inChatSearchQuery, setInChatSearchQuery] = useState('');

  // Multi-message selection mode
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);

  // Poll Creator Modal
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [interactivePollVotes, setInteractivePollVotes] = useState<Record<string, Record<number, number>>>({});

  // VIONEX Video Share Modal
  const [showVionexShareModal, setShowVionexShareModal] = useState(false);

  // Audio Voice Note Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const recordTimerRef = useRef<any>(null);

  // Audio Voice Note Playback State (msgId -> isPlaying)
  const [playingVoiceNoteId, setPlayingVoiceNoteId] = useState<string | null>(null);
  const [voicePlaybackProgress, setVoicePlaybackProgress] = useState(0);

  // Replying state
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  // Dropdown states
  const [activeMessageMenu, setActiveMessageMenu] = useState<string | null>(null);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Load conversations & stories
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

  // Sync messages when active conversation changes
  useEffect(() => {
    if (activeConvId) {
      const msgs = getStoredMessages(activeConvId);
      setMessages(msgs);
      setActiveMessageMenu(null);
      setShowInChatSearch(false);
      setInChatSearchQuery('');
      setIsSelectionMode(false);
      setSelectedMessageIds([]);

      // Mark unread as read in conversation list
      setConversations(prev =>
        prev.map(c => (c.id === activeConvId ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [activeConvId]);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, peerTypingState]);

  // Story progress timer
  useEffect(() => {
    let interval: any;
    if (activeStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress(p => {
          if (p >= 100) {
            setStories(prev =>
              prev.map(s => (s.id === activeStory.id ? { ...s, hasViewed: true } : s))
            );
            setActiveStory(null);
            return 0;
          }
          return p + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeStory]);

  // Calling timer
  useEffect(() => {
    let timer: any;
    if (showCallModal) {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showCallModal]);

  // Voice note playback simulator
  useEffect(() => {
    let timer: any;
    if (playingVoiceNoteId) {
      setVoicePlaybackProgress(0);
      timer = setInterval(() => {
        setVoicePlaybackProgress(p => {
          if (p >= 100) {
            setPlayingVoiceNoteId(null);
            return 0;
          }
          return p + 5;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [playingVoiceNoteId]);

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  // Send message with real-time peer response and tick progression
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    const newMsgId = 'm-' + Date.now();
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const sent: ChatMessage = {
      id: newMsgId,
      clientTransactionId: 'tx-' + Date.now(),
      conversationId: activeConvId,
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
      text: messageText,
      isE2EE: true,
      state: 'SENT',
      timestamp: timestampStr
    };

    if (replyingTo) {
      sent.replyTo = {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        text: replyingTo.text
      };
      setReplyingTo(null);
    }

    // Append to local state and storage
    const updatedMessages = [...messages, sent];
    setMessages(updatedMessages);
    saveMessages(activeConvId, updatedMessages);
    setInputText('');
    setShowEmojiPicker(false);
    setShowAttachMenu(false);

    // Update conversation last message snippet
    setConversations(prev =>
      prev.map(c =>
        c.id === activeConvId
          ? {
              ...c,
              lastMessage: {
                text: messageText,
                timestamp: timestampStr,
                state: 'SENT'
              }
            }
          : c
      )
    );

    // Progression 1: DELIVERED (800ms)
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === newMsgId ? { ...m, state: 'DELIVERED' } : m))
      );
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConvId && c.lastMessage
            ? { ...c, lastMessage: { ...c.lastMessage, state: 'DELIVERED' } }
            : c
        )
      );
    }, 800);

    // Progression 2: READ (1600ms) & trigger typing indicator
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => (m.id === newMsgId ? { ...m, state: 'READ' } : m))
      );
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConvId && c.lastMessage
            ? { ...c, lastMessage: { ...c.lastMessage, state: 'READ' } }
            : c
        )
      );
      // Contact starts typing
      setPeerTypingState(prev => ({ ...prev, [activeConvId]: true }));
    }, 1600);

    // Progression 3: Peer authentic response (3400ms)
    setTimeout(() => {
      setPeerTypingState(prev => ({ ...prev, [activeConvId]: false }));

      const participantId = activeConv?.participantId || 'mkbhd';
      const availableReplies = PEER_PERSONA_REPLIES[participantId] || [
        'Awesome! Thanks for sharing this update.',
        'Got it! Looking over the details right now.',
        'Sounds good. Let’s sync up on VIONEX soon!'
      ];
      const randomReply = availableReplies[Math.floor(Math.random() * availableReplies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const peerMsg: ChatMessage = {
        id: 'peer-' + Date.now(),
        clientTransactionId: 'tx-peer-' + Date.now(),
        conversationId: activeConvId,
        senderId: participantId,
        senderName: activeConv?.name || 'Contact',
        senderAvatar: activeConv?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
        text: randomReply,
        isE2EE: true,
        state: 'READ',
        timestamp: replyTime
      };

      setMessages(current => {
        const withPeer = [...current, peerMsg];
        saveMessages(activeConvId, withPeer);
        return withPeer;
      });

      // Update snippet in conversation list
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConvId
            ? {
                ...c,
                lastMessage: {
                  text: randomReply,
                  timestamp: replyTime,
                  state: 'READ'
                }
              }
            : c
        )
      );
    }, 3400);
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    setCallType(type);
    setShowCallModal(true);
    setCallDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
  };

  const handleInsertEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    chatInputRef.current?.focus();
  };

  // Voice recording simulation
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
    showToast('Voice message sent');
  };

  // File Attachments
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isMedia: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const sent = sendChatMessage(activeConvId, isMedia ? `📷 ${file.name}` : `📄 ${file.name}`);
    sent.attachments = [
      {
        name: file.name,
        url: fakeUrl,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      }
    ];
    setMessages(prev => [...prev, sent]);
    setShowAttachMenu(false);
    e.target.value = '';
    showToast(isMedia ? 'Photo/Video attached' : 'Document attached');
  };

  // Poll creation & voting
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
    showToast('Poll created and sent');
  };

  const handleVotePoll = (msgId: string, optionIndex: number) => {
    setInteractivePollVotes(prev => {
      const pollVotes = prev[msgId] || {};
      const current = pollVotes[optionIndex] || 0;
      return {
        ...prev,
        [msgId]: {
          ...pollVotes,
          [optionIndex]: current + 1
        }
      };
    });
    showToast('Vote recorded');
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
    showToast('VIONEX video shared in chat');
  };

  // Post Status update
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
    showToast('Status published (24h)');
  };

  // Reply to Status in Chat
  const handleSendStatusReply = () => {
    if (!statusStoryReply.trim() || !activeStory) return;
    const sent = sendChatMessage(
      activeConvId,
      `Replied to your status: "${statusStoryReply.trim()}"`
    );
    setMessages(prev => [...prev, sent]);
    setStatusStoryReply('');
    setActiveStory(null);
    showToast('Reply sent to chat');
  };

  // Create new group chat
  const handleCreateNewGroup = () => {
    if (!newGroupName.trim() || selectedGroupMembers.length === 0) return;
    const newGroupId = 'group-' + Date.now();
    const newGroupConv: Conversation = {
      id: newGroupId,
      participantId: newGroupId,
      name: newGroupName.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200',
      isVerified: false,
      isOnline: true,
      unreadCount: 0,
      lastMessage: {
        text: 'Group created by you',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        state: 'SENT'
      }
    };

    const updated = [newGroupConv, ...conversations];
    setConversations(updated);
    saveConversations(updated);
    setActiveConvId(newGroupId);
    setShowNewGroupModal(false);
    setNewGroupName('');
    setSelectedGroupMembers([]);
    showToast(`Group "${newGroupName.trim()}" created`);
  };

  // Toggle Mute on Active Conversation
  const handleToggleMute = () => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConvId) {
          const isMuted = (c as any).isMuted;
          const nextMuted = !isMuted;
          showToast(nextMuted ? `Muted ${c.name}` : `Unmuted ${c.name}`);
          return { ...c, isMuted: nextMuted };
        }
        return c;
      })
    );
    setShowChatMenu(false);
  };

  // Clear Chat History
  const handleClearChat = () => {
    setMessages([]);
    saveMessages(activeConvId, []);
    setConversations(prev =>
      prev.map(c => (c.id === activeConvId ? { ...c, lastMessage: undefined } : c))
    );
    setShowChatMenu(false);
    showToast('Chat history cleared');
  };

  // Delete Conversation
  const handleDeleteChat = () => {
    const remaining = conversations.filter(c => c.id !== activeConvId);
    setConversations(remaining);
    saveConversations(remaining);
    if (remaining.length > 0) {
      setActiveConvId(remaining[0].id);
    }
    setShowChatMenu(false);
    showToast('Chat deleted');
  };

  // Batch delete selected messages
  const handleDeleteSelectedMessages = () => {
    const remaining = messages.filter(m => !selectedMessageIds.includes(m.id));
    setMessages(remaining);
    saveMessages(activeConvId, remaining);
    setIsSelectionMode(false);
    setSelectedMessageIds([]);
    showToast('Selected messages deleted');
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

  // Highlight in-chat search
  const displayedMessages = messages.filter(m => {
    if (!inChatSearchQuery.trim()) return true;
    return m.text.toLowerCase().includes(inChatSearchQuery.toLowerCase());
  });

  const formatCallTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full bg-[#f0f2f5] overflow-hidden select-none font-sans text-[#111b21] relative">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111b21]/90 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-[#00a884]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HIDDEN FILE INPUTS */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        className="hidden"
        onChange={e => handleFileChange(e, true)}
      />
      <input
        type="file"
        ref={docInputRef}
        className="hidden"
        onChange={e => handleFileChange(e, false)}
      />

      {/* ==================================================================== */}
      {/* COLUMN 1: MODERN WHATSAPP WEB LEFT NAVIGATION RAIL (64px)             */}
      {/* ==================================================================== */}
      <div className="w-16 bg-[#f0f2f5] border-r border-[#e9edef] flex flex-col items-center py-3 justify-between shrink-0 z-30 select-none">
        {/* Top Action Icons */}
        <div className="flex flex-col items-center gap-2 w-full">
          {/* 1. Chats Icon (Active Highlight) */}
          <button
            onClick={() => {
              setActiveRailTab('chats');
              setShowStatusDrawer(false);
              setShowSettingsDrawer(false);
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all relative ${
              activeRailTab === 'chats'
                ? 'bg-[#d9fdd3] text-[#00a884]'
                : 'text-[#54656f] hover:bg-black/5'
            }`}
            title="Chats"
          >
            <MessageSquare className="w-5 h-5" />
            {conversations.reduce((sum, c) => sum + c.unreadCount, 0) > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#25d366] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* 2. Status Stories Icon */}
          <button
            onClick={() => {
              setActiveRailTab('status');
              setShowStatusDrawer(true);
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all relative ${
              activeRailTab === 'status' || showStatusDrawer
                ? 'bg-[#d9fdd3] text-[#00a884]'
                : 'text-[#54656f] hover:bg-black/5'
            }`}
            title="Status updates"
          >
            <CircleDashed className="w-5 h-5" />
            {stories.some(s => !s.hasViewed) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#00a884] rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* 3. Broadcast Channels Icon */}
          <Link
            href="/channels"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#54656f] hover:bg-black/5 transition-all"
            title="Channels"
          >
            <Megaphone className="w-5 h-5" />
          </Link>

          {/* 4. Communities Icon */}
          <Link
            href="/communities"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#54656f] hover:bg-black/5 transition-all"
            title="Communities"
          >
            <Users className="w-5 h-5" />
          </Link>
        </div>

        {/* Bottom Rail Actions */}
        <div className="flex flex-col items-center gap-2 w-full">
          {/* Settings Drawer Button */}
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              showSettingsDrawer ? 'bg-[#d9fdd3] text-[#00a884]' : 'text-[#54656f] hover:bg-black/5'
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setShowUserProfileModal(true)}
            className="w-10 h-10 rounded-full overflow-hidden hover:opacity-90 ring-2 ring-transparent hover:ring-[#00a884] transition-all"
            title="Profile"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
              alt="You"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Back to VIONEX Video Hub */}
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all mt-1"
            title="Return to VIONEX Video"
          >
            <Film className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* COLUMN 2: WHATSAPP CHAT LIST & CONVERSATION SELECTOR (380px)         */}
      {/* ==================================================================== */}
      <div className="w-full sm:w-[380px] md:w-[400px] border-r border-[#e9edef] flex flex-col bg-white shrink-0 z-20">
        {/* Top Header */}
        <div className="h-16 bg-[#f0f2f5] px-4 flex items-center justify-between border-b border-[#e9edef]">
          <h1 className="font-bold text-xl text-[#111b21] tracking-tight">Chats</h1>

          <div className="flex items-center gap-1 text-[#54656f]">
            {/* New Chat Button */}
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
              title="New chat"
            >
              <SquarePen className="w-5 h-5 text-[#54656f]" />
            </button>

            {/* Chats Top Menu */}
            <div className="relative">
              <button
                onClick={() => setShowTopMenu(!showTopMenu)}
                className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                title="Menu"
              >
                <MoreVertical className="w-5 h-5 text-[#54656f]" />
              </button>

              {showTopMenu && (
                <div className="absolute top-12 right-0 w-56 bg-white rounded-xl shadow-2xl border border-[#e9edef] py-1.5 z-50 text-sm animate-in fade-in duration-100">
                  <button
                    onClick={() => {
                      setShowNewGroupModal(true);
                      setShowTopMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-3 text-[#111b21]"
                  >
                    <Users className="w-4 h-4 text-[#54656f]" />
                    <span>New group</span>
                  </button>

                  <Link
                    href="/communities"
                    onClick={() => setShowTopMenu(false)}
                    className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-3 text-[#111b21]"
                  >
                    <Megaphone className="w-4 h-4 text-[#54656f]" />
                    <span>New community</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowDeviceModal(true);
                      setShowTopMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-3 text-[#111b21]"
                  >
                    <QrCode className="w-4 h-4 text-[#54656f]" />
                    <span>Linked devices</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowSettingsDrawer(true);
                      setShowTopMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-3 text-[#111b21]"
                  >
                    <Settings className="w-4 h-4 text-[#54656f]" />
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-[#e9edef] my-1" />

                  <button
                    onClick={() => {
                      setShowTopMenu(false);
                      showToast('Logged out of WhatsApp Web session');
                    }}
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

        {/* Search Bar & Filter Chips */}
        <div className="px-3 py-2 bg-white border-b border-[#e9edef]">
          <div className="flex items-center bg-[#f0f2f5] rounded-lg px-3 py-1.5 focus-within:bg-white focus-within:ring-1 focus-within:ring-[#00a884]">
            <Search className="w-4 h-4 text-[#54656f] mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search or start a new chat"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#111b21] outline-none placeholder-[#54656f]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-[#54656f] hover:text-[#111b21]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 scrollbar-none text-xs">
            {(['all', 'unread', 'favorites', 'groups'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 capitalize ${
                  activeFilter === filter
                    ? 'bg-[#e7fce3] text-[#008069] font-semibold'
                    : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#f5f6f6]">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#667781]">
              No chats match "{searchQuery}"
            </div>
          ) : (
            filteredConversations.map(c => {
              const isActive = activeConvId === c.id;
              const isTyping = peerTypingState[c.id];
              const isMuted = (c as any).isMuted;

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
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold text-sm text-[#111b21] truncate">{c.name}</span>
                        {c.isPinned && <Pin className="w-3 h-3 text-[#667781] shrink-0 rotate-45" />}
                        {isMuted && <BellOff className="w-3 h-3 text-[#667781] shrink-0" />}
                      </div>
                      <span
                        className={`text-[11px] font-normal shrink-0 ${
                          c.unreadCount > 0 ? 'text-[#00a884] font-semibold' : 'text-[#667781]'
                        }`}
                      >
                        {c.lastMessage?.timestamp || '12:00'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {isTyping ? (
                        <p className="text-xs text-[#00a884] font-medium truncate flex items-center gap-1 animate-pulse">
                          <span>typing...</span>
                        </p>
                      ) : (
                        <p className="text-xs text-[#667781] truncate pr-2 flex items-center gap-1">
                          {c.lastMessage?.state === 'READ' && (
                            <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] shrink-0" />
                          )}
                          {c.lastMessage?.state === 'DELIVERED' && (
                            <CheckCheck className="w-3.5 h-3.5 text-[#8696a0] shrink-0" />
                          )}
                          {c.lastMessage?.state === 'SENT' && (
                            <Check className="w-3.5 h-3.5 text-[#8696a0] shrink-0" />
                          )}
                          <span className="truncate">{c.lastMessage?.text || 'Tap to chat'}</span>
                        </p>
                      )}

                      {c.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#25d366] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* COLUMN 3: WHATSAPP ACTIVE CHAT ROOM (flex-1)                         */}
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

          {/* Active Chat Header */}
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
                  {(activeConv as any).isMuted && (
                    <BellOff className="w-3.5 h-3.5 text-[#667781]" />
                  )}
                </div>
                <span className="text-xs text-[#667781] block">
                  {peerTypingState[activeConv.id] ? (
                    <span className="text-[#00a884] font-medium animate-pulse">typing...</span>
                  ) : activeConv.isOnline ? (
                    'online'
                  ) : (
                    activeConv.lastSeenText || 'last seen recently'
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[#54656f]">
              {/* HD Video Call */}
              <button
                onClick={() => handleStartCall('video')}
                className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                title="Video call"
              >
                <Video className="w-5 h-5 text-[#54656f]" />
              </button>

              {/* HD Voice Call */}
              <button
                onClick={() => handleStartCall('voice')}
                className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                title="Voice call"
              >
                <Phone className="w-5 h-5 text-[#54656f]" />
              </button>

              <div className="h-5 w-[1px] bg-[#e9edef] mx-1" />

              {/* Search in chat */}
              <button
                onClick={() => setShowInChatSearch(!showInChatSearch)}
                className={`p-2 rounded-full transition-colors ${
                  showInChatSearch ? 'bg-[#d9fdd3] text-[#008069]' : 'hover:bg-black/5 text-[#54656f]'
                }`}
                title="Search in chat"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Chat Actions 3-Dots Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors"
                  title="Menu"
                >
                  <MoreVertical className="w-5 h-5 text-[#54656f]" />
                </button>

                {showChatMenu && (
                  <div className="absolute top-12 right-0 w-52 bg-white rounded-xl shadow-2xl border border-[#e9edef] py-1.5 z-50 text-sm animate-in fade-in duration-100">
                    <button
                      onClick={() => {
                        setShowContactInfo(true);
                        setShowChatMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-2.5 text-[#111b21]"
                    >
                      <Info className="w-4 h-4 text-[#54656f]" />
                      <span>Contact info</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsSelectionMode(!isSelectionMode);
                        setShowChatMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-2.5 text-[#111b21]"
                    >
                      <CheckSquare className="w-4 h-4 text-[#54656f]" />
                      <span>Select messages</span>
                    </button>

                    <button
                      onClick={handleToggleMute}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-2.5 text-[#111b21]"
                    >
                      {(activeConv as any).isMuted ? (
                        <>
                          <Bell className="w-4 h-4 text-[#54656f]" />
                          <span>Unmute notifications</span>
                        </>
                      ) : (
                        <>
                          <BellOff className="w-4 h-4 text-[#54656f]" />
                          <span>Mute notifications</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleClearChat}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-2.5 text-[#111b21]"
                    >
                      <Trash2 className="w-4 h-4 text-[#54656f]" />
                      <span>Clear chat</span>
                    </button>

                    <div className="border-t border-[#e9edef] my-1" />

                    <button
                      onClick={handleDeleteChat}
                      className="w-full text-left px-4 py-2 hover:bg-[#f5f6f6] flex items-center gap-2.5 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete chat</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* In-Chat Search Bar Drawer (Slide Down) */}
          {showInChatSearch && (
            <div className="bg-[#f0f2f5] border-b border-[#e9edef] px-4 py-2 flex items-center justify-between z-20 animate-in slide-in-from-top duration-150 shadow-sm">
              <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-1.5 border border-[#e9edef]">
                <Search className="w-4 h-4 text-[#54656f] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search in chat..."
                  value={inChatSearchQuery}
                  onChange={e => setInChatSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#111b21] outline-none"
                  autoFocus
                />
                {inChatSearchQuery && (
                  <span className="text-[11px] text-[#667781] whitespace-nowrap ml-2">
                    {displayedMessages.length} match{displayedMessages.length !== 1 ? 'es' : ''}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setShowInChatSearch(false);
                  setInChatSearchQuery('');
                }}
                className="p-1.5 ml-2 rounded-full hover:bg-black/5 text-[#54656f]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 md:px-12 space-y-2 z-10">
            {/* Centered Yellow Encryption Notice */}
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

            {displayedMessages.map(m => {
              const isMe = m.senderId === 'current-user';
              const isVoiceNote = m.text.startsWith('🎤 Voice message');
              const isPoll = m.text.startsWith('📊 Poll:');
              const isSelected = selectedMessageIds.includes(m.id);

              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 group relative ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Multi-selection Checkbox */}
                  {isSelectionMode && (
                    <button
                      onClick={() => {
                        setSelectedMessageIds(prev =>
                          prev.includes(m.id)
                            ? prev.filter(id => id !== m.id)
                            : [...prev, m.id]
                        );
                      }}
                      className="p-1 rounded text-[#00a884] shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 fill-[#00a884] text-white" />
                      ) : (
                        <Square className="w-5 h-5 text-[#8696a0]" />
                      )}
                    </button>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-md rounded-lg px-3 py-2 shadow-sm text-sm relative group ${
                      isMe
                        ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none'
                        : 'bg-white text-[#111b21] rounded-tl-none'
                    } ${isSelected ? 'ring-2 ring-[#00a884]' : ''}`}
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
                        <div className="p-2 bg-white/70">
                          <p className="font-semibold text-xs text-[#111b21] line-clamp-1">{m.vionexRef.title}</p>
                          <span className="text-[10px] text-[#00a884] font-medium">vionex.tv{m.vionexRef.embedRoute}</span>
                        </div>
                      </Link>
                    )}

                    {/* File Attachments */}
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

                    {/* Interactive Voice Note Audio Player */}
                    {isVoiceNote ? (
                      <div className="flex items-center gap-3 py-1 pr-4">
                        <button
                          onClick={() => {
                            if (playingVoiceNoteId === m.id) {
                              setPlayingVoiceNoteId(null);
                            } else {
                              setPlayingVoiceNoteId(m.id);
                            }
                          }}
                          className="w-9 h-9 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow-sm shrink-0 hover:bg-[#008069]"
                        >
                          {playingVoiceNoteId === m.id ? (
                            <Pause className="w-4 h-4 fill-white" />
                          ) : (
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1">
                          {/* Animated Waveform Bars */}
                          <div className="flex items-center gap-0.5 h-6">
                            {[40, 70, 20, 90, 60, 30, 80, 50, 95, 45, 65, 85, 35, 75, 55, 90].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-colors ${
                                  playingVoiceNoteId === m.id && (i / 16) * 100 <= voicePlaybackProgress
                                    ? 'bg-[#00a884]'
                                    : 'bg-[#8696a0]'
                                }`}
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-[10px] text-[#667781] mt-0.5">
                            <span>{playingVoiceNoteId === m.id ? `0:0${Math.floor(voicePlaybackProgress / 20)}` : '0:00'}</span>
                            <span>0:05</span>
                          </div>
                        </div>
                      </div>
                    ) : isPoll ? (
                      // Interactive Poll Card
                      <div className="py-1">
                        <div className="font-bold text-xs text-[#111b21] mb-2 flex items-center gap-1.5">
                          <BarChart2 className="w-4 h-4 text-[#00a884]" />
                          <span>{m.text.split('\n')[0].replace('📊 Poll: ', '')}</span>
                        </div>
                        <div className="space-y-1.5">
                          {m.text.split('\n').slice(1).map((optLine, optIdx) => {
                            const optText = optLine.replace(/^\d+\.\s*/, '');
                            const pollData = interactivePollVotes[m.id] || {};
                            const votes = pollData[optIdx] || 0;
                            const totalVotes = Object.values(pollData).reduce((a, b) => a + b, 0);
                            const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleVotePoll(m.id, optIdx)}
                                className="w-full text-left p-2 rounded-lg bg-black/5 hover:bg-black/10 transition-all text-xs relative overflow-hidden group"
                              >
                                <div
                                  className="absolute inset-y-0 left-0 bg-[#00a884]/20 transition-all duration-300"
                                  style={{ width: `${percent}%` }}
                                />
                                <div className="relative flex items-center justify-between z-10">
                                  <span className="font-medium text-[#111b21]">{optText}</span>
                                  <span className="text-[11px] text-[#667781] font-bold">{votes} ({percent}%)</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="text-[10px] text-[#667781] mt-1 text-right">
                          Tap option to vote
                        </div>
                      </div>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    )}

                    {/* Timestamp & Ticks */}
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
                      className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-white text-[#54656f] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Message Dropdown Menu */}
                    {activeMessageMenu === m.id && (
                      <div className="absolute top-7 right-1 w-44 bg-white rounded-xl shadow-2xl border border-[#e9edef] py-1 z-30 text-xs animate-in fade-in duration-100">
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
                            showToast('Message copied');
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

                        <button
                          onClick={() => {
                            addMessageReaction(activeConvId, m.id, '👍');
                            setActiveMessageMenu(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f5f6f6] flex items-center gap-2 text-[#111b21]"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
                          <span>React 👍</span>
                        </button>

                        <div className="border-t border-[#e9edef] my-1" />

                        <button
                          onClick={() => {
                            deleteChatMessage(activeConvId, m.id);
                            setMessages(getStoredMessages(activeConvId));
                            setActiveMessageMenu(null);
                            showToast('Message deleted');
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#f5f6f6] flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Emoji Reactions below bubble */}
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
            <div className="bg-white border-t border-[#e9edef] p-3 shadow-2xl z-20 max-h-60 overflow-y-auto animate-in slide-in-from-bottom-2 duration-150">
              {/* Category selector */}
              <div className="flex items-center justify-between pb-2 border-b border-[#e9edef] mb-2 text-xs">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {EMOJI_CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveEmojiCategory(idx)}
                      className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                        activeEmojiCategory === idx
                          ? 'bg-[#00a884] text-white'
                          : 'bg-[#f0f2f5] text-[#54656f] hover:bg-[#e9edef]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Emoji Grid */}
              <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1 text-2xl select-none">
                {EMOJI_CATEGORIES[activeEmojiCategory].emojis.map((emoji, idx) => (
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
            <div className="absolute bottom-20 left-4 bg-white rounded-2xl shadow-2xl border border-[#e9edef] p-3 z-30 flex flex-col gap-2 w-60 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f5f6f6] text-left transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#007bfc] text-white flex items-center justify-center shadow-md">
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
                <div className="w-10 h-10 rounded-full bg-[#5f66cd] text-white flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111b21]">Document</p>
                  <span className="text-[11px] text-[#667781]">Share PDF, doc, code</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowVionexShareModal(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#f5f6f6] text-left transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-md">
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
                <div className="w-10 h-10 rounded-full bg-[#ffb600] text-white flex items-center justify-center shadow-md">
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
          {/* QUOTED REPLY BANNER                                              */}
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
          {/* MULTI-SELECTION BOTTOM ACTION BAR                                */}
          {/* ================================================================ */}
          {isSelectionMode ? (
            <div className="px-4 py-3 bg-[#f0f2f5] border-t border-[#e9edef] flex items-center justify-between z-10">
              <span className="font-semibold text-sm text-[#111b21]">
                {selectedMessageIds.length} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteSelectedMessages}
                  disabled={selectedMessageIds.length === 0}
                  className="px-4 py-1.5 rounded-lg bg-red-600 disabled:opacity-50 text-white text-xs font-semibold hover:bg-red-700 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete selected</span>
                </button>
                <button
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedMessageIds([]);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-neutral-200 text-[#111b21] text-xs font-semibold hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Standard WhatsApp Composer Bar */
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
                      onChange={e => setInputText(e.target.value)}
                      className="w-full bg-white text-[#111b21] text-sm px-4 py-2.5 rounded-lg outline-none placeholder-[#8696a0]"
                    />
                  </form>

                  {inputText.trim() ? (
                    <button
                      type="button"
                      onClick={() => handleSendMessage()}
                      className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#008069] text-white transition-all shadow-sm active:scale-95 shrink-0"
                      title="Send message"
                    >
                      <Send className="w-5 h-5 ml-0.5" />
                    </button>
                  ) : (
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
          )}
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
        <div className="fixed inset-y-0 left-0 sm:left-16 sm:w-[380px] w-full bg-[#f0f2f5] z-40 shadow-2xl flex flex-col border-r border-[#e9edef] animate-in slide-in-from-left duration-200">
          <div className="h-16 bg-[#008069] text-white px-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStatusDrawer(false)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold">Status</h2>
            </div>
            <button
              onClick={() => setShowAddStatusModal(true)}
              className="p-1.5 rounded-full hover:bg-white/10"
              title="Add status update"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* My Status Row */}
            <div
              onClick={() => setShowAddStatusModal(true)}
              className="p-4 bg-white flex items-center justify-between border-b border-[#e9edef] cursor-pointer hover:bg-[#f5f6f6] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
                    alt="My Status"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#00a884] text-white rounded-full flex items-center justify-center ring-2 ring-white">
                    <Plus className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#111b21]">My status</p>
                  <span className="text-xs text-[#667781]">Tap to add status update</span>
                </div>
              </div>
            </div>

            {/* Recent Updates Header */}
            <div className="px-4 py-3 text-xs font-bold text-[#008069] uppercase tracking-wider">
              Recent updates
            </div>

            {/* Stories List */}
            <div className="divide-y divide-[#f5f6f6] bg-white">
              {stories.map(story => (
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
                        story.hasViewed ? 'ring-2 ring-[#8696a0]' : 'ring-2 ring-[#00a884]'
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

            {/* Story Caption and Working Reply Input */}
            <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-30 text-white">
              {activeStory.caption && (
                <p className="text-sm text-center mb-3 drop-shadow">{activeStory.caption}</p>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Reply to status..."
                  value={statusStoryReply}
                  onChange={e => setStatusStoryReply(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSendStatusReply();
                  }}
                  className="flex-1 bg-white/20 text-white text-xs px-4 py-2.5 rounded-full placeholder-white/60 outline-none backdrop-blur-md border border-white/20"
                />
                <button
                  onClick={handleSendStatusReply}
                  disabled={!statusStoryReply.trim()}
                  className="p-2.5 rounded-full bg-[#00a884] text-white disabled:opacity-50 hover:bg-[#008069] transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] mb-4">
              <h3 className="font-bold text-base text-[#111b21]">New Status Update</h3>
              <button
                onClick={() => setShowAddStatusModal(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
              >
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
                onChange={e => setNewStatusText(e.target.value)}
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
                  className={`w-7 h-7 rounded-full transition-transform ${
                    newStatusBg === color ? 'scale-125 ring-2 ring-black' : ''
                  }`}
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
      {/* NEW CHAT MODAL (Switch or Start Conversation)                        */}
      {/* ==================================================================== */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-[#e9edef]">
            <div className="h-14 bg-[#008069] text-white px-4 flex items-center justify-between">
              <h3 className="font-bold text-base">New Chat</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-[#e9edef]">
              <input
                type="text"
                placeholder="Search verified contacts..."
                className="w-full bg-[#f0f2f5] text-sm px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#f5f6f6]">
              {Object.values(AUTHENTIC_CHANNELS).map(ch => (
                <div
                  key={ch.handle}
                  onClick={() => {
                    const convId = 'conv-' + ch.handle;
                    // Check if conversation exists
                    const exists = conversations.find(c => c.id === convId);
                    if (!exists) {
                      const newConv: Conversation = {
                        id: convId,
                        participantId: ch.handle,
                        name: ch.name,
                        avatarUrl: ch.avatarUrl,
                        isVerified: true,
                        isOnline: true,
                        unreadCount: 0,
                        lastMessage: {
                          text: 'Conversation started',
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          state: 'SENT'
                        }
                      };
                      const updated = [newConv, ...conversations];
                      setConversations(updated);
                      saveConversations(updated);
                    }
                    setActiveConvId(convId);
                    setShowNewChatModal(false);
                    showToast(`Opened chat with ${ch.name}`);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-[#f5f6f6] cursor-pointer transition-colors"
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
      {/* NEW GROUP CREATOR MODAL                                              */}
      {/* ==================================================================== */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] mb-4">
              <h3 className="font-bold text-base text-[#111b21]">Create New Group</h3>
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-[#54656f] block mb-1">Group Name</label>
              <input
                type="text"
                placeholder="e.g. VIONEX Creator Roundtable"
                value={newGroupName}
                onChange={e => setNewGroupName(e.target.value)}
                className="w-full bg-[#f0f2f5] text-sm px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-[#54656f] block mb-2">Select Members</label>
              <div className="max-h-48 overflow-y-auto space-y-1 border border-[#e9edef] rounded-lg p-2">
                {Object.values(AUTHENTIC_CHANNELS).map(ch => {
                  const isChecked = selectedGroupMembers.includes(ch.handle);
                  return (
                    <div
                      key={ch.handle}
                      onClick={() => {
                        setSelectedGroupMembers(prev =>
                          prev.includes(ch.handle)
                            ? prev.filter(h => h !== ch.handle)
                            : [...prev, ch.handle]
                        );
                      }}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-[#f5f6f6] cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={ch.avatarUrl} alt={ch.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-semibold text-[#111b21]">{ch.name}</p>
                          <span className="text-[10px] text-[#667781]">@{ch.handle}</span>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-[#00a884] border-[#00a884] text-white' : 'border-[#8696a0]'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleCreateNewGroup}
              disabled={!newGroupName.trim() || selectedGroupMembers.length === 0}
              className="w-full py-2.5 rounded-full bg-[#00a884] hover:bg-[#008069] disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              Create Group ({selectedGroupMembers.length} members)
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* VIONEX VIDEO SHARE PICKER MODAL                                      */}
      {/* ==================================================================== */}
      {showVionexShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#FF0000] flex items-center justify-center text-white">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <h3 className="font-bold text-base text-[#111b21]">Share VIONEX Video</h3>
              </div>
              <button
                onClick={() => setShowVionexShareModal(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
              >
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
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f0f2f5] cursor-pointer border border-[#e9edef] transition-colors"
                >
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-24 aspect-video rounded-lg object-cover shrink-0"
                  />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e9edef] mb-4">
              <h3 className="font-bold text-base text-[#111b21]">Create Poll</h3>
              <button
                onClick={() => setShowPollModal(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
              >
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
                  onChange={e => setPollQuestion(e.target.value)}
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
                    onChange={e => {
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
            <button
              onClick={() => setShowContactInfo(false)}
              className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex flex-col items-center text-center p-4 bg-[#f0f2f5] rounded-xl">
              <img
                src={activeConv.avatarUrl}
                alt={activeConv.name}
                className="w-20 h-20 rounded-full object-cover mb-2"
              />
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

            <div className="space-y-2 pt-2">
              <button
                onClick={handleToggleMute}
                className="w-full py-2.5 px-3 rounded-xl bg-[#f0f2f5] hover:bg-[#e9edef] text-sm text-[#111b21] font-medium flex items-center justify-between transition-colors"
              >
                <span>Mute notifications</span>
                {(activeConv as any).isMuted ? (
                  <BellOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Bell className="w-4 h-4 text-[#54656f]" />
                )}
              </button>

              <button
                onClick={handleClearChat}
                className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-sm text-red-600 font-medium flex items-center justify-between transition-colors"
              >
                <span>Clear chat history</span>
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SETTINGS DRAWER                                                      */}
      {/* ==================================================================== */}
      {showSettingsDrawer && (
        <div className="fixed inset-y-0 left-0 sm:left-16 sm:w-[380px] w-full bg-white z-40 shadow-2xl flex flex-col border-r border-[#e9edef] animate-in slide-in-from-left duration-200">
          <div className="h-16 bg-[#008069] text-white px-4 flex items-center gap-3 shrink-0 shadow-sm">
            <button
              onClick={() => setShowSettingsDrawer(false)}
              className="p-1 rounded-full hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold">Settings</h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#f5f6f6]">
            <div className="p-4 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-base text-[#111b21]">VIONEX Master Account</p>
                <span className="text-xs text-[#667781]">Available</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80">
                <div className="flex items-center gap-3 text-sm text-[#111b21]">
                  <Bell className="w-4 h-4 text-[#54656f]" />
                  <span>Notifications</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8696a0]" />
              </div>

              <div className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80">
                <div className="flex items-center gap-3 text-sm text-[#111b21]">
                  <Lock className="w-4 h-4 text-[#54656f]" />
                  <span>Privacy & Security</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8696a0]" />
              </div>

              <div className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80">
                <div className="flex items-center gap-3 text-sm text-[#111b21]">
                  <Sparkles className="w-4 h-4 text-[#54656f]" />
                  <span>Chat wallpaper & Theme</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8696a0]" />
              </div>

              <div className="flex items-center justify-between py-1 cursor-pointer hover:opacity-80">
                <div className="flex items-center gap-3 text-sm text-[#111b21]">
                  <HelpCircle className="w-4 h-4 text-[#54656f]" />
                  <span>Help & FAQ</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8696a0]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* USER PROFILE MODAL                                                   */}
      {/* ==================================================================== */}
      {showUserProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#e9edef] text-center">
            <div className="flex justify-end">
              <button
                onClick={() => setShowUserProfileModal(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3 ring-4 ring-[#00a884]/20"
            />
            <h3 className="font-bold text-lg text-[#111b21]">VIONEX Account</h3>
            <span className="text-xs text-[#00a884] font-medium block mb-4">Verified Creator</span>

            <div className="text-left bg-[#f0f2f5] p-3 rounded-xl mb-4 text-xs space-y-1.5">
              <span className="text-[#54656f] block uppercase font-bold text-[10px]">Your Name</span>
              <p className="font-semibold text-sm text-[#111b21]">Alex Rivera</p>
              <span className="text-[#54656f] block uppercase font-bold text-[10px] pt-1">About</span>
              <p className="text-[#111b21]">Building the future of video & real-time messaging on VIONEX</p>
            </div>

            <button
              onClick={() => setShowUserProfileModal(false)}
              className="w-full py-2 rounded-full bg-[#00a884] text-white text-xs font-semibold hover:bg-[#008069] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* LINKED DEVICES MODAL                                                 */}
      {/* ==================================================================== */}
      {showDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e9edef]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e9edef]">
              <div className="flex items-center gap-2">
                <QrCode className="w-6 h-6 text-[#00a884]" />
                <h3 className="font-bold text-lg text-[#111b21]">Linked devices</h3>
              </div>
              <button
                onClick={() => setShowDeviceModal(false)}
                className="p-1 rounded-full hover:bg-black/5 text-[#54656f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-[#f0f2f5] rounded-xl my-4">
              <QrCode className="w-36 h-36 text-[#111b21]" />
              <p className="text-xs text-[#54656f] mt-3 text-center">
                Point your phone camera at this screen to capture the code.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150">
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
