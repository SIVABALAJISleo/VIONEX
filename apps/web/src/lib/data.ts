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

export const AUTHENTIC_CHANNELS: Record<string, Channel> = {
  mkbhd: {
    handle: 'mkbhd',
    name: 'Marques Brownlee',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    subscribers: '18.5M subscribers',
    subscribersCount: 18500000,
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    bio: 'Quality tech videos | YouTuber | Geek | Consumer electronics reviews and deep dives.'
  },
  fireship: {
    handle: 'fireship',
    name: 'Fireship',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    subscribers: '3.2M subscribers',
    subscribersCount: 3200000,
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop',
    bio: 'High-intensity code tutorials and tech news to help you ship apps faster.'
  },
  veritasium: {
    handle: 'veritasium',
    name: 'Veritasium',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    subscribers: '16.2M subscribers',
    subscribersCount: 16200000,
    bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
    bio: 'An element of truth - videos about physics, science, education, and anything interesting.'
  },
  lexfridman: {
    handle: 'lexfridman',
    name: 'Lex Fridman',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    subscribers: '4.3M subscribers',
    subscribersCount: 4300000,
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    bio: 'Conversations about AI, science, technology, history, philosophy, and the human condition.'
  },
  traversymedia: {
    handle: 'traversymedia',
    name: 'Traversy Media',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    subscribers: '2.2M subscribers',
    subscribersCount: 2200000,
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
    bio: 'Practical, project-based tutorials on web development, modern frontend, and backend architecture.'
  },
  kurzgesagt: {
    handle: 'kurzgesagt',
    name: 'Kurzgesagt – In a Nutshell',
    avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    subscribers: '22.8M subscribers',
    subscribersCount: 22800000,
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    bio: 'Videos explaining things with optimistic nihilism. We make science look beautiful and accessible.'
  },
  lofigirl: {
    handle: 'lofigirl',
    name: 'Lofi Girl',
    avatarUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    subscribers: '14.5M subscribers',
    subscribersCount: 14500000,
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
    bio: 'Peaceful lofi hip hop radio - beats to relax/study to 24/7.'
  },
  vionex: {
    handle: 'vionex',
    name: 'VIONEX Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    isVerified: true,
    subscribers: '540K subscribers',
    subscribersCount: 540000,
    bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop',
    bio: 'Official engineering channel for VIONEX: ABR streaming, WebRTC P2P delivery, and scalable media pipelines.'
  }
};

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-demo-001',
    title: 'Sintel: Open CGI Master Animation & Visual Fidelity Breakdown',
    description: 'Complete open-source CGI master animation rendered in Blender Cycles. Demonstrates procedural particle hair dynamics, volumetric smoke shading, and multi-channel audio mixing.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1280&auto=format&fit=crop',
    duration: 52,
    durationFormatted: '0:52',
    videoUrl: '/videos/short-3.mp4',
    channel: AUTHENTIC_CHANNELS.kurzgesagt,
    viewsCount: '1,240,500',
    viewsNumeric: 1240500,
    likesCount: 94200,
    publishedAt: '2 days ago',
    category: 'Technology',
    tags: ['Blender', 'CGI', 'OpenSource', 'Animation', 'Science'],
    commentsCount: 1840
  },
  {
    id: 'vid-demo-002',
    title: 'View From A Blue Moon: 4K Cinematic Action Camera Breakdown',
    description: 'Dissecting the RED 6K digital cinema sensors, aerial helicopter gimbals, and wide color gamut HDR mastering used in high-velocity outdoor cinematography.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop',
    duration: 183,
    durationFormatted: '3:03',
    videoUrl: '/videos/blue_moon.mp4',
    channel: AUTHENTIC_CHANNELS.mkbhd,
    viewsCount: '3,489,200',
    viewsNumeric: 3489200,
    likesCount: 182400,
    publishedAt: '4 days ago',
    category: 'Technology',
    tags: ['Technology', 'Cameras', 'MKBHD', 'Cinematography', 'HDR'],
    commentsCount: 3910
  },
  {
    id: 'vid-demo-003',
    title: 'Real-Time Edge AI & Object Detection with YOLOv10 in 100 Seconds',
    description: 'How modern convolution-free vision transformers and YOLO edge models achieve 120 FPS object classification directly in WebGPU browser runtimes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1280&auto=format&fit=crop',
    duration: 54,
    durationFormatted: '0:54',
    videoUrl: '/videos/short-2.mp4',
    channel: AUTHENTIC_CHANNELS.fireship,
    viewsCount: '1,845,100',
    viewsNumeric: 1845100,
    likesCount: 112500,
    publishedAt: '1 week ago',
    category: 'Coding',
    tags: ['Coding', 'AI', 'YOLO', 'WebGPU', 'Fireship'],
    commentsCount: 2450
  },
  {
    id: 'vid-demo-004',
    title: 'Deep Marine Ecosystems: Bioluminescence & Abyssal Physics',
    description: 'An exploration into deep ocean trenches, hydrostatic pressure adaptation, and the physics of underwater light propagation in total darkness.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1280&auto=format&fit=crop',
    duration: 46,
    durationFormatted: '0:46',
    videoUrl: '/videos/oceans.mp4',
    channel: AUTHENTIC_CHANNELS.veritasium,
    viewsCount: '4,215,800',
    viewsNumeric: 4215800,
    likesCount: 231000,
    publishedAt: '3 days ago',
    category: 'Science',
    tags: ['Science', 'Physics', 'Oceans', 'Veritasium', 'Biology'],
    commentsCount: 4120
  },
  {
    id: 'vid-demo-005',
    title: 'Big Buck Bunny: Adaptive Multi-Bitrate HLS Master Stream & Audio Sync',
    description: 'High-definition 1080p 60fps open-source reference stream with seamless multi-rendition switching, synchronized AAC stereo audio, and GOP-aligned keyframes.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop',
    duration: 634,
    durationFormatted: '10:34',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    channel: AUTHENTIC_CHANNELS.traversymedia,
    viewsCount: '2,584,100',
    viewsNumeric: 2584100,
    likesCount: 89400,
    publishedAt: '5 days ago',
    category: 'HLS Streaming',
    tags: ['HLS', 'Streaming', 'WebRTC', 'Technology', 'AudioSync'],
    commentsCount: 1680
  },
  {
    id: 'vid-demo-006',
    title: 'Tears of Steel: Sci-Fi Live-Action VFX & Dynamic HLS Transcoding',
    description: 'Exploring live-action 4K motion tracking, photorealistic robotic VFX integration, and sub-second chunked streaming delivery powered by Unified Streaming.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1280&auto=format&fit=crop',
    duration: 734,
    durationFormatted: '12:14',
    videoUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    channel: AUTHENTIC_CHANNELS.vionex,
    viewsCount: '890,400',
    viewsNumeric: 890400,
    likesCount: 42100,
    publishedAt: '1 week ago',
    category: 'Cloud Architecture',
    tags: ['Cloud Architecture', 'HLS Streaming', 'VFX', 'WebRTC'],
    commentsCount: 940
  },
  {
    id: 'vid-demo-007',
    title: 'Cellular Kinetics & Plant Neurobiology: High-Speed Macro Time-Lapse',
    description: 'Microscopic observations of stomata opening, hydraulic turgor pressure, and phototropic signaling in flowering plants at sub-millimeter scales.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1280&auto=format&fit=crop',
    duration: 5,
    durationFormatted: '0:05',
    videoUrl: '/videos/short-1.mp4',
    channel: AUTHENTIC_CHANNELS.lexfridman,
    viewsCount: '980,000',
    viewsNumeric: 980000,
    likesCount: 51200,
    publishedAt: '2 weeks ago',
    category: 'Science',
    tags: ['Science', 'Botany', 'Macro', 'Biology', 'LexFridman'],
    commentsCount: 820
  },
  {
    id: 'vid-demo-008',
    title: 'synthwave radio - chill beats to relax / code / study to 24/7',
    description: 'Continuous live broadcast featuring relaxing beats, synthwave melodies, and atmospheric ambient soundscapes for programmers, creators, and students worldwide.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop',
    duration: 0,
    durationFormatted: 'LIVE',
    videoUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    channel: AUTHENTIC_CHANNELS.lofigirl,
    viewsCount: '14,420,000',
    viewsNumeric: 14420000,
    likesCount: 842000,
    publishedAt: 'Started streaming 5 hours ago',
    category: 'Music',
    tags: ['Music', 'Lofi', 'LiveStream', 'Chill', 'Radio'],
    commentsCount: 18500
  }
];

export const INITIAL_SHORTS: ShortItem[] = [
  {
    id: 'short-001',
    title: 'Real-Time Edge AI Vehicle Detection in 50 Seconds ⚡',
    channel: AUTHENTIC_CHANNELS.fireship,
    likes: '48.2K',
    likesCount: 48200,
    comments: '1,240',
    shares: '8.4K',
    videoUrl: '/videos/short-2.mp4',
    musicTitle: 'Fireship - 100 Seconds of Code Beat',
    tags: ['#ai', '#coding', '#computervision', '#yolo']
  },
  {
    id: 'short-002',
    title: 'Cinematic 4K Extreme Action Camera Breakdown 🚀',
    channel: AUTHENTIC_CHANNELS.mkbhd,
    likes: '89.1K',
    likesCount: 89100,
    comments: '3,100',
    shares: '14.2K',
    videoUrl: '/videos/blue_moon.mp4',
    musicTitle: 'MKBHD Studio Sound - Matte Black Theme',
    tags: ['#tech', '#cameras', '#mkbhd', '#hdr']
  },
  {
    id: 'short-003',
    title: 'Deep Ocean Bioluminescence in Total Darkness 🌊',
    channel: AUTHENTIC_CHANNELS.veritasium,
    likes: '142K',
    likesCount: 142000,
    comments: '4,520',
    shares: '22.8K',
    videoUrl: '/videos/oceans.mp4',
    musicTitle: 'Veritasium Ambient Physics Score',
    tags: ['#science', '#ocean', '#physics', '#nature']
  },
  {
    id: 'short-004',
    title: 'Blender Cycles 4K Open Animation Breakdown 🔥',
    channel: AUTHENTIC_CHANNELS.kurzgesagt,
    likes: '34.5K',
    likesCount: 34500,
    comments: '890',
    shares: '5.2K',
    videoUrl: '/videos/short-3.mp4',
    musicTitle: 'Kurzgesagt Epic Orchestral Theme',
    tags: ['#blender', '#cgi', '#animation', '#art']
  }
];

export const INITIAL_LIVE_STREAMS: LiveStreamItem[] = [
  {
    id: 'live-stream-001',
    title: 'synthwave radio - chill beats to relax / code / study to 24/7',
    channel: AUTHENTIC_CHANNELS.lofigirl,
    viewers: '28,450',
    viewersNumeric: 28450,
    category: 'Music',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop',
    streamUrl: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    startedAt: 'Live 24/7',
    chatMessages: [
      { id: 'cm1', author: 'CodeNinja', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop', message: 'Best lofi beats for late night debugging sessions! 🔥', timestamp: '17:00' },
      { id: 'cm2', author: 'DevLead', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop', message: 'Streaming at 1080p 60fps with zero buffering.', timestamp: '17:01' }
    ]
  },
  {
    id: 'live-stream-002',
    title: 'VIONEX Platform Live Keynote: Distributed WebRTC & Cloud Transcoding',
    channel: AUTHENTIC_CHANNELS.vionex,
    viewers: '14,200',
    viewersNumeric: 14200,
    category: 'Cloud Architecture',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1280&auto=format&fit=crop',
    streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    startedAt: 'Live now',
    chatMessages: [
      { id: 'cm3', author: 'CloudArchitect', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop', message: 'Live WebRTC data mesh telemetry looks fantastic!', timestamp: '17:02' }
    ]
  }
];

export const INITIAL_PLAYLISTS: PlaylistItem[] = [
  {
    id: 'pl-tech-picks',
    title: 'Modern Architecture & Video Systems',
    description: 'Curated technical walkthroughs on streaming, high-throughput pipelines, and distributed nodes.',
    videoCount: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    updatedAt: 'Updated today',
    isPrivate: false,
    videos: ['vid-demo-001', 'vid-demo-002', 'vid-demo-003', 'vid-demo-005']
  },
  {
    id: 'pl-science-physics',
    title: 'Science, Quantum & Space Exploration',
    description: 'Frontier physics, quantum error correction, and celestial engineering masterclasses.',
    videoCount: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600&auto=format&fit=crop',
    updatedAt: 'Updated 2 days ago',
    isPrivate: false,
    videos: ['vid-demo-004', 'vid-demo-007', 'vid-demo-008']
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Fireship uploaded a new video',
    desc: 'Real-Time Edge AI & Object Detection with YOLOv10 in 100 Seconds',
    time: '2h ago',
    unread: true,
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
    videoId: 'vid-demo-003'
  },
  {
    id: 'notif-2',
    title: 'Marques Brownlee published a review',
    desc: 'View From A Blue Moon: 4K Cinematic Action Camera Breakdown',
    time: '4h ago',
    unread: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    videoId: 'vid-demo-002'
  },
  {
    id: 'notif-3',
    title: 'Studio Milestone Reached',
    desc: 'Your channel surpassed 540,000 subscribers! View real-time analytics.',
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
      // Clean out mock items like "ghn" or items with missing/fake videoUrls
      const validCustom = custom.filter(v =>
        v &&
        v.title &&
        v.title.toLowerCase() !== 'ghn' &&
        !v.title.toLowerCase().includes('mock') &&
        v.videoUrl &&
        v.duration > 0
      );
      // Clean up localStorage if invalid items were purged
      if (validCustom.length !== custom.length) {
        localStorage.setItem('vionex_custom_videos', JSON.stringify(validCustom));
      }
      return [...validCustom, ...INITIAL_VIDEOS];
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
  if (IS_SERVER) return ['mkbhd', 'fireship', 'veritasium', 'vionex'];
  try {
    const raw = localStorage.getItem('vionex_subscriptions');
    if (raw) return JSON.parse(raw);
  } catch {}
  return ['mkbhd', 'fireship', 'veritasium', 'vionex'];
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
  if (IS_SERVER) return ['HLS adaptive streaming', 'Next.js 15 Fastify', 'Two-Tower DNN', 'WebRTC Datachannels', 'MKBHD camera review', 'Fireship 100 seconds'];
  try {
    const raw = localStorage.getItem('vionex_recent_searches');
    if (raw) return JSON.parse(raw);
  } catch {}
  return ['HLS adaptive streaming', 'Next.js 15 Fastify', 'Two-Tower DNN', 'WebRTC Datachannels', 'MKBHD camera review', 'Fireship 100 seconds'];
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
