export interface Channel {
  name: string;
  handle: string;
  avatarUrl: string;
  isVerified?: boolean;
  subscribers?: string;
  subscribersCount?: number;
  bannerUrl?: string;
  bio?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  durationFormatted: string;
  videoUrl: string;
  channel: Channel;
  viewsCount: string;
  viewsNumeric: number;
  likesCount: number;
  publishedAt: string;
  category: string;
  tags: string[];
  commentsCount: number;
}

export interface ShortItem {
  id: string;
  title: string;
  channel: Channel;
  likes: string;
  likesCount: number;
  comments: string;
  shares: string;
  videoUrl: string;
  musicTitle: string;
  tags: string[];
}

export interface LiveStreamItem {
  id: string;
  title: string;
  channel: Channel;
  viewers: string;
  viewersNumeric: number;
  category: string;
  thumbnailUrl: string;
  streamUrl: string;
  startedAt: string;
  chatMessages: {
    id: string;
    author: string;
    avatar: string;
    message: string;
    timestamp: string;
    isSuperChat?: boolean;
    amount?: string;
  }[];
}

export interface PlaylistItem {
  id: string;
  title: string;
  description?: string;
  videoCount: number;
  thumbnailUrl: string;
  updatedAt: string;
  isPrivate: boolean;
  videos: string[]; // video IDs
}

export interface CommentItem {
  id: string;
  videoId: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  replies?: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  avatar?: string;
  videoId?: string;
}

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-demo-001',
    title: 'Building a Full-Scale YouTube Platform from Scratch with Next.js & Fastify',
    description: 'In this session, we architect and build VIONEX — a scalable, production-ready, self-hostable video platform designed with clean TypeScript, Fastify REST APIs, BullMQ asynchronous FFmpeg media processing, and WebRTC P2P-assisted HLS playback.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop',
    duration: 1845,
    durationFormatted: '30:45',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channel: {
      handle: 'vionex-labs',
      name: 'VIONEX Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      subscribers: '425K subscribers',
      subscribersCount: 425000,
      bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop',
      bio: 'Deep-dive software architecture, high throughput distributed systems, and modern video streaming engineering.'
    },
    viewsCount: '124,500',
    viewsNumeric: 124500,
    likesCount: 1420,
    publishedAt: '2 days ago',
    category: 'Technology',
    tags: ['Architecture', 'Next.js', 'Fastify', 'Streaming', 'TypeScript'],
    commentsCount: 148
  },
  {
    id: 'vid-demo-002',
    title: 'Ultra-Low Latency Live Streaming with Node.js, RTMP, and WebRTC Datachannels',
    description: 'Explore the internals of media servers: converting RTMP broadcast feeds to sub-second low latency HLS (LL-HLS) alongside peer-to-peer data swarming for 80% CDN egress reduction.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1280&auto=format&fit=crop',
    duration: 2540,
    durationFormatted: '42:20',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channel: {
      handle: 'stream-engineering',
      name: 'Stream Engineering Lab',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      subscribers: '180K subscribers',
      subscribersCount: 180000,
      bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
      bio: 'Pioneering open media delivery networks and distributed video pipelines.'
    },
    viewsCount: '89,200',
    viewsNumeric: 89200,
    likesCount: 940,
    publishedAt: '4 days ago',
    category: 'Coding',
    tags: ['LiveStreaming', 'WebRTC', 'RTMP', 'FFmpeg'],
    commentsCount: 92
  },
  {
    id: 'vid-demo-003',
    title: 'Adaptive Bitrate Transcoding Pipelines: FFmpeg Aligned Keyframes & HLS Demystified',
    description: 'Learn why aligned keyframes (GOP size = 2s) are mandatory for seamless multi-rendition HLS switching without audio pops or video drops. Hands-on commandline benchmarking included.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1280&auto=format&fit=crop',
    duration: 1120,
    durationFormatted: '18:40',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channel: {
      handle: 'dev-ops-elite',
      name: 'DevOps Elite',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      subscribers: '310K subscribers',
      subscribersCount: 310000,
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
      bio: 'Cloud-native CI/CD, Kubernetes video rendering clusters, and media worker pipelines.'
    },
    viewsCount: '45,100',
    viewsNumeric: 45100,
    likesCount: 512,
    publishedAt: '1 week ago',
    category: 'Coding',
    tags: ['FFmpeg', 'Transcoding', 'HLS', 'MediaWorker'],
    commentsCount: 46
  },
  {
    id: 'vid-demo-004',
    title: 'Atmospheric Ambient Light & Canvas Shaders in HTML5 Video Players',
    description: 'How to build the modern dynamic lighting glow around video players using hidden offscreen canvas downsampling and CSS blur filters at 60fps.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1280&auto=format&fit=crop',
    duration: 890,
    durationFormatted: '14:50',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channel: {
      handle: 'frontend-masters-lab',
      name: 'Frontend Masters Lab',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      subscribers: '650K subscribers',
      subscribersCount: 650000,
      bannerUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1600&auto=format&fit=crop',
      bio: 'Crafting pixel-perfect animations, canvas rendering engines, and cutting-edge user interfaces.'
    },
    viewsCount: '215,800',
    viewsNumeric: 215800,
    likesCount: 3200,
    publishedAt: '3 days ago',
    category: 'Technology',
    tags: ['Frontend', 'Canvas', 'WebGL', 'UIUX'],
    commentsCount: 210
  },
  {
    id: 'vid-demo-005',
    title: 'Next-Gen Graphics Architecture: Path Tracing Hardware Deep Dive 2026',
    description: 'A deep architectural dissection of modern GPU acceleration cores, hardware BVH traversal units, and neural reconstruction denoisers.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop',
    duration: 3200,
    durationFormatted: '53:20',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channel: {
      handle: 'hardware-benchmark',
      name: 'Hardware Foundry',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      subscribers: '540K subscribers',
      subscribersCount: 540000,
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
      bio: 'Frame-precise GPU analysis, graphics architectures, and game engine benchmarks.'
    },
    viewsCount: '584,100',
    viewsNumeric: 584100,
    likesCount: 7200,
    publishedAt: '5 days ago',
    category: 'Gaming',
    tags: ['Gaming', 'Hardware', 'PathTracing', 'Benchmarks'],
    commentsCount: 630
  },
  {
    id: 'vid-demo-006',
    title: 'Quantum Computing in 2026: Quantum Error Correction Explained Simply',
    description: 'A clear conceptual breakthrough walkthrough explaining surface code error correction and logical qubits without dense mathematical jargon.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1280&auto=format&fit=crop',
    duration: 1780,
    durationFormatted: '29:40',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channel: {
      handle: 'quantum-frontier',
      name: 'Quantum Frontier',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      subscribers: '720K subscribers',
      subscribersCount: 720000,
      bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
      bio: 'Exploring cutting-edge physics, quantum computing, and future science.'
    },
    viewsCount: '890,400',
    viewsNumeric: 890400,
    likesCount: 12400,
    publishedAt: '1 week ago',
    category: 'Science',
    tags: ['Science', 'Quantum', 'Physics', 'Technology'],
    commentsCount: 940
  },
  {
    id: 'vid-demo-007',
    title: 'Designing Resilient Distributed Databases: Raft, Paxos, and Vector Clocks',
    description: 'How modern globally-distributed databases maintain strict consistency, handle partitions, and resolve conflicts at high concurrency.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1280&auto=format&fit=crop',
    duration: 2120,
    durationFormatted: '35:20',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channel: {
      handle: 'vionex-labs',
      name: 'VIONEX Engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      subscribers: '425K subscribers',
      subscribersCount: 425000,
      bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop',
      bio: 'Deep-dive software architecture, high throughput distributed systems, and modern video streaming engineering.'
    },
    viewsCount: '98,000',
    viewsNumeric: 98000,
    likesCount: 1680,
    publishedAt: '2 weeks ago',
    category: 'Coding',
    tags: ['Databases', 'DistributedSystems', 'Raft', 'Backend'],
    commentsCount: 112
  },
  {
    id: 'vid-demo-008',
    title: 'SpaceX Starship Orbital Refueling Demo & Mars Interplanetary Architecture',
    description: 'Detailed technical analysis of cryo-propellant zero-g transfer, heat shield tiles refurbishment, and high-cadence launch architecture.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517976487502-5f69d300062a?q=80&w=1280&auto=format&fit=crop',
    duration: 1650,
    durationFormatted: '27:30',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channel: {
      handle: 'space-flight-now',
      name: 'Orbital Dynamics',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop',
      isVerified: true,
      subscribers: '1.2M subscribers',
      subscribersCount: 1200000,
      bannerUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
      bio: 'Aerospace engineering, space exploration, rocket telemetry.'
    },
    viewsCount: '1,420,000',
    viewsNumeric: 1420000,
    likesCount: 38200,
    publishedAt: '6 days ago',
    category: 'Science',
    tags: ['Space', 'Aerospace', 'Starship', 'Rockets'],
    commentsCount: 1840
  }
];

export const INITIAL_SHORTS: ShortItem[] = [
  {
    id: 'short-001',
    title: '5 Git tricks every Senior Developer uses daily ⚡',
    channel: {
      name: 'VIONEX Engineering',
      handle: 'vionex-labs',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isVerified: true
    },
    likes: '48.2K',
    likesCount: 48200,
    comments: '1,240',
    shares: '8.4K',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    musicTitle: 'Lo-Fi Chill Beats - VIONEX Sounds',
    tags: ['#coding', '#git', '#devtools', '#tips']
  },
  {
    id: 'short-002',
    title: 'Why HTTP/3 and QUIC change Web Streaming forever 🚀',
    channel: {
      name: 'Stream Engineering Lab',
      handle: 'stream-engineering',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      isVerified: true
    },
    likes: '89.1K',
    likesCount: 89100,
    comments: '3,100',
    shares: '14.2K',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    musicTitle: 'Cyber Synth Pulse - Tokyo Neon',
    tags: ['#networking', '#webdev', '#http3', '#tech']
  },
  {
    id: 'short-003',
    title: 'Insane Ray Tracing physics demonstration in Unreal 5.5 🔥',
    channel: {
      name: 'Hardware Foundry',
      handle: 'hardware-benchmark',
      avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop',
      isVerified: true
    },
    likes: '142K',
    likesCount: 142000,
    comments: '4,520',
    shares: '22.8K',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    musicTitle: 'Epic Bass Drop - Game Audio Lab',
    tags: ['#gaming', '#unrealengine', '#raytracing', '#fps']
  },
  {
    id: 'short-004',
    title: 'Analog Synthesizer patch build from scratch in 60s 🎹',
    channel: {
      name: 'Tokyo Synth Collective',
      handle: 'synth-wave-collective',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      isVerified: true
    },
    likes: '34.5K',
    likesCount: 34500,
    comments: '890',
    shares: '5.2K',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    musicTitle: 'Original Audio - Modular Synthesis',
    tags: ['#musicproduction', '#modular', '#synth', '#creative']
  }
];

export const INITIAL_LIVE_STREAMS: LiveStreamItem[] = [
  {
    id: 'live-001',
    title: '🔴 Coding VIONEX Live: Adding Peer-to-Peer WebRTC DataChannel Swarms',
    channel: {
      name: 'VIONEX Engineering',
      handle: 'vionex-labs',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      isVerified: true
    },
    viewers: '14,280',
    viewersNumeric: 14280,
    category: 'Coding & Tech',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1280&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    startedAt: 'Started 42 minutes ago',
    chatMessages: [
      { id: 'c1', author: 'CodeNinja', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop', message: 'The WebRTC fallback circuit breaker is brilliant! 🚀', timestamp: '17:02' },
      { id: 'c2', author: 'FrontendDev_99', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop', message: 'What is the buffer threshold before falling back to CDN origin?', timestamp: '17:03' },
      { id: 'c3', author: 'Alex_Streams', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', message: 'Sent a $20 Super Chat! Love the architecture breakdown!', timestamp: '17:04', isSuperChat: true, amount: '$20.00' },
      { id: 'c4', author: 'Elena_V', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', message: 'Audio quality is so crisp today.', timestamp: '17:05' }
    ]
  },
  {
    id: 'live-002',
    title: '🔴 Grand Finals: Global Esports Championship 2026',
    channel: {
      name: 'Cyber Arena Pro',
      handle: 'cyber-arena',
      avatarUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
      isVerified: true
    },
    viewers: '85,400',
    viewersNumeric: 85400,
    category: 'Gaming',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1280&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    startedAt: 'Started 1 hour ago',
    chatMessages: [
      { id: 'cg1', author: 'PixelKing', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop', message: 'WHAT A FLICK SHOT! Unbelievable precision!', timestamp: '17:10' },
      { id: 'cg2', author: 'Nova_Gamer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', message: 'Gg to both teams, amazing set.', timestamp: '17:12' }
    ]
  }
];

export const INITIAL_PLAYLISTS: PlaylistItem[] = [
  {
    id: 'pl-001',
    title: 'Modern Distributed Systems & Media Architectures',
    description: 'Curated architectural tutorials on video pipelines, HLS transcoding, WebRTC peer swarming, and scalable databases.',
    videoCount: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop',
    updatedAt: 'Updated yesterday',
    isPrivate: false,
    videos: ['vid-demo-001', 'vid-demo-002', 'vid-demo-003', 'vid-demo-007']
  },
  {
    id: 'pl-002',
    title: 'Frontend Masterclass & Canvas Shaders',
    description: 'Deep dive into performant web styling, custom media controls, and GPU canvas effects.',
    videoCount: 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1280&auto=format&fit=crop',
    updatedAt: 'Updated 3 days ago',
    isPrivate: false,
    videos: ['vid-demo-004', 'vid-demo-001']
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Video from VIONEX Engineering',
    desc: 'Deep Dive: WebRTC P2P Mesh with HLS Adaptive Bitrate is now streaming.',
    time: '10m ago',
    unread: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    videoId: 'vid-demo-001'
  },
  {
    id: 'notif-2',
    title: 'Comment Hearted',
    desc: 'Stream Engineering Lab gave your comment on HLS GOP Alignment a heart!',
    time: '1h ago',
    unread: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'notif-3',
    title: 'Studio Milestone Reached',
    desc: 'Your channel surpassed 425,000 subscribers! View real-time analytics.',
    time: '5h ago',
    unread: false,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
  }
];

const IS_SERVER = typeof window === 'undefined';

export function getStoredVideos(): VideoItem[] {
  if (IS_SERVER) return INITIAL_VIDEOS;
  try {
    const raw = localStorage.getItem('vionex_custom_videos');
    if (raw) {
      const custom: VideoItem[] = JSON.parse(raw);
      return [...custom, ...INITIAL_VIDEOS];
    }
  } catch {}
  return INITIAL_VIDEOS;
}

export function saveCustomVideo(video: VideoItem) {
  if (IS_SERVER) return;
  try {
    const raw = localStorage.getItem('vionex_custom_videos');
    const custom: VideoItem[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem('vionex_custom_videos', JSON.stringify([video, ...custom]));
  } catch {}
}

export function deleteVideo(videoId: string): boolean {
  if (IS_SERVER) return false;
  try {
    const raw = localStorage.getItem('vionex_custom_videos');
    if (raw) {
      const custom: VideoItem[] = JSON.parse(raw);
      const filtered = custom.filter(v => v.id !== videoId);
      localStorage.setItem('vionex_custom_videos', JSON.stringify(filtered));
      return true;
    }
  } catch {}
  return false;
}

export function getStoredHistory(): VideoItem[] {
  if (IS_SERVER) return INITIAL_VIDEOS.slice(0, 3);
  try {
    const raw = localStorage.getItem('vionex_history');
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      const all = getStoredVideos();
      return ids.map(id => all.find(v => v.id === id)).filter(Boolean) as VideoItem[];
    }
  } catch {}
  return INITIAL_VIDEOS.slice(0, 3);
}

export function addToHistory(video: VideoItem) {
  if (IS_SERVER) return;
  try {
    const paused = localStorage.getItem('vionex_history_paused') === 'true';
    if (paused) return;

    const raw = localStorage.getItem('vionex_history');
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const filtered = ids.filter(id => id !== video.id);
    localStorage.setItem('vionex_history', JSON.stringify([video.id, ...filtered]));
  } catch {}
}

export function clearHistory() {
  if (IS_SERVER) return;
  try {
    localStorage.setItem('vionex_history', JSON.stringify([]));
  } catch {}
}

export function removeFromHistory(videoId: string) {
  if (IS_SERVER) return;
  try {
    const raw = localStorage.getItem('vionex_history');
    const ids: string[] = raw ? JSON.parse(raw) : [];
    localStorage.setItem('vionex_history', JSON.stringify(ids.filter(id => id !== videoId)));
  } catch {}
}

export function togglePauseHistory(): boolean {
  if (IS_SERVER) return false;
  try {
    const current = localStorage.getItem('vionex_history_paused') === 'true';
    localStorage.setItem('vionex_history_paused', (!current).toString());
    return !current;
  } catch {
    return false;
  }
}

export function isHistoryPaused(): boolean {
  if (IS_SERVER) return false;
  return localStorage.getItem('vionex_history_paused') === 'true';
}

export function getLikedVideos(): VideoItem[] {
  if (IS_SERVER) return INITIAL_VIDEOS.slice(0, 3);
  try {
    const raw = localStorage.getItem('vionex_liked');
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      const all = getStoredVideos();
      return ids.map(id => all.find(v => v.id === id)).filter(Boolean) as VideoItem[];
    }
  } catch {}
  return INITIAL_VIDEOS.slice(0, 3);
}

export function toggleLikeVideo(videoId: string): boolean {
  if (IS_SERVER) return false;
  try {
    const raw = localStorage.getItem('vionex_liked');
    const ids: string[] = raw ? JSON.parse(raw) : [INITIAL_VIDEOS[0].id, INITIAL_VIDEOS[1].id, INITIAL_VIDEOS[2].id];
    const isLiked = ids.includes(videoId);
    let nextIds: string[];
    if (isLiked) {
      nextIds = ids.filter(id => id !== videoId);
    } else {
      nextIds = [videoId, ...ids];
    }
    localStorage.setItem('vionex_liked', JSON.stringify(nextIds));
    return !isLiked;
  } catch {
    return false;
  }
}

export function isVideoLiked(videoId: string): boolean {
  if (IS_SERVER) return false;
  try {
    const raw = localStorage.getItem('vionex_liked');
    const ids: string[] = raw ? JSON.parse(raw) : [INITIAL_VIDEOS[0].id, INITIAL_VIDEOS[1].id, INITIAL_VIDEOS[2].id];
    return ids.includes(videoId);
  } catch {
    return false;
  }
}

export function getWatchLater(): VideoItem[] {
  if (IS_SERVER) return INITIAL_VIDEOS.slice(1, 4);
  try {
    const raw = localStorage.getItem('vionex_watch_later');
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      const all = getStoredVideos();
      return ids.map(id => all.find(v => v.id === id)).filter(Boolean) as VideoItem[];
    }
  } catch {}
  return INITIAL_VIDEOS.slice(1, 4);
}

export function toggleWatchLater(videoId: string): boolean {
  if (IS_SERVER) return false;
  try {
    const raw = localStorage.getItem('vionex_watch_later');
    const ids: string[] = raw ? JSON.parse(raw) : [INITIAL_VIDEOS[1].id, INITIAL_VIDEOS[2].id, INITIAL_VIDEOS[3].id];
    const isSaved = ids.includes(videoId);
    let nextIds: string[];
    if (isSaved) {
      nextIds = ids.filter(id => id !== videoId);
    } else {
      nextIds = [videoId, ...ids];
    }
    localStorage.setItem('vionex_watch_later', JSON.stringify(nextIds));
    return !isSaved;
  } catch {
    return false;
  }
}

export function isWatchLater(videoId: string): boolean {
  if (IS_SERVER) return false;
  try {
    const raw = localStorage.getItem('vionex_watch_later');
    const ids: string[] = raw ? JSON.parse(raw) : [INITIAL_VIDEOS[1].id, INITIAL_VIDEOS[2].id, INITIAL_VIDEOS[3].id];
    return ids.includes(videoId);
  } catch {
    return false;
  }
}

export function getPlaylists(): PlaylistItem[] {
  if (IS_SERVER) return INITIAL_PLAYLISTS;
  try {
    const raw = localStorage.getItem('vionex_playlists');
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_PLAYLISTS;
}

export function savePlaylist(playlist: PlaylistItem) {
  if (IS_SERVER) return;
  try {
    const current = getPlaylists();
    const updated = [playlist, ...current.filter(p => p.id !== playlist.id)];
    localStorage.setItem('vionex_playlists', JSON.stringify(updated));
  } catch {}
}

export function addVideoToPlaylist(playlistId: string, videoId: string): boolean {
  if (IS_SERVER) return false;
  try {
    const current = getPlaylists();
    const target = current.find(p => p.id === playlistId);
    if (!target) return false;
    if (!target.videos.includes(videoId)) {
      target.videos.push(videoId);
      target.videoCount = target.videos.length;
      target.updatedAt = 'Just now';
      localStorage.setItem('vionex_playlists', JSON.stringify(current));
      return true;
    }
  } catch {}
  return false;
}

export function removeVideoFromPlaylist(playlistId: string, videoId: string): boolean {
  if (IS_SERVER) return false;
  try {
    const current = getPlaylists();
    const target = current.find(p => p.id === playlistId);
    if (!target) return false;
    target.videos = target.videos.filter(v => v !== videoId);
    target.videoCount = target.videos.length;
    target.updatedAt = 'Just now';
    localStorage.setItem('vionex_playlists', JSON.stringify(current));
    return true;
  } catch {}
  return false;
}

export function deletePlaylist(playlistId: string): boolean {
  if (IS_SERVER) return false;
  try {
    const current = getPlaylists();
    const filtered = current.filter(p => p.id !== playlistId);
    localStorage.setItem('vionex_playlists', JSON.stringify(filtered));
    return true;
  } catch {}
  return false;
}

export function getSubscriptions(): string[] {
  if (IS_SERVER) return ['vionex-labs', 'stream-engineering'];
  try {
    const raw = localStorage.getItem('vionex_subscriptions');
    if (raw) return JSON.parse(raw);
  } catch {}
  return ['vionex-labs', 'stream-engineering'];
}

export function toggleSubscription(channelHandle: string): boolean {
  if (IS_SERVER) return false;
  try {
    const subs = getSubscriptions();
    const isSubbed = subs.includes(channelHandle);
    const nextSubs = isSubbed ? subs.filter(s => s !== channelHandle) : [...subs, channelHandle];
    localStorage.setItem('vionex_subscriptions', JSON.stringify(nextSubs));
    return !isSubbed;
  } catch {
    return false;
  }
}

export function getNotifications(): NotificationItem[] {
  if (IS_SERVER) return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem('vionex_notifications');
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_NOTIFICATIONS;
}

export function markNotificationRead(id: string) {
  if (IS_SERVER) return;
  try {
    const list = getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, unread: false } : n);
    localStorage.setItem('vionex_notifications', JSON.stringify(updated));
  } catch {}
}

export function markAllNotificationsRead() {
  if (IS_SERVER) return;
  try {
    const list = getNotifications();
    const updated = list.map(n => ({ ...n, unread: false }));
    localStorage.setItem('vionex_notifications', JSON.stringify(updated));
  } catch {}
}

export function getRecentSearches(): string[] {
  if (IS_SERVER) return ['HLS adaptive streaming', 'Next.js 15 Fastify', 'Two-Tower DNN', 'WebRTC Datachannels'];
  try {
    const raw = localStorage.getItem('vionex_recent_searches');
    if (raw) return JSON.parse(raw);
  } catch {}
  return ['HLS adaptive streaming', 'Next.js 15 Fastify', 'Two-Tower DNN', 'WebRTC Datachannels'];
}

export function addRecentSearch(query: string) {
  if (IS_SERVER || !query.trim()) return;
  try {
    const current = getRecentSearches();
    const filtered = current.filter(q => q.toLowerCase() !== query.toLowerCase());
    localStorage.setItem('vionex_recent_searches', JSON.stringify([query, ...filtered].slice(0, 8)));
  } catch {}
}

export function clearRecentSearches() {
  if (IS_SERVER) return;
  try {
    localStorage.setItem('vionex_recent_searches', JSON.stringify([]));
  } catch {}
}

/**
 * Deterministic number formatter that formats numbers with commas (e.g. 425,000)
 * identically on both Node.js SSR and client browsers regardless of user locale.
 */
export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '0';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);
  const parts = n.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function formatCompactNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) return '0';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return n.toString();
}

