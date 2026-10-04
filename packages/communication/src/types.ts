export type MessageState = 
  | 'DRAFT'
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED'
  | 'RETRYING'
  | 'REDACTED';

export type CallState = 
  | 'IDLE'
  | 'RINGING'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'COMPLETED'
  | 'BUSY'
  | 'MISSED'
  | 'DECLINED'
  | 'FAILED';

export interface VionexContentReference {
  version: '1.0';
  type: 'VIDEO' | 'SHORT' | 'LIVE' | 'PLAYLIST' | 'CHANNEL';
  id: string;
  title: string;
  creatorHandle: string;
  creatorName: string;
  thumbnailUrl: string;
  durationFormatted?: string;
  timestampSec?: number;
  embedRoute: string;
}

export interface DirectMessage {
  id: string;
  clientTransactionId: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  encryptedPayload: string; // Megolm ciphertext
  iv?: string;
  state: MessageState;
  vionexRef?: VionexContentReference;
  attachments?: string[];
  replyToMessageId?: string;
  reactions?: Record<string, string[]>; // { "👍": ["userId1", "userId2"] }
  createdAt: string;
  deliveredAt?: string;
  readAt?: string;
  editedAt?: string;
}

export interface CommunicationDeviceSession {
  deviceId: string;
  deviceName: string;
  platform: 'web' | 'ios' | 'android' | 'desktop';
  status: 'UNVERIFIED' | 'VERIFIED' | 'BLOCKED' | 'REVOKED';
  fingerprint: string;
  lastSeenAt: string;
  createdAt: string;
}

export interface CallRoomCredentials {
  roomId: string;
  token: string;
  wsUrl: string;
  iceServers: { urls: string[]; username?: string; credential?: string }[];
  expiresAt: string;
}

export interface StatusItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  contentType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VIONEX_SHARE';
  text?: string;
  mediaUrl?: string;
  vionexRef?: VionexContentReference;
  viewsCount: number;
  reactions: Record<string, number>;
  createdAt: string;
  expiresAt: string;
  hasViewed: boolean;
}

export interface CommunityTopicItem {
  id: string;
  name: string;
  description: string;
  isAnnouncementOnly: boolean;
  unreadCount: number;
}

export interface CommunitySpaceItem {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  memberCount: number;
  userRole: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER';
  topics: CommunityTopicItem[];
}

export interface BroadcastChannelItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconUrl: string;
  isVerified: boolean;
  followerCount: number;
  isFollowing: boolean;
  latestPost?: {
    content: string;
    createdAt: string;
    viewsCount: number;
    reactionsCount: number;
  };
}

export interface BusinessProfileItem {
  id: string;
  name: string;
  category: string;
  description: string;
  website: string;
  phone: string;
  isVerified: boolean;
  welcomeMessage: string;
  awayMessage: string;
  operatingHours: string;
  catalog: {
    id: string;
    title: string;
    description: string;
    priceFormatted: string;
    imageUrl: string;
    sku: string;
    isAvailable: boolean;
  }[];
}
