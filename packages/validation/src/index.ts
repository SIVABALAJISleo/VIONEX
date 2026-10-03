import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username must be alphanumeric or underscore'),
  displayName: z.string().min(1).max(50),
  password: z.string().min(8).max(128)
});

export const LoginSchema = z.object({
  emailOrUsername: z.string().min(1),
  password: z.string().min(1)
});

export const CreateChannelSchema = z.object({
  name: z.string().min(1).max(100),
  handle: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  description: z.string().max(1000).optional()
});

export const InitiateUploadSchema = z.object({
  channelId: z.string().uuid(),
  title: z.string().min(1).max(150),
  description: z.string().max(5000).optional(),
  filesize: z.number().int().positive(),
  mimeType: z.string(),
  isShort: z.boolean().default(false),
  category: z.string().default('General'),
  visibility: z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE', 'SCHEDULED', 'MEMBERS_ONLY']).default('PUBLIC')
});

export const UpdateVideoMetadataSchema = z.object({
  title: z.string().min(1).max(150).optional(),
  description: z.string().max(5000).optional(),
  tags: z.array(z.string()).max(50).optional(),
  category: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE', 'SCHEDULED', 'MEMBERS_ONLY']).optional(),
  isAgeRestricted: z.boolean().optional(),
  isMadeForKids: z.boolean().optional()
});

export const CreateCommentSchema = z.object({
  videoId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  content: z.string().min(1).max(3000)
});

export const TelemetrySchema = z.object({
  videoId: z.string().uuid(),
  viewerSessionHash: z.string().min(8),
  watchedSeconds: z.number().nonnegative(),
  currentPosition: z.number().nonnegative(),
  bufferHealth: z.number().optional()
});
