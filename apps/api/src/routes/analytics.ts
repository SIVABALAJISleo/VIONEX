import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { TelemetrySchema } from '@vionex/validation';
import { authenticate } from '../services/auth-middleware';

export async function analyticsRoutes(app: FastifyInstance) {
  // 1. Deduplicated View & Watch Time Telemetry Beacon
  app.post('/telemetry', async (request, reply) => {
    const parse = TelemetrySchema.safeParse(request.body);
    if (!parse.success) return reply.status(400).send({ success: false, errors: parse.error.errors });

    const { videoId, viewerSessionHash, watchedSeconds, currentPosition } = parse.data;

    // View registered once viewer has watched at least 30 cumulative seconds
    if (watchedSeconds >= 30) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if view already recorded today for this session
      const existingView = await prisma.view.findFirst({
        where: {
          videoId,
          viewerHash: viewerSessionHash,
          createdAt: { gte: today }
        }
      });

      if (!existingView) {
        await prisma.view.create({
          data: {
            videoId,
            viewerHash: viewerSessionHash,
            watchedSeconds,
            completed: false
          }
        });

        await prisma.video.update({
          where: { id: videoId },
          data: { viewsCount: { increment: 1 } }
        });
      }
    }

    return reply.send({ success: true, recorded: true });
  });

  // 2. Authenticated Watch Progress & History Tracking
  app.post('/watch-history', { preHandler: [authenticate] }, async (request, reply) => {
    const { videoId, lastPosition, duration } = request.body as any;
    const userId = (request as any).user.userId || (request as any).user.id;

    if (!videoId) {
      return reply.status(400).send({ success: false, message: 'videoId required' });
    }

    await prisma.$transaction(async (tx) => {
      // Upsert watch history
      await tx.watchHistory.upsert({
        where: { userId_videoId: { userId, videoId } },
        create: { userId, videoId, viewedAt: new Date() },
        update: { viewedAt: new Date() }
      });

      // Upsert watch progress
      if (typeof lastPosition === 'number') {
        await tx.watchProgress.upsert({
          where: { userId_videoId: { userId, videoId } },
          create: {
            userId,
            videoId,
            lastPosition,
            duration: duration || 0
          },
          update: {
            lastPosition,
            duration: duration || 0
          }
        });
      }
    });

    return reply.send({ success: true, message: 'Watch progress saved' });
  });

  // 3. Creator Studio Real Analytics Aggregation
  app.get('/creator/:channelId', { preHandler: [authenticate] }, async (request, reply) => {
    const { channelId } = request.params as { channelId: string };

    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        videos: {
          select: {
            id: true,
            title: true,
            viewsCount: true,
            likesCount: true,
            commentsCount: true,
            createdAt: true
          },
          orderBy: { viewsCount: 'desc' },
          take: 5
        }
      }
    });

    if (!channel) {
      return reply.status(404).send({ success: false, message: 'Channel not found' });
    }

    // Aggregate real watch time and views across all channel videos
    const totalViews = channel.videos.reduce((sum, v) => sum + Number(v.viewsCount), 0);
    const totalLikes = channel.videos.reduce((sum, v) => sum + v.likesCount, 0);
    const totalComments = channel.videos.reduce((sum, v) => sum + v.commentsCount, 0);

    return reply.send({
      success: true,
      analytics: {
        channelId: channel.id,
        channelName: channel.name,
        subscriberCount: channel.subscriberCount,
        totalVideos: channel.videos.length,
        totalViews,
        totalLikes,
        totalComments,
        topVideos: channel.videos.map(v => ({
          ...v,
          viewsCount: v.viewsCount.toString()
        }))
      }
    });
  });
}
