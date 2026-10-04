import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { authenticate } from '../services/auth-middleware';

export async function socialRoutes(app: FastifyInstance) {
  // 1. Subscribe to channel (Authenticated & Transactional)
  app.post('/channels/:channelId/subscribe', { preHandler: [authenticate] }, async (request, reply) => {
    const { channelId } = request.params as { channelId: string };
    const userId = (request as any).user.userId || (request as any).user.id;

    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel) {
      return reply.status(404).send({ success: false, code: 'NOT_FOUND', message: 'Channel not found' });
    }

    // Execute in a transaction to guarantee data integrity
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.subscription.findUnique({
        where: { userId_channelId: { userId, channelId } }
      });

      if (existing) {
        return { subscribed: true, alreadySubscribed: true };
      }

      await tx.subscription.create({
        data: { userId, channelId }
      });

      const updated = await tx.channel.update({
        where: { id: channelId },
        data: { subscriberCount: { increment: 1 } },
        select: { subscriberCount: true }
      });

      return { subscribed: true, subscriberCount: updated.subscriberCount };
    });

    return reply.send({ success: true, ...result });
  });

  // 2. Unsubscribe from channel (Authenticated & Transactional)
  app.post('/channels/:channelId/unsubscribe', { preHandler: [authenticate] }, async (request, reply) => {
    const { channelId } = request.params as { channelId: string };
    const userId = (request as any).user.userId || (request as any).user.id;

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.subscription.findUnique({
        where: { userId_channelId: { userId, channelId } }
      });

      if (!existing) {
        return { subscribed: false, alreadyUnsubscribed: true };
      }

      await tx.subscription.delete({
        where: { userId_channelId: { userId, channelId } }
      });

      const updated = await tx.channel.update({
        where: { id: channelId },
        data: { subscriberCount: { decrement: 1 } },
        select: { subscriberCount: true }
      });

      return { subscribed: false, subscriberCount: updated.subscriberCount };
    });

    return reply.send({ success: true, ...result });
  });

  // 3. Like a video (Authenticated & Transactional)
  app.post('/videos/:videoId/like', { preHandler: [authenticate] }, async (request, reply) => {
    const { videoId } = request.params as { videoId: string };
    const userId = (request as any).user.userId || (request as any).user.id;

    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return reply.status(404).send({ success: false, code: 'NOT_FOUND', message: 'Video not found' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.videoReaction.findUnique({
        where: { videoId_userId: { videoId, userId } }
      });

      if (existing) {
        if (existing.isLike) {
          // Already liked
          return { liked: true, likesCount: video.likesCount };
        } else {
          // Was disliked, switch to like
          await tx.videoReaction.update({
            where: { id: existing.id },
            data: { isLike: true }
          });
          const updated = await tx.video.update({
            where: { id: videoId },
            data: {
              likesCount: { increment: 1 },
              dislikesCount: { decrement: 1 }
            },
            select: { likesCount: true, dislikesCount: true }
          });
          return { liked: true, likesCount: updated.likesCount };
        }
      }

      await tx.videoReaction.create({
        data: { videoId, userId, isLike: true }
      });

      const updated = await tx.video.update({
        where: { id: videoId },
        data: { likesCount: { increment: 1 } },
        select: { likesCount: true }
      });

      return { liked: true, likesCount: updated.likesCount };
    });

    return reply.send({ success: true, ...result });
  });

  // 4. Remove reaction / Unlike (Authenticated & Transactional)
  app.post('/videos/:videoId/unlike', { preHandler: [authenticate] }, async (request, reply) => {
    const { videoId } = request.params as { videoId: string };
    const userId = (request as any).user.userId || (request as any).user.id;

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.videoReaction.findUnique({
        where: { videoId_userId: { videoId, userId } }
      });

      if (!existing) {
        return { liked: false };
      }

      await tx.videoReaction.delete({
        where: { id: existing.id }
      });

      const updateData = existing.isLike
        ? { likesCount: { decrement: 1 } }
        : { dislikesCount: { decrement: 1 } };

      const updated = await tx.video.update({
        where: { id: videoId },
        data: updateData,
        select: { likesCount: true, dislikesCount: true }
      });

      return { liked: false, likesCount: updated.likesCount };
    });

    return reply.send({ success: true, ...result });
  });

  // 5. Query user interaction status for a video
  app.get('/videos/:videoId/status', async (request, reply) => {
    const { videoId } = request.params as { videoId: string };
    let userId: string | null = null;
    try {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { AuthService } = await import('@vionex/auth');
        const payload = AuthService.verifyAccessToken(token);
        if (payload) userId = payload.userId;
      }
    } catch {}

    if (!userId) {
      return reply.send({ success: true, isLiked: false, isDisliked: false });
    }

    const reaction = await prisma.videoReaction.findUnique({
      where: { videoId_userId: { videoId, userId } }
    });

    return reply.send({
      success: true,
      isLiked: reaction ? reaction.isLike : false,
      isDisliked: reaction ? !reaction.isLike : false
    });
  });

  // Aliases
  app.post('/subscribe/:channelId', { preHandler: [authenticate] }, async (req, rep) => {
    return (app as any).inject({
      method: 'POST',
      url: `/api/v1/social/channels/${(req.params as any).channelId}/subscribe`,
      headers: req.headers
    }).then((res: any) => rep.status(res.statusCode).send(res.payload));
  });

  app.post('/unsubscribe/:channelId', { preHandler: [authenticate] }, async (req, rep) => {
    return (app as any).inject({
      method: 'POST',
      url: `/api/v1/social/channels/${(req.params as any).channelId}/unsubscribe`,
      headers: req.headers
    }).then((res: any) => rep.status(res.statusCode).send(res.payload));
  });
}
