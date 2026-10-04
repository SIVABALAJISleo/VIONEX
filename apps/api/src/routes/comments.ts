import { FastifyInstance } from 'fastify';
import { prisma } from '@vionex/database';
import { CreateCommentSchema } from '@vionex/validation';
import { authenticate } from '../services/auth-middleware';

export async function commentRoutes(app: FastifyInstance) {
  // 1. List comments for video
  app.get('/video/:videoId', async (request, reply) => {
    const { videoId } = request.params as { videoId: string };
    const comments = await prisma.comment.findMany({
      where: { videoId, parentId: null, isDeleted: false },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        replies: {
          where: { isDeleted: false },
          include: {
            user: { select: { id: true, username: true, displayName: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: [{ isPinned: 'desc' }, { likesCount: 'desc' }, { createdAt: 'desc' }]
    });

    return reply.send({ success: true, comments });
  });

  // 2. Post comment (Authenticated & Transactional)
  app.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    const parse = CreateCommentSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({ success: false, errors: parse.error.errors });
    }

    const { videoId, parentId, content } = parse.data;
    const userId = (request as any).user.userId || (request as any).user.id;

    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) {
      return reply.status(404).send({ success: false, code: 'NOT_FOUND', message: 'Video not found' });
    }

    const comment = await prisma.$transaction(async (tx) => {
      const created = await tx.comment.create({
        data: {
          videoId,
          parentId: parentId || null,
          userId,
          content
        },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatarUrl: true } }
        }
      });

      await tx.video.update({
        where: { id: videoId },
        data: { commentsCount: { increment: 1 } }
      });

      return created;
    });

    return reply.status(201).send({ success: true, comment });
  });

  // 3. Delete comment (Owner or Admin)
  app.delete('/:commentId', { preHandler: [authenticate] }, async (request, reply) => {
    const { commentId } = request.params as { commentId: string };
    const user = (request as any).user;
    const userId = user.userId || user.id;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) {
      return reply.status(404).send({ success: false, code: 'NOT_FOUND', message: 'Comment not found' });
    }

    if (comment.userId !== userId && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return reply.status(403).send({ success: false, code: 'FORBIDDEN', message: 'Not authorized to delete this comment' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.comment.update({
        where: { id: commentId },
        data: { isDeleted: true }
      });

      await tx.video.update({
        where: { id: comment.videoId },
        data: { commentsCount: { decrement: 1 } }
      });
    });

    return reply.send({ success: true, message: 'Comment deleted successfully' });
  });
}
