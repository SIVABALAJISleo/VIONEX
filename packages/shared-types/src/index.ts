export type VideoVisibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE' | 'SCHEDULED' | 'MEMBERS_ONLY' | 'PREMIUM' | 'AGE_RESTRICTED';

export type VideoState =
  | 'CREATED'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'VALIDATING'
  | 'QUARANTINED'
  | 'PROCESSING'
  | 'TRANSCODING'
  | 'PACKAGING'
  | 'INDEXING'
  | 'READY'
  | 'PUBLISHED'
  | 'FAILED'
  | 'RETRYING'
  | 'BLOCKED'
  | 'DELETED';

export type UserRole =
  | 'USER'
  | 'CREATOR'
  | 'MODERATOR'
  | 'COPYRIGHT_REVIEWER'
  | 'FINANCE'
  | 'ANALYST'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export type ChannelMemberRole = 'OWNER' | 'MANAGER' | 'EDITOR' | 'MODERATOR' | 'ANALYST';

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  bio?: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface ChannelDTO {
  id: string;
  handle: string;
  name: string;
  description?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  isVerified: boolean;
  subscriberCount: number;
  videoCount: number;
  totalViews: string;
}

export interface VideoDTO {
  id: string;
  channelId: string;
  channel: ChannelDTO;
  title: string;
  description?: string | null;
  state: VideoState;
  visibility: VideoVisibility;
  isShort: boolean;
  duration: number;
  hlsMasterUrl?: string | null;
  thumbnailUrl?: string | null;
  previewSpriteUrl?: string | null;
  viewsCount: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  category: string;
  tags: string[];
  publishedAt?: string | null;
  createdAt: string;
}

export interface CommentDTO {
  id: string;
  videoId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string | null;
  };
  parentId?: string | null;
  content: string;
  isPinned: boolean;
  isCreatorHeart: boolean;
  likesCount: number;
  createdAt: string;
  replies?: CommentDTO[];
}

export interface RecommendationCandidate {
  videoId: string;
  score: number;
  reason: 'SUBSCRIBED_CHANNEL' | 'SIMILAR_TO_WATCHED' | 'TRENDING' | 'CONTINUE_WATCHING' | 'TOPIC_AFFINITY';
}

export interface TelemetryEvent {
  videoId: string;
  viewerSessionHash: string;
  watchedSeconds: number;
  currentPosition: number;
  bufferHealth?: number;
  resolution?: string;
}
