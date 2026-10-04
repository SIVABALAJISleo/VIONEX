// ==============================================================================
// VIONEX COMMUNICATION CLIENT ENGINE & E2EE MESSAGING STORE
// ==============================================================================

import { AUTHENTIC_CHANNELS } from './data';

export interface ChatMessage {
  id: string;
  clientTransactionId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  isE2EE: boolean;
  state: 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' | 'REDACTED';
  vionexRef?: {
    type: 'VIDEO' | 'SHORT' | 'LIVE';
    id: string;
    title: string;
    thumbnailUrl: string;
    creatorHandle: string;
    embedRoute: string;
  };
  attachments?: { name: string; url: string; type: string; size: string }[];
  reactions?: Record<string, string[]>;
  replyTo?: { id: string; senderName: string; text: string };
  isEdited?: boolean;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  name: string;
  avatarUrl: string;
  isVerified: boolean;
  isOnline: boolean;
  lastSeenText?: string;
  unreadCount: number;
  isPinned?: boolean;
  lastMessage?: {
    text: string;
    timestamp: string;
    state: 'SENT' | 'DELIVERED' | 'READ';
  };
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: 'web' | 'mobile' | 'desktop';
  status: 'VERIFIED' | 'UNVERIFIED' | 'REVOKED';
  lastActive: string;
  fingerprint: string;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-mkbhd',
    participantId: 'mkbhd',
    name: AUTHENTIC_CHANNELS.mkbhd.name,
    avatarUrl: AUTHENTIC_CHANNELS.mkbhd.avatarUrl,
    isVerified: true,
    isOnline: true,
    unreadCount: 1,
    isPinned: true,
    lastMessage: {
      text: 'Loved the 4K action camera breakdown! Check this new footage.',
      timestamp: '18:42',
      state: 'READ'
    }
  },
  {
    id: 'conv-fireship',
    participantId: 'fireship',
    name: AUTHENTIC_CHANNELS.fireship.name,
    avatarUrl: AUTHENTIC_CHANNELS.fireship.avatarUrl,
    isVerified: true,
    isOnline: false,
    lastSeenText: 'last seen 15m ago',
    unreadCount: 0,
    lastMessage: {
      text: 'YOLOv10 running on WebGPU in 100 seconds is live on the channel!',
      timestamp: '17:15',
      state: 'READ'
    }
  },
  {
    id: 'conv-veritasium',
    participantId: 'veritasium',
    name: AUTHENTIC_CHANNELS.veritasium.name,
    avatarUrl: AUTHENTIC_CHANNELS.veritasium.avatarUrl,
    isVerified: true,
    isOnline: true,
    unreadCount: 0,
    lastMessage: {
      text: 'The ocean trench acoustic telemetry is rendering in 1080p60.',
      timestamp: 'Yesterday',
      state: 'READ'
    }
  },
  {
    id: 'conv-lofigirl',
    participantId: 'lofigirl',
    name: AUTHENTIC_CHANNELS.lofigirl.name,
    avatarUrl: AUTHENTIC_CHANNELS.lofigirl.avatarUrl,
    isVerified: true,
    isOnline: true,
    unreadCount: 2,
    lastMessage: {
      text: 'Synthwave radio chill beats live stream is online 24/7! 🎧',
      timestamp: 'Yesterday',
      state: 'DELIVERED'
    }
  },
  {
    id: 'conv-kurzgesagt',
    participantId: 'kurzgesagt',
    name: AUTHENTIC_CHANNELS.kurzgesagt.name,
    avatarUrl: AUTHENTIC_CHANNELS.kurzgesagt.avatarUrl,
    isVerified: true,
    isOnline: false,
    lastSeenText: 'last seen 2h ago',
    unreadCount: 0,
    lastMessage: {
      text: 'Blender Cycles open CGI master files uploaded to community topic.',
      timestamp: 'Oct 02',
      state: 'READ'
    }
  }
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-mkbhd': [
    {
      id: 'm1',
      clientTransactionId: 'tx-1',
      conversationId: 'conv-mkbhd',
      senderId: 'mkbhd',
      senderName: 'Marques Brownlee',
      senderAvatar: AUTHENTIC_CHANNELS.mkbhd.avatarUrl,
      text: 'Hey! Did you check out the RED 6K cinematic footage from the Blue Moon project?',
      isE2EE: true,
      state: 'READ',
      vionexRef: {
        type: 'VIDEO',
        id: 'vid-demo-002',
        title: 'View From A Blue Moon: 4K Cinematic Action Camera Breakdown',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1280&auto=format&fit=crop',
        creatorHandle: 'mkbhd',
        embedRoute: '/watch/vid-demo-002'
      },
      timestamp: '18:30'
    },
    {
      id: 'm2',
      clientTransactionId: 'tx-2',
      conversationId: 'conv-mkbhd',
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
      text: 'Yes! The dynamic range and aerial gimbals are unbelievable. Watching it right now in 1080p ABR with Web Audio boost.',
      isE2EE: true,
      state: 'READ',
      reactions: { '🔥': ['mkbhd'] },
      timestamp: '18:35'
    },
    {
      id: 'm3',
      clientTransactionId: 'tx-3',
      conversationId: 'conv-mkbhd',
      senderId: 'mkbhd',
      senderName: 'Marques Brownlee',
      senderAvatar: AUTHENTIC_CHANNELS.mkbhd.avatarUrl,
      text: 'Loved the 4K action camera breakdown! Check this new footage.',
      isE2EE: true,
      state: 'READ',
      timestamp: '18:42'
    }
  ],
  'conv-fireship': [
    {
      id: 'm-f1',
      clientTransactionId: 'tx-f1',
      conversationId: 'conv-fireship',
      senderId: 'fireship',
      senderName: 'Fireship',
      senderAvatar: AUTHENTIC_CHANNELS.fireship.avatarUrl,
      text: 'YOLOv10 running on WebGPU in 100 seconds is live on the channel!',
      isE2EE: true,
      state: 'READ',
      vionexRef: {
        type: 'VIDEO',
        id: 'vid-demo-003',
        title: 'Real-Time Edge AI & Object Detection with YOLOv10 in 100 Seconds',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1280&auto=format&fit=crop',
        creatorHandle: 'fireship',
        embedRoute: '/watch/vid-demo-003'
      },
      timestamp: '17:15'
    }
  ],
  'conv-lofigirl': [
    {
      id: 'm-l1',
      clientTransactionId: 'tx-l1',
      conversationId: 'conv-lofigirl',
      senderId: 'lofigirl',
      senderName: 'Lofi Girl',
      senderAvatar: AUTHENTIC_CHANNELS.lofigirl.avatarUrl,
      text: 'Synthwave radio chill beats live stream is online 24/7! 🎧',
      isE2EE: true,
      state: 'DELIVERED',
      vionexRef: {
        type: 'LIVE',
        id: 'vid-demo-008',
        title: 'synthwave radio - chill beats to relax / code / study to 24/7',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1280&auto=format&fit=crop',
        creatorHandle: 'lofigirl',
        embedRoute: '/watch/vid-demo-008'
      },
      timestamp: 'Yesterday'
    }
  ]
};

const IS_BROWSER = typeof window !== 'undefined';

export function getStoredConversations(): Conversation[] {
  if (!IS_BROWSER) return INITIAL_CONVERSATIONS;
  try {
    const raw = localStorage.getItem('vionex_conversations');
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_CONVERSATIONS;
}

export function saveConversations(convs: Conversation[]) {
  if (!IS_BROWSER) return;
  try {
    localStorage.setItem('vionex_conversations', JSON.stringify(convs));
  } catch {}
}

export function getStoredMessages(convId: string): ChatMessage[] {
  if (!IS_BROWSER) return INITIAL_MESSAGES[convId] || [];
  try {
    const raw = localStorage.getItem(`vionex_messages_${convId}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_MESSAGES[convId] || [];
}

export function saveMessages(convId: string, msgs: ChatMessage[]) {
  if (!IS_BROWSER) return;
  try {
    localStorage.setItem(`vionex_messages_${convId}`, JSON.stringify(msgs));
  } catch {}
}

export function sendChatMessage(convId: string, text: string, vionexRef?: any): ChatMessage {
  const allMessages = getStoredMessages(convId);
  const newMsg: ChatMessage = {
    id: 'm-' + Date.now(),
    clientTransactionId: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(7),
    conversationId: convId,
    senderId: 'current-user',
    senderName: 'You',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
    text,
    isE2EE: true,
    state: 'SENT',
    vionexRef,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const updated = [...allMessages, newMsg];
  saveMessages(convId, updated);

  // Update conversation lastMessage
  const convs = getStoredConversations();
  const convIndex = convs.findIndex(c => c.id === convId);
  if (convIndex !== -1) {
    convs[convIndex].lastMessage = {
      text: text || (vionexRef ? `Shared ${vionexRef.title}` : 'Media'),
      timestamp: newMsg.timestamp,
      state: 'SENT'
    };
    saveConversations(convs);
  }

  // Simulate remote recipient delivery & read progression
  setTimeout(() => {
    const cur = getStoredMessages(convId);
    const m = cur.find(msg => msg.id === newMsg.id);
    if (m) {
      m.state = 'DELIVERED';
      saveMessages(convId, cur);
    }
  }, 1200);

  setTimeout(() => {
    const cur = getStoredMessages(convId);
    const m = cur.find(msg => msg.id === newMsg.id);
    if (m) {
      m.state = 'READ';
      saveMessages(convId, cur);
    }
  }, 2800);

  return newMsg;
}

export function addMessageReaction(convId: string, messageId: string, emoji: string) {
  const msgs = getStoredMessages(convId);
  const msg = msgs.find(m => m.id === messageId);
  if (!msg) return;

  if (!msg.reactions) msg.reactions = {};
  if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
  
  if (!msg.reactions[emoji].includes('current-user')) {
    msg.reactions[emoji].push('current-user');
  } else {
    msg.reactions[emoji] = msg.reactions[emoji].filter(u => u !== 'current-user');
    if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
  }

  saveMessages(convId, msgs);
}

export function deleteChatMessage(convId: string, messageId: string) {
  const msgs = getStoredMessages(convId);
  const updated = msgs.map(m => {
    if (m.id === messageId) {
      return { ...m, text: 'This message was deleted', state: 'REDACTED' as const, vionexRef: undefined };
    }
    return m;
  });
  saveMessages(convId, updated);
}

export function getLinkedDevices(): DeviceInfo[] {
  return [
    {
      deviceId: 'dev-web-current',
      deviceName: 'Chrome on Windows (Current Web Session)',
      platform: 'web',
      status: 'VERIFIED',
      lastActive: 'Active now',
      fingerprint: 'ED25519:VIONEX_MASTER_DEV_01'
    },
    {
      deviceId: 'dev-mobile-01',
      deviceName: 'Pixel 9 Pro (Linked Device)',
      platform: 'mobile',
      status: 'VERIFIED',
      lastActive: '34 minutes ago',
      fingerprint: 'ED25519:VIONEX_MOBILE_LINK_77'
    }
  ];
}
